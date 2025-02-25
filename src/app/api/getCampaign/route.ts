import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

/**
 * POST /api/getCampaign
 * Body JSON : { username }
 *
 * Get all campaign for an user
 *
 */

export  async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json({ message: "an username is required" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const campaignCollection = db.collection("campaigns");

        const fetchList = campaignCollection.find({
            username: username.toString(),
        }).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No Campaigns for this user " + username });
        }

        const campaignList = (await fetchList).map(campaign => ({
            name: campaign.name,
            playerCount: campaign.playerCount,
            username: campaign.username,
            currentScene: campaign.currentScene,
        }));

        return NextResponse.json({ message: "Campaigns for this user : ", campaignList: campaignList, status: 201 });
    } catch (err) {
        console.log("Error while fetching campaigns",err);
    }
}