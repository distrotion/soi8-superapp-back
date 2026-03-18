import { MongoClient } from 'mongodb';

let client: MongoClient | null = null;

async function getClient(): Promise<MongoClient> {
  if (!client) {
    const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
    client = new MongoClient(url);
    await client.connect();
  }
  return client;
}

export async function mongodbinsertMany(db_input: string, collection_input: string, input: any[]): Promise<any> {
  const c = await getClient();
  const collection = c.db(db_input).collection(collection_input);
  return collection.insertMany(input);
}

export async function mongodbfind(db_input: string, collection_input: string, input: any): Promise<any> {
  const c = await getClient();
  const collection = c.db(db_input).collection(collection_input);
  return collection.find(input).limit(0).sort({ "_id": -1 }).toArray();
}

export async function mongodbfindsome(db_input: string, collection_input: string, input: any): Promise<any> {
  const c = await getClient();
  const collection = c.db(db_input).collection(collection_input);
  return collection.find(input).limit(500).sort({ "_id": -1 }).project({ "PO": 1, "CP": 1, "ALL_DONE": 1 }).toArray();
}

export async function mongodbupdate(db_input: string, collection_input: string, input1: any, input2: any): Promise<any> {
  const c = await getClient();
  const collection = c.db(db_input).collection(collection_input);
  await collection.updateOne(input1, input2);
  return "res";
}
