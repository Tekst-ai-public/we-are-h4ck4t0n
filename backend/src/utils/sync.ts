import FacebookClient from "./facebookClient";
import { Post } from "./facebookTypes";
import prisma from "./prisma";
import { categorize, CategorizeInput } from "./categorizeutils";

export default async function sync(pageId: string, fb: FacebookClient) {

  try {
    const posts = await fb.getPostsByPage(pageId);
    await Promise.allSettled(posts.data.map(async post => {
      console.log(`syncing post ${post.id}`);
      await syncPost(post, pageId, fb);
    }))
    return posts;
  }
  catch (error) {
    console.log(error);
  }
}

async function syncPost(post: Post, pageId: string, fb: FacebookClient) {
  console.log(JSON.stringify(post));

  await prisma.posts.upsert({
    where: {
      id: post.id
    },
    create: {
      id: post.id,
      createdAt: new Date(post.created_time).toISOString(),
      content: post.message,
      meta: {},
      pageId: pageId,
    }, update: {
      content: post.message,
    }
  })

  const comments = await fb.getCommentsByPost(post.id);
  const settings = await getSettings(pageId);

  console.log(`processing ${comments.data.length} comments`)

  await Promise.allSettled(comments.data.map(async comment => {
    const commentEntry = await prisma.comments.findUnique({
      where: {
        id: comment.id
      }
    })
    if (commentEntry) {
      // comments are sorted by date (reverse_chronological), so if we find a comment that already exists, we can stop
      return;
    }

    const commentType = await geAI(comment.message, settings);

    const author = await prisma.users.findFirst({
      where: {
        id: comment.from?.id
      }
    })
    if (!author && comment.from && comment.from.id) {
      await prisma.users.create({
        data: {
          id: comment.from.id,
          name: comment.from.name,
        }
      })
    }

    await prisma.comments.upsert({
      where: {
        id: comment.id
      },
      create: {
        id: comment.id,
        createdAt: new Date(comment.created_time).toISOString(),
        content: comment.message,
        authorId: author ? author.id : comment.from?.id,
        meta: commentType as any,
        postId: post.id,
      }, update: {
        content: comment.message,
      }
    })

  }))
}


async function getSettings(pageId: string): Promise<Omit<CategorizeInput, 'actual'>> {
  const page = await prisma.page.findFirst({
    where: {
      id: pageId
    },
    select: {
      settings: true
    }
  })
  if (!page) {
    throw new Error('Page not found');
  }
  const settings: Omit<CategorizeInput, 'actual'> = page.settings.prompt;
  if (!settings) {
    throw new Error('Settings not found');
  }
  return settings;
}


async function geAI(message: string, cat: Omit<CategorizeInput, 'actual'>): Promise<Object> {
  const result = await categorize({ ...cat, actual: { comment: message } });
  return result;
}
