import { runDb } from "./db/db";
import { app } from "./settings";

const port = process.env.PORT || 3000;

const startApp = async () => {
  await runDb();
  app.set("trust proxy", true);
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
