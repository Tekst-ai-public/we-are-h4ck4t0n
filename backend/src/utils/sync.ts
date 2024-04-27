import FacebookClient from "./facebookClient";
import { Post } from "./facebookTypes";
import prisma from "./prisma";
import { categorize,CategorizeInput } from "./categorizeutils";

export default async function sync(pageId:string,fb:FacebookClient) {

    try {
    const posts = await fb.getPostsByPage(pageId);
    console.log(JSON.stringify(posts));
    for (const post of posts.data) {
        console.log(`syncing post ${post.id}`);
        await syncPost(post,pageId,fb);
    // const firstPost = posts.data[0];
    // const firstPostComments = await fb.getCommentsByPost(firstPost.id,accessToken);
    // console.log(JSON.stringify(firstPostComments));
    }
    return posts;
    }
    catch (error) {
        console.log(error);
    }
}

async function syncPost(post:Post,pageId:string,fb:FacebookClient) {
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
        }, update: {}
    })
    
    const comments = await fb.getCommentsByPost(post.id);
    const settings = await getSettings(pageId);

    console.log(JSON.stringify(comments));
    for (const comment of comments.data) {
        console.log(comment.id);
        console.log(comment.message);
        const commentType = await geAI(comment.message,settings);
        console.log(commentType);

        const author = await prisma.users.findFirst({
            where: {
                id: comment.from.id
            }
        })
        if (!author) {
            await prisma.users.create({
               
                data: {
                    id: comment.from.id,
                    name: comment.from.name,
                }
            })}

        await prisma.comments.upsert({
            where: {
                id: comment.id
            },
            create: {
                id: comment.id,
                createdAt: new Date(comment.created_time).toISOString(),
                content: comment.message,
                authorId: author? author.id : comment.from.id,
                meta: commentType as any,
                postId: post.id,
            }, update: {}
        })
    }
}


async function getSettings(pageId:string):Promise<Omit<CategorizeInput, 'actual'>> {
    const page = await prisma.page.findFirst({
        where: {
            id: pageId
        }
    })
    if (!page) {
        throw new Error('Page not found');
    }
    const settings:Omit<CategorizeInput, 'actual'> = {
        sysprompt:"You are a comment topic extractor",
        labels:["hatefull","nothatefull"],
        examples:[{
          comment: "this is a racist quote",
          output:{
            comment_type:"hatefull"
          }},
          {
          comment: "ik ga hier totaal niet mee akkoord",
          output:{
            "comment_type":"nothatefull"
          }
        },
        {
          comment: "tu as tout à fait raison",
          output:{
            "comment_type":"nothatefull"
          }
        }]
      }
    return settings;
}


async function geAI(message:string,cat:Omit<CategorizeInput, 'actual'>):Promise<Object> {
    const result = await categorize({...cat,actual:{comment:message}});
    return result;
}