import { port, runDb } from "./db/db";
import { app } from "./settings";

app.listen(port, async () => {
  await runDb();
});
