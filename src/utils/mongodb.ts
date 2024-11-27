import { MongoClient } from 'mongodb';

export const dbName = "TTRpgAssistDev";
const uriDb = process.env.MONGODB_URI as string;
const options = {}

if (!process.env.MONGODB_URI) {
    throw new Error('MongoDB URI must be provided');
}

const mongoClient = new MongoClient(uriDb, options);
const mongoClientPromise = mongoClient.connect();

export default mongoClientPromise;