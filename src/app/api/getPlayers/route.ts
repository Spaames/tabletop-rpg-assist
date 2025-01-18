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
            id: player.id,
            name: player.name,
            lvl: player.lvl,
            sex: player.sex,
            age: player.age,
            height: player.height,
            weight: player.weight,
            race: player.race,
            class: player.class,
            HP: player.HP,
            currentHealth: player.currentHealth,
            HD: player.HD,
            STR: player.STR,
            DEX: player.DEX,
            CON: player.CON,
            INT: player.INT,
            WIS: player.WIS,
            CHA: player.CHA,
            DEF: player.DEF,
            INIT: player.INIT,
            weapons: player.weapons,
            abilities: player.abilities,
            bonus: player.bonus,
            malus: player.malus,
            specialRules: player.specialRules,
            inventory: player.inventory,
            picture: player.picture,
            campaign: player.campaign,
        }));

        return NextResponse.json({ message: "player for this campaign", playerList: playerList, status: 201 });
    } catch (err) {
        console.log("Error while fetching players",err);
    }
}