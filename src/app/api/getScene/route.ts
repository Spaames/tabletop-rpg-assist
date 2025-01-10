import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

export async function POST(req: NextRequest) {
    try {
        const { background } = await req.json();
        if (!background) {
            return NextResponse.json({ message: "No background provided", status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        const scene = await sceneCollection.findOne({ background });

        if (!scene) {
            return NextResponse.json({ message: "No scene found for this background", status: 404 });
        }

        const sceneData = {
            background: scene.background,
            music: scene.music,
            cards: scene.cards, // Si les cartes sont stockées comme dans votre modèle
        };

        return NextResponse.json({ message: "Scene retrieved successfully", scene: sceneData, status: 200 });
    } catch (err) {
        console.error("Error while fetching scene:", err);
        return NextResponse.json({ message: "Error while fetching scene", status: 500 });
    }
}
