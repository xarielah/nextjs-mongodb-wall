import { Wall } from "@/db/models/wall.model";
import connectMongo from "@/db/utils/connect-mongo.db";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

async function updateWallSettings(
  req: NextRequest,
  { params: { wallId } }: { params: { wallId: string } }
) {
  try {
    if (!wallId || !ObjectId.isValid(wallId)) {
      return NextResponse.json({ message: "Invalid wall id" }, { status: 400 });
    }

    await connectMongo();
    const foundWall = await Wall.findById(wallId);

    if (foundWall === null) {
      return NextResponse.json({ message: "Wall not found" }, { status: 404 });
    }

    const body = await req.json();
    const { preferences, privacy } = body;

    const { shareWithAll } = privacy;

    if (typeof shareWithAll === "boolean") {
      foundWall.privacy.shareWithAll = shareWithAll;
    }

    const { defaultRTL, defaultPublic } = preferences;

    if (typeof defaultRTL === "boolean") {
      foundWall.preferences.defaultRTL = defaultRTL;
    }

    if (typeof defaultPublic === "boolean") {
      foundWall.preferences.defaultPublic = defaultPublic;
    }

    const updatedSettingsRecord = await foundWall.save();

    return NextResponse.json(
      {
        message: `Wall settings updated for wall id ${wallId}`,
        updatedSettings: {
          preferences: updatedSettingsRecord.preferences,
          privacy: updatedSettingsRecord.privacy,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export { updateWallSettings as PUT };
