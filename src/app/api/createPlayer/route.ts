import {NextRequest, NextResponse} from "next/server";
import mongoClientPromise, {dbName} from "@/utils/mongodb";

/**
 * POST /api/createPlayer
 * Body JSON : { player }
 *
 * Create a player with his name and the campaign associated (other data will be added with updatePlayer
 *
 */

export async function POST(req: NextRequest) {
    try {
        const player = await req.json();
        if (!player) {
            return NextResponse.json({ message: "player obj is required" }, { status: 400 });
        }

        const name = player.name;
        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const playerCollection = db.collection("players");

        const existingPlayer = await playerCollection.findOne({ name: name });
        if (existingPlayer) {
            return NextResponse.json({ message: "Player already exists" }, { status: 401 });
        }

        const result = await playerCollection.insertOne(player);

        return NextResponse.json({ message: "Player registered", campaignId: result.insertedId }, {status: 201});
    } catch (err) {
        console.log("Error during player creation", err);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}