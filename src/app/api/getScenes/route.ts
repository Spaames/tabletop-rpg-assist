import { NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

export async function GET() {
    try {

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        const scenes = await sceneCollection.find().toArray();

        if (scenes.length === 0) {
            return NextResponse.json({ message: "No scenes found in the database", status: 404 });
        }

        const listScenes = scenes.map(scene => ({
            background: scene.background,
            music: scene.music,
            cards: scene.cards,
        }));

        return NextResponse.json({ message: "Scenes retrieved successfully", scenes: listScenes, status: 200 });
    } catch (err) {
        console.error("Error while fetching all scenes:", err);
        return NextResponse.json({ message: "Error while fetching all scenes", status: 500 });
    }
}
