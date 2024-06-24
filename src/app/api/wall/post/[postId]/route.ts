import { Post } from "@/db/models/post.model";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function deletePost(
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } }
) {
  try {
    if (ObjectId.isValid(postId) === false) {
      return NextResponse.json({ message: "Invalid post id" }, { status: 400 });
    }

    const authorId = req.headers.get("x-middleware-userid");

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      author: authorId,
    });

    if (!deletedPost) {
      return NextResponse.json(
        { message: "Post not found or you are not the author of the post" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: `Post ${deletedPost._id.toString()} deleted` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting post" },
      { status: 500 }
    );
  }
}

export { deletePost as DELETE };
