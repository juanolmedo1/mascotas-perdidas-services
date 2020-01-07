import { buildSchema } from "type-graphql";
import resolvers from "@resolvers/index";
import { Container } from "typedi";

export const createSchema = async () =>
  await buildSchema({
    resolvers,
    container: Container
  });
