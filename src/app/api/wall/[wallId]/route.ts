import { Post } from "@/db/models/post.model";
import { Wall } from "@/db/models/wall.model";
import connectMongo from "@/db/utils/connect-mongo.db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function getWallPosts(
  req: NextRequest,
  { params: { wallId } }: { params: { wallId: string } }
) {
  try {
    if (!wallId || !ObjectId.isValid(wallId)) {
      return NextResponse.json({ message: "Invalid wall id" }, { status: 400 });
    }

    const requestorId = req.headers.get("x-middleware-userid");
    const requestorEmail = req.headers.get("x-middleware-useremail") || "";

    await connectMongo();
    const foundWall = await Wall.findById(wallId);

    if (foundWall === null) {
      return NextResponse.json({ message: "Wall not found" }, { status: 404 });
    }

    const sharedWith = foundWall.privacy.sharedWith.map((email: string) =>
      email.toLowerCase()
    );

    if (
      sharedWith.indexOf(requestorEmail) === -1 &&
      !foundWall.shareWithAll &&
      !foundWall.user.equals(requestorId)
    ) {
      return NextResponse.json(
        { message: "Unauthorized to view the wall" },
        { status: 401 }
      );
    }

    const posts = await Post.aggregate([
      {
        $match: {
          isPublic: true,
          author: foundWall.user,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $project: {
          "author.email": 0,
          "author.createdAt": 0,
          "author.updatedAt": 0,
          "author.__v": 0,
          "author.emailVerified": 0,
          "author._id": 0,
          _id: 0,
          isPinned: 0,
          isPublic: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]).sort({
      createdAt: -1,
    });

    const postsDataResponse = {
      data: posts,
      count: posts ? posts.length : 0,
      requestorIsOwner: foundWall.user.equals(requestorId),
    };

    return NextResponse.json(postsDataResponse, { status: 200 });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 500 }
    );
  }
}

export { getWallPosts as GET };
