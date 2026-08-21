import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export async function connectDatabase(uri: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    }).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }

  return cachedPromise;
}


