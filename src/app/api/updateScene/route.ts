import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";
import { Card } from "@/redux/features/sceneSlice";

/**
 * POST /api/updateScene
 * Body JSON : { background, music, cards, isFighting, fightingOrder }
 *
 * Met à jour la scène ayant "background" ou la crée si elle n'existe pas.
 */
export async function POST(request: NextRequest) {
    try {
        const {
            background,
            music,
            cards,
            isFighting,
            fightingOrder
        } = await request.json();

        if (!background) {
            return NextResponse.json(
                { message: "No background provided", status: 400 },
                { status: 400 }
            );
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const sceneCollection = db.collection("scenes");

        const existing = await sceneCollection.findOne({ background });

        if (!existing) {
            const newScene = {
                background,
                music: typeof music === "string" ? music : "",
                cards: Array.isArray(cards) ? cards : [],
                isFighting: typeof isFighting === "boolean" ? isFighting : false,
                fightingOrder: Array.isArray(fightingOrder) ? fightingOrder : [],
            };

            await sceneCollection.insertOne(newScene);

            return NextResponse.json(
                {
                    message: "Scene created (didn't exist)",
                    scene: newScene,
                    status: 201,
                },
                { status: 201 }
            );
        }

        const updateFields: {
            music?: string;
            cards?: Card[];
            isFighting?: boolean;
            fightingOrder?: number[];
        } = {};

        if (typeof music === "string") {
            updateFields.music = music;
        }
        if (Array.isArray(cards)) {
            updateFields.cards = cards;
        }
        if (typeof isFighting === "boolean") {
            updateFields.isFighting = isFighting;
        }
        if (Array.isArray(fightingOrder)) {
            updateFields.fightingOrder = fightingOrder;
        }

        await sceneCollection.updateOne(
            { background },
            { $set: updateFields }
        );

        const updatedScene = await sceneCollection.findOne({ background });
        console.log("updatedScene =>", updatedScene);

        return NextResponse.json({
            message: "Scene updated successfully",
            scene: updatedScene,
            status: 200,
        });

    } catch (error) {
        console.error("Error while updating scene:", error);
        return NextResponse.json(
            { message: "Error while updating scene", status: 500 },
            { status: 500 }
        );
    }
}
