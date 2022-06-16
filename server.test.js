import { ApolloServer, gql } from "apollo-server";
import mongoose from "mongoose";
import * as Dishes from "./schemas/Dishes.js";
import * as Restaurants from "./schemas/Restaurants.js";
import * as DishesResolver from "./resolvers/Dishes.js";
import * as RestaurantsResolver from "./resolvers/Restaurants.js";
import {} from "dotenv/config";
import { jest } from "@jest/globals";

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";

const types = [];
const queries = [];
const mutations = [];
let resolverQueries = [];
let resolverMutations = [];

const schemas = [Dishes, Restaurants];
const resolver = [DishesResolver, RestaurantsResolver];

schemas.forEach((item) => {
  types.push(item.types);
  queries.push(item.queries);
  mutations.push(item.mutations);
});

resolver.forEach((item) => {
  resolverQueries = { ...resolverQueries, ...item.query };
  resolverMutations = { ...resolverMutations, ...item.mutation };
});
const typeDefs = gql`
    ${types.join("\n")}
    type Query {
      ${queries.join("\n")}
    }
    type Mutation {
      ${mutations.join("\n")}
    }
  `;

const resolvers = {
  Query: resolverQueries,
  Mutation: resolverMutations,
};
const testServer = new ApolloServer({
  typeDefs,
  resolvers,
});
beforeAll(() => {
  mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
    testServer.listen().then(({ url }) => {
      console.log(`🚀 Test Server ready at ${url}`);
    });
  });
});
afterAll(() => {
  testServer.stop();
  mongoose.disconnect();
});
it("API crud test", async () => {
  const result = await testServer.executeOperation({
    query: `mutation CreateRestaurant($input: createRestaurant) {
        createRestaurant(input: $input) {
          id
          name
          description
          image
          dishes
        }
      }`,
    variables: {
      input: {
        name: "test2",
        description: "test restaurant",
        image: "",
        dishes: [],
      },
    },
  });

  expect(result.errors).toBeUndefined();
  expect(result.data?.name).toBe("test");
});
