import { Wall } from "@/db/models/wall.model";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function deleteEmailPerm(
  req: NextRequest,
  { params: { wallId } }: { params: { wallId: string } }
) {
  try {
    const body = (await req.json()) as { email: string };
    const { email } = body;

    if (!ObjectId.isValid(wallId)) {
      return NextResponse.json({ message: "Invalid wall id" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const foundWall = await Wall.findById(wallId);

    if (!foundWall) {
      return NextResponse.json({ message: "Wall not found" }, { status: 404 });
    }

    let sharedWith: string[] = foundWall.privacy.sharedWith;

    if (!Array.isArray(sharedWith)) {
      sharedWith = [];
    } else {
      sharedWith = sharedWith.filter((e) => e !== email);
    }

    foundWall.privacy.sharedWith = sharedWith;
    await foundWall.save();

    return NextResponse.json(
      { message: `Remove \"${email}\" from wall id \"${wallId}\"` },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function addNewEmail(
  req: NextRequest,
  { params: { wallId } }: { params: { wallId: string } }
) {
  try {
    if (!ObjectId.isValid(wallId)) {
      return NextResponse.json({ message: "Invalid wall id" }, { status: 400 });
    }

    const body = (await req.json()) as { email: string };
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const foundWall = await Wall.findById(wallId);

    if (!foundWall) {
      return NextResponse.json({ message: "Wall not found" }, { status: 404 });
    }

    let sharedWith: string[] = foundWall.privacy.sharedWith;

    if (!Array.isArray(sharedWith)) {
      sharedWith = [];
    } else {
      sharedWith.push(email.toLowerCase());
    }

    foundWall.privacy.sharedWith = sharedWith;
    await foundWall.save();

    return NextResponse.json(
      { message: `Added \"${email}\" to wall id \"${wallId}\"` },
      { status: 200 }
    );
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export { deleteEmailPerm as DELETE, addNewEmail as POST };
