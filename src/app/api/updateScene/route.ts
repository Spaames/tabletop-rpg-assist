import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

export async function PUT(req: NextRequest) {
    try {
        const updatedScene = await req.json();
        console.log(updatedScene);

        if (!updatedScene) {
            return NextResponse.json({ message: "Invalid Scene Data" }, {status: 400});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        const filter = { background: updatedScene.background };

        const updateDoc = { $set: updatedScene };

        const result = await sceneCollection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Scene not found" }, { status: 400 });
        }

        return NextResponse.json({ message: "Scene updated successfully" }, {status: 200});
    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Failed to save scene", status: 500 });
    }
}