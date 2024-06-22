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
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 500 }
    );
  }
}

async function getPosts(req: NextRequest) {
  try {
    const authorId = req.headers.get("x-middleware-userid");

    await connectMongo();
    const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 });

    const postsDataResponse = { data: posts, count: posts ? posts.length : 0 };

    return NextResponse.json(postsDataResponse, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export { getPosts as GET, newPost as POST };
