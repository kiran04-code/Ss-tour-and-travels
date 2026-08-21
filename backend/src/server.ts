import "dotenv/config";
import { connectDatabase } from "./config/db.js";
import { createApp } from "./app.js";

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/car-platform";

connectDatabase(mongoUri).then(() => {
  createApp(process.env.FRONTEND_URL || "http://localhost:5173").listen(port, () => console.log(`API listening on http://localhost:${port}`));
}).catch((error: unknown) => {
  console.error("Unable to start API", error);
  process.exit(1);
});
