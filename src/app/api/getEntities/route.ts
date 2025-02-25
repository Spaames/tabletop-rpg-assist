import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

/**
 * POST /api/getEntities
 * Body JSON : { campaignName }
 *
 * Get all entities for a specific campaign
 *
 */

export  async function POST(req: NextRequest) {
    try {
        const { campaignName } = await req.json();
        if (!campaignName) {
            return NextResponse.json({ message: "campaign name is required" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const entityCollection = db.collection("entities");

        const fetchList = entityCollection.find({
            campaign: campaignName.toString(),
        }).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No entities for this campaign " + campaignName });
        }

        const entityList = (await fetchList).map(entity => ({
            campaign: entity.campaign,
            name: entity.name,
            picture: entity.picture,
            HP: entity.HP,
            STR: entity.STR,
            DEX: entity.DEX,
            INT: entity.INT,
            DEF: entity.DEF,
            damage: entity.DAMAGE,
            particularity: entity.particularity,
        }));

        return NextResponse.json({ message: "entities for this campaign", entityList: entityList, status: 201 });
    } catch (err) {
        console.log("Error while fetching entities",err);
    }
}