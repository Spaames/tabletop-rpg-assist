import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * GET /api/listFiles
 * URL_params : searchParams -> username, campaignName, folder
 *
 * Get all files path for a specific username, campaign and folder type
 *
 */

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    const campaignName = searchParams.get('campagneName');
    const folder = searchParams.get('folder');

    if (!username || !campaignName || !folder) {
        return NextResponse.json(
            { error: 'Username, campagneName, and folder are required.' },
            { status: 400 }
        );
    }

    const dirPath = path.join(process.cwd(), 'public', username, campaignName, folder);

    if (!fs.existsSync(dirPath)) {
        return NextResponse.json({ error: 'Folder not found.' }, { status: 404 });
    }

    const files = fs.readdirSync(dirPath).filter(file => /\.(png|jpg|jpeg)$/i.test(file));

    return NextResponse.json({ files });
}
