import * as dotenv from "dotenv";
import createApp from "./app";
import dbConnect from "./config/mongo";

async function main() {
  dotenv.config();

  await dbConnect();

  const { app, server } = createApp();

  server.timeout = 10 * 60 * 1000;

  const port: number | string = process.env.PORT || 8100;

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

main();
