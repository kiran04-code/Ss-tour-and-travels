import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import { Car } from "../models/Car.js";

await connectDatabase(process.env.MONGODB_URI || "mongodb://localhost:27017/car-platform");
const result = await Car.collection.updateMany({}, { $unset: { price: "", mileage: "" } });
console.log(`Removed legacy fields from ${result.modifiedCount} car records.`);
process.exit(0);
