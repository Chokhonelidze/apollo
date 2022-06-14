//const { ApolloServer, gql } = require("apollo-server");
//const { restaurant } = require("./models/restaurant");
//const { indexes } = require("./models/indexes");
//const {dishes} = require("./models/dishes");
//const mongoose = require("mongoose");
import {ApolloServer,gql} from "apollo-server";
import mongoose from "mongoose";
import {restaurant} from "./models/restaurant.js";
import {indexes} from "./models/indexes.js";
import * as Dishes from "./schemas/Dishes.js";
import * as Restaurants from "./schemas/Restaurants.js"
import {} from 'dotenv/config';

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";


const types = [];
const queries = [];
const mutations = [];

const schemas = [
Dishes,
Restaurants
];

schemas.forEach((item)=>{
types.push(item.types);
queries.push(item.queries);
mutations.push(item.mutations);
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
  Query: {
    restaurants: async (_, args) => {
      let data = null;
      if (args.input) {
       
        const { limit, offset, search, id } = args.input;
        data = await restaurant.find().limit(limit).skip(offset);
        if (id) {
          const regex = new RegExp(search, "i");
          data = data.filter((item)=>{
            if(Number(item.id) === Number(id)) return item;
          });
        }
        if (search) {
          const regex = new RegExp(search, "i");
          data = data.filter((item)=>{
            if(item.name.match(regex)) return item;
          });
        }
      }
      else {
        data = await restaurant.find();
      }
      return data;
    },
    getDish: async (_,args) => {
      let data = null;
      let id = 0;
      if(args.query){
        id = args.query.id;
      }
      if(args.input){
        id = args.input;
      }
      data = await dishes.findOne({id:id});
      return id;
    }

  },
  Mutation: {
    createRestaurant: async (_, args) => {
      console.log(args);
      let index = await indexes.findOne({ id: "restaurants" });
      if (!index) {
        index = new indexes({
          id: "restaurants",
          value: 0,
        });
      }
      index.value = index.value + 1;
      index.save();
      let obj = {
        name: args.input.name,
        image: args.input.image,
        description: args.input.description,
        id : index.value
      };
     
      let out = await restaurant.create(obj);
      return out;
    },
    updateRestaurant: async (_,args) => {
      let obj = await restaurant.findOne({id:args.input.id});
      args.input.name?obj.name = args.input.name:'';
      args.input.description?obj.description = args.input.description:'';
      args.input.image?obj.image = args.input.image:'';
      args.input.dishes?obj.dishes = args.input.dishes:'';
      obj.save();
      return obj;
    },
    deleteRestaurant: async (_,args) => {
      let id = await restaurant.findOneAndDelete(args.id);
      return id;
    },
    createDish: async(_,args) => {
      let index = await indexes.findOne({ id: "dishes" });
      
      if (!index) {
        index = new indexes({
          id: "dishes",
          value: 0,
        });
      }
      index.value = index.value + 1;
      index.save();
      let obj = {
        id : index.value,
        name: args.input.name,
        description: args.input.description,
        image: args.input.image,
        price: Number(args.input.price)
      }
      console.log(obj); 
      let out = await dishes.create(obj);
      return out;
    },
    updateDish: async (_,args)=>{
      let obj = await dishes.findOne({id:args.input.id});
      args.input.name?obj.name = args.input.name:'';
      args.input.description?obj.description = args.input.description:'';
      args.input.image?obj.image = args.input.image:'';
      args.input.price?obj.price = Number(args.input.price):'';
      obj.save();
      return obj;
    },
    deleteDish: async (_,args) =>{
      let id = await dishes.findOneAndDelete(args.input.id);
      return id;
    }
  }

};

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
