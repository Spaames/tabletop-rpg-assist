import { NextResponse, NextRequest } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

export async function PUT(req: NextRequest) {
    try {
        const updatedEntities = await req.json();
        console.log(updatedEntities);

        if (!Array.isArray(updatedEntities) || updatedEntities.length === 0) {
            return NextResponse.json({ message: "Invalid Entity Data" }, { status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const collection = db.collection("entities");

        const updatePromises = updatedEntities.map(async (entity) => {
            if (!entity.name || !entity.campaign) {
                throw new Error("Invalid entity: missing 'name' or 'campaign'.");
            }

            const filter = { name: entity.name, campaign: entity.campaign };
            const updateDoc = { $set: entity };

            return collection.updateOne(filter, updateDoc, { upsert: true });
        });

        const results = await Promise.allSettled(updatePromises);

        const successCount = results.filter((res) => res.status === "fulfilled").length;
        const failedCount = results.length - successCount;

        return NextResponse.json({
            message: `Entities updated successfully: ${successCount}, Failed: ${failedCount}`,
            entityList: updatedEntities,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to update entities" }, { status: 500 });
    }
}
