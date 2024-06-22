import { Post } from "@/db/models/post.model";
import connectMongo from "@/db/utils/connect-mongo.db";
import { NextRequest, NextResponse } from "next/server";

async function newPost(req: NextRequest) {
  try {
    const body = await req.json();
    const authorId = req.headers.get("x-middleware-userid");

    await connectMongo();

    const { content, isPublic } = body;
    const newPostData = {
      content: content,
      isPublic: typeof isPublic === "boolean" ? isPublic : false,
      author: authorId || "",
    };

    const newPost = await Post.create(newPostData);

    return NextResponse.json(
      { message: "New post created", postId: newPost._id },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.error().json();
  }
}

async function getPosts(req: NextRequest) {
  try {
    const authorId = req.headers.get("x-middleware-userid");

    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 });

    return NextResponse.json(
      { data: posts, count: posts ? posts.length : 0 },
      { status: !posts || posts.length === 0 ? 204 : 200 }
    );
  } catch (error) {
    return NextResponse.error().json();
  }
}

export { getPosts as GET, newPost as POST };
