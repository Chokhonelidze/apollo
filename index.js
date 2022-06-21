//const { ApolloServer, gql } = require("apollo-server");
//const { restaurant } = require("./models/restaurant");
//const { indexes } = require("./models/indexes");
//const {dishes} = require("./models/dishes");
//const mongoose = require("mongoose");
import {ApolloServer,gql} from "apollo-server";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault
} from "apollo-server-core";
import mongoose from "mongoose";
import * as Dishes from "./schemas/Dishes.js";
import * as Restaurants from "./schemas/Restaurants.js";
import * as Accounts from "./schemas/Accounts.js";
import * as Orders from "./schemas/Orders.js";
import * as DishesResolver from "./resolvers/Dishes.js";
import * as RestaurantsResolver from "./resolvers/Restaurants.js";
import * as AccountsResolver from "./resolvers/Accounts.js";
import * as OrderResolver from "./resolvers/Orders.js";
import {} from 'dotenv/config';
import  jwt from "jsonwebtoken";

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";

  const PORT = process.env.PORT || 4002;


const types = [];
const queries = [];
const mutations = [];
let resolverQueries = [];
let resolverMutations = [];

const schemas = [
Dishes,
Restaurants,
Accounts,
Orders
];
const resolver = [
  DishesResolver,
  RestaurantsResolver,
  AccountsResolver,
  OrderResolver
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
  cache: "bounded",
  context:  async ({ req }) => {
    const authHeader = req.headers.authorization || '';
    const accessTokenSecret = 'somerandomaccesstoken';
    if(authHeader) {
      const sp = authHeader.split(' ');
      const loginUser= sp[0];
      const token = sp[1]; 
     return await jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            return null;
        }
        return {user};
    });
    }

  },
  plugins: [
    // Install a landing page plugin based on NODE_ENV
    process.env.NODE_ENV === "production"
      ? ApolloServerPluginLandingPageProductionDefault({
          graphRef: "My-Graph-zz9m3@current",
          footer: false,
        })
      : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
  ],
});

// The `listen` method launches a web server.
mongoose.connect(DB, { useNewUrlParser: true }).then(() => {
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
