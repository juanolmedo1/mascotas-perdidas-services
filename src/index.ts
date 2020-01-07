import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createSchema } from "@src/createSchema";

const startServer = async () => {
  const app = express();
  await createConnection();
  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res })
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Express server started at port 4000...");
  });
};

startServer().catch(error => {
  console.log(error);
});
