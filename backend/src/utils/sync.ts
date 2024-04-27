import FacebookClient from "./facebookClient";

export default async function sync(pageId:string,fb:FacebookClient) {

    
    const posts = await fb.getPostsByPage(pageId);
    for (const post of posts.data) {
        console.log(post.id);
        await syncPost(post,fb);
    // const firstPost = posts.data[0];
    // const firstPostComments = await fb.getCommentsByPost(firstPost.id,accessToken);
    // console.log(JSON.stringify(firstPostComments));
    return posts;
    }
}

async function syncPost(post:any,fb:FacebookClient) {
    const comments = await fb.getCommentsByPost(post.id);
    for (const comment of comments.data) {
        console.log(comment.id);
        console.log(comment.message);
    }
}
