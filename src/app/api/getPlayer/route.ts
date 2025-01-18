import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

/**
 * POST /api/getPlayer
 * Body JSON : { id }
 *
 * Renvoie le player ayant cet id, s'il existe.
 */
export async function POST(request: NextRequest) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json(
                { message: "No id provided", status: 400 },
                { status: 400 }
            );
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const playerCollection = db.collection("players");

        // Cherche la scène
        const player = await playerCollection.findOne({ id });
        if (!player) {
            return NextResponse.json(
                { message: `No player found for this id: ${id}`, status: 404 },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "player retrieved successfully",
            player: player,
            status: 200,
        });
    } catch (error) {
        console.error("Error while fetching one plauer:", error);
        return NextResponse.json(
            { message: "Error while fetching one plyer", status: 500 },
            { status: 500 }
        );
    }
}
