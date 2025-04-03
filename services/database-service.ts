import { clientPromise } from "@/lib/mongodb";
import { Collection, Document } from "mongodb";

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const client = await clientPromise;
  return client.db("virgin_fund").collection<T>(name); // Replace "virgin_fund" with your database name if different
}

export async function findOne<T>(collection: string, query: object): Promise<T | null> {
  const coll = await getCollection<T>(collection);
  return coll.findOne(query);
}

export async function find<T>(collection: string, query: object = {}): Promise<T[]> {
  const coll = await getCollection<T>(collection);
  return coll.find(query).toArray();
}