import "dotenv/config";
import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "@src/createSchema";
import bodyParser from "body-parser";
import cron from "node-cron";

const startServer = async () => {
  const app = express();
  await createConnection();
  const schema = await createSchema();

  app.use(bodyParser.json({ limit: "50mb" }));

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  cron.schedule("0 7 1,15 * *", async () => {
    await apolloServer.executeOperation({
      query: "mutation { updateCommonValuesTable }",
    });
  });

  cron.schedule("0 */4 * * *", async () => {
    await apolloServer.executeOperation({
      query: "mutation { delete24HoursTemporalPublications }",
    });
  });

  app.listen(4000, () => {
    console.log("Express server started at port 4000...");
  });
};

startServer().catch((error) => {
  console.log(error);
});
