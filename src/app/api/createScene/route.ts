import { NextRequest, NextResponse} from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body) {
            return NextResponse.json({ message: "Player data is required" }, { status: 400 });
        }

        const background = body.background;

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        const existingScene = await sceneCollection.findOne({ background: background });
        if (existingScene) {
            return NextResponse.json({ message: "Scene already exists" }, { status: 400 });
        }

        const result = await sceneCollection.insertOne(body);

        return NextResponse.json({message: "Scene registered : " + result.insertedId});
    } catch (error) {
        console.log("Error during player creation", error);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}