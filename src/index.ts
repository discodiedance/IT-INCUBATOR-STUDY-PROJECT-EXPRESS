import { runDb } from "./db/db";
import { app } from "./settings";

export const port = 3000;

const startApp = async () => {
  await runDb();
  app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`);
  });
};
startApp();
