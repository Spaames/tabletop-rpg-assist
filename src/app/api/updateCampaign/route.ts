import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/utils/mongodb";
import { dbName } from "@/utils/mongodb";

/**
 * POST /api/updateCampaign
 * Body JSON : { username, campaignName, currentScene }
 *
 * Met à jour la campagne ayant { username, name = campaignName } en lui affectant
 * currentScene = la valeur envoyée.
 */
export async function POST(req: NextRequest) {
    try {
        // 1) Lire le body
        const { username, campaignName, currentScene } = await req.json();

        if (!username || !campaignName) {
            return NextResponse.json(
                { message: "username or campaignName missing", status: 400 },
                { status: 400 }
            );
        }

        // 2) Connexion Mongo
        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const campaignCollection = db.collection("campaigns");

        // 3) Vérifier que la campagne existe
        const existingCampaign = await campaignCollection.findOne({
            username: username.toString(),
            name: campaignName.toString(),
        });

        if (!existingCampaign) {
            return NextResponse.json(
                { message: `No campaign found for user=${username}, name=${campaignName}`, status: 404 },
                { status: 404 }
            );
        }

        // 4) Mettre à jour le champ currentScene
        const updateFields: { currentScene?: string } = {};
        if (typeof currentScene === "string") {
            updateFields.currentScene = currentScene;
        } else {
            // si pas de string => on peut le forcer à ""
            updateFields.currentScene = "";
        }

        await campaignCollection.updateOne(
            {
                username: username.toString(),
                name: campaignName.toString(),
            },
            { $set: updateFields }
        );

        // 5) Récupérer la version mise à jour
        const updated = await campaignCollection.findOne({
            username: username.toString(),
            name: campaignName.toString(),
        });

        if (!updated) {
            return NextResponse.json(
                { message: "Error after update: campaign missing", status: 500 },
                { status: 500 }
            );
        }

        // 6) Retourner la campagne mise à jour
        return NextResponse.json({
            message: "Campaign updated successfully",
            campaign: {
                name: updated.name,
                username: updated.username,
                currentScene: updated.currentScene || "",
            },
            status: 200,
        });
    } catch (err) {
        console.error("Error while updating campaign:", err);
        return NextResponse.json(
            { message: "Exception while updating campaign", status: 500 },
            { status: 500 }
        );
    }
}
