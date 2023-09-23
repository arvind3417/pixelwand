import app from "./app";
import { PORT } from "./config/constants";
import { connectDB } from "./config/db";

const port = process.env.PORT || PORT;

try {
  // connect to database
  if (!process.env.CONNECTIONSTR)
    throw new Error("No connection string found in .env file");
  connectDB(process.env.CONNECTIONSTR);
  // Server setup
  app.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}/`);
    
  });
} catch (error) {
  console.error(error);
}


