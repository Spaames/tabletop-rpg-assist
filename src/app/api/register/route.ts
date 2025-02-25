import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoClientPromise from "@/utils/mongodb";
import {dbName} from "@/utils/mongodb";

/**
 * POST /api/register
 * Body JSON : { username, password }
 *
 * Insert user in bdd
 */

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        if (!username || !password ) {
            return NextResponse.json({ message: "Username AND password are required" }, { status: 400 });
        }

        const mongoClient = await mongoClientPromise;
        const db = mongoClient.db(dbName);
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ message: "User already exist" });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const result = await usersCollection.insertOne({ username, password: hashedPass });

        return NextResponse.json({ message: "User registered", userId: result.insertedId }, {status: 201});
    }
    catch (error) {
        console.error("Error during registration", error);
        return NextResponse.json({ message: "Internal server error" }, {status: 500});
    }
}