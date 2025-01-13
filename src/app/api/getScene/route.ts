import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

/**
 * POST /api/getScene
 * Body JSON : { background }
 *
 * Renvoie la scène ayant ce background, s'il existe.
 */
export async function POST(request: NextRequest) {
    try {
        const { background } = await request.json();
        if (!background) {
            return NextResponse.json(
                { message: "No background provided", status: 400 },
                { status: 400 }
            );
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        // Cherche la scène
        const scene = await sceneCollection.findOne({ background });
        if (!scene) {
            return NextResponse.json(
                { message: `No scene found for background: ${background}`, status: 404 },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Scene retrieved successfully",
            scene,
            status: 200,
        });
    } catch (error) {
        console.error("Error while fetching one scene:", error);
        return NextResponse.json(
            { message: "Error while fetching one scene", status: 500 },
            { status: 500 }
        );
    }
}
