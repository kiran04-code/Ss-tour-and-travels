import "dotenv/config";
import { connectDatabase } from "../config/db.js";
import { Car } from "../models/Car.js";
const cars = [
  { name: "Hyundai Creta", brand: "Hyundai", model: "Creta", year: 2025, description: "Well maintained premium SUV with a complete service history.", images: ["https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80"], location: "Pune", fuelType: "Petrol", transmission: "Automatic", ownerName: "Car Owner", ownerPhone: "9876543210", ownerEmail: "owner@example.com", status: "available" },
  { name: "Tata Nexon", brand: "Tata", model: "Nexon", year: 2024, description: "Safe and efficient compact SUV, ready for a new owner.", images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"], location: "Mumbai", fuelType: "Petrol", transmission: "Manual", ownerName: "Car Owner", ownerPhone: "9876543210", ownerEmail: "owner@example.com", status: "available" }
];
await connectDatabase(process.env.MONGODB_URI || "mongodb://localhost:27017/car-platform");
await Car.deleteMany({}); await Car.insertMany(cars); console.log("Seeded cars"); process.exit(0);
