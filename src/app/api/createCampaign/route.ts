import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

/**
 * POST /api/createCampain
 * Body JSON : { name, username }
 *
 * Create a campaign with his name and username of the creator
 *
 */

export async function POST(req: NextRequest) {
    try {
        const { name, username } = await req.json();
        if (!name || !username) {
            return NextResponse.json({ message: "campaign name AND username are required" }, { status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const campaignCollection = db.collection("campaigns");

        const existingCampaign = await campaignCollection.findOne({ name });
        if (existingCampaign) {
            return NextResponse.json({ message: "Campaign already exists" }, { status: 401 });
        }

        const result = await campaignCollection.insertOne({ name, username });

        return NextResponse.json({ message: "Campaign registered", campaignId: result.insertedId }, {status: 201});
    } catch (err) {
        console.log("Error during campaign creation", err);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}