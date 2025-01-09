import { NextResponse } from "next/server";

// Variable pour stocker l'image actuelle (en mémoire temporaire)
let currentScene = {background: "", music: "", cards: []};

// Endpoint GET : Récupérer l'image actuelle
export async function GET() {
    return NextResponse.json({ scene: currentScene });
}

export async function PUT(request: Request) {
    try {
        const { scene } = await request.json();
        if (!scene) throw new Error("Données de scène invalides");

        currentScene = scene; // Met à jour la scène avec les nouvelles positions
        console.log('Scène mise à jour :', currentScene);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erreur API PUT :', error);
        return NextResponse.json({ success: false });
    }
}

// Si une méthode non autorisée est appelée
export function POST() {
    return new Response("Method not allowed", { status: 405 });
}
