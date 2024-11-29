import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

export  async function POST(req: NextRequest) {
    try {
        const { campaign } = await req.json();
        if (!campaign) {
            return NextResponse.json({ message: "No campaign ??" });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const playerCollection = db.collection("players");

        const fetchList = playerCollection.find({
            campaign: campaign.toString(),
        }).toArray();

        if ((await fetchList).length === 0) {
            return NextResponse.json({ message: "No player for this campaign " + campaign });
        }

        const playerList = (await fetchList).map(player => ({
            name: player.name,
            HP: player.HP,
            STR: player.STR,
            DEX: player.DEX,
            CON: player.CON,
            INT: player.INT,
            WIS: player.WIS,
            CHA: player.CHA,
            DEF: player.DEF,
            weapons: player.weapons,
            abilities: player.abilities,
            inventory: player.inventory,
            picture: player.picture,
            campaign: player.campaign,
        }));

        return NextResponse.json({ message: "player for this campaign", playerList: playerList, status: 201 });
    } catch (err) {
        console.log("Error while fetching players",err);
    }
}