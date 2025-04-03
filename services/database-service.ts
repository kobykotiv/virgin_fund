import { connectToDatabase } from "@/lib/mongodb";
import { Collection, Document } from "mongodb";

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(name);
}

export async function findOne<T>(collection: string, query: object): Promise<T | null> {
  const coll = await getCollection<T>(collection);
  return coll.findOne(query);
}

export async function find<T>(collection: string, query: object = {}): Promise<T[]> {
  const coll = await getCollection<T>(collection);
  return coll.find(query).toArray();
}