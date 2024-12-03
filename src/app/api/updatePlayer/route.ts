import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";


export async function PUT(req: NextRequest) {
    try {
        const updatedPlayer = await req.json();
        console.log(updatedPlayer);

        if (!updatedPlayer) {
            return NextResponse.json({ message: "Invalid Player Data" }, {status: 400});
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const collection = db.collection("players");

        const filter = { name: updatedPlayer.name };

        const updateDoc = { $set: updatedPlayer };

        const result = await collection.updateOne(filter, updateDoc);

        if (result.matchedCount === 0) {
            return NextResponse.json({ message: "Player not found" }, { status: 404 });
        }

        console.log(result);

        return NextResponse.json({ message: "Player updated successfully" }, { status: 200 });

    } catch (e) {
        console.log(e);
        return NextResponse.json({ message: "Failed to save Player", status: 500 });
    }
}