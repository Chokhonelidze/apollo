//const { ApolloServer, gql } = require("apollo-server");
//const { restaurant } = require("./models/restaurant");
//const { indexes } = require("./models/indexes");
//const {dishes} = require("./models/dishes");
//const mongoose = require("mongoose");
import {ApolloServer,gql} from "apollo-server";
import mongoose from "mongoose";
import * as Dishes from "./schemas/Dishes.js";
import * as Restaurants from "./schemas/Restaurants.js";
import * as DishesResolver from "./resolvers/Dishes.js";
import * as RestaurantsResolver from "./resolvers/Restaurants.js";
import {} from 'dotenv/config';

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";


const types = [];
const queries = [];
const mutations = [];
let resolverQueries = [];
let resolverMutations = [];

const schemas = [
Dishes,
Restaurants
];
const resolver = [
  DishesResolver,
  RestaurantsResolver
];


schemas.forEach((item)=>{
  types.push(item.types);
  queries.push(item.queries);
  mutations.push(item.mutations);
});

resolver.forEach((item)=>{
  resolverQueries = {...resolverQueries,...item.query};
  resolverMutations = {...resolverMutations,...item.mutation};
});
const typeDefs = gql`
  ${types.join('\n')}
  type Query {
    ${queries.join('\n')}
  }
  type Mutation {
    ${mutations.join('\n')}
  }
`;



const resolvers = {
  Query: 
    resolverQueries
  ,
  Mutation: resolverMutations
};
console.log(resolvers);

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
});

// The `listen` method launches a web server.
mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
