import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

export  async function POST(req: NextRequest) {
    try {
        const { username } = await req.json();
        if (!username) {
            return NextResponse.json({ message: "No username ??" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const campaignCollection = db.collection("campaigns");

        const fetchList = campaignCollection.find({
            username: username.toString(),
        }).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No Campaign for this user " + username });
        }

        const campaignList = (await fetchList).map(campaign => ({
            name: campaign.name,
            playerCount: campaign.playerCount,
            username: campaign.username,
        }));

        return NextResponse.json({ message: "Campaigns for this user", campaignList: campaignList, status: 201 });
    } catch (err) {
        console.log("Error while fetching campaign",err);
    }
}