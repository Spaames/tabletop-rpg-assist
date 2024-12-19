import { NextResponse } from "next/server";

// Variable pour stocker l'image actuelle (en mémoire temporaire)
let currentBackground = "";

// Endpoint GET : Récupérer l'image actuelle
export async function GET() {
    return NextResponse.json({ background: currentBackground });
}

// Endpoint PUT : Mettre à jour l'image actuelle
export async function PUT(request: Request) {
    const { background } = await request.json();
    currentBackground = background; // Met à jour l'image actuelle
    return NextResponse.json({ success: true });
}

// Si une méthode non autorisée est appelée
export function POST() {
    return new Response("Method not allowed", { status: 405 });
}
