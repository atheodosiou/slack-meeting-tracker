import "dotenv/config";
import "./routes/commands";
import { boltApp } from "./bolt";

(async () => {
  await boltApp.start();
  console.log(`⚡️ Meeting Tracker running on ${process.env.PORT || 3000}`);
})();
