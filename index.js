const { ApolloServer, gql } = require("apollo-server");
const { restaurant } = require("./models/restaurant");
const { indexes } = require("./models/indexes");
const {dishes} = require("./models/dishes");
const mongoose = require("mongoose");
require("dotenv").config();
const DB = process.env.DB
  ? process.env.DB
  : "mongodb://admin:cst10b002944@localhost:27017/mydb?retryWrites=true&w=majority";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  type Restaurant {
    id: ID
    name: String
    description: String
    image: String
    dishes: [ID]
  }

  input createRestaurant {
    name: String
    description: String
    image: String
    dishes: [ID]
  }
  type deleteRestaurant {
    id: ID!
  }
  input updateRestaurant {
    id:ID
    name: String
    description: String
    image: String
    dishes: [ID]
  }
  input restaurantQueryInput {
    id : String
    limit: Int = 10
    offset: Int = 0
    search: String
  }

  type Dish {
    id: ID
    name: String
    description: String
    image: String
    price: Int
  }
  input createDish {
    name: String
    description: String
    image: String
    price: Int
  }
  input updateDish {
    id:ID
    name: String
    description: String
    image: String
    price: Int
  }
  input deleteDish {
    id: ID!
  }
  type Query {
    restaurants(input: restaurantQueryInput): [Restaurant]
    getDish(input: ID) : Dish
  }

  type Mutation {
    createRestaurant(input: createRestaurant): Restaurant
    updateRestaurant(input: updateRestaurant): Restaurant
    deleteRestaurant(id: ID): deleteRestaurant!
    updateDish(input: updateDish) : Dish
    createDish(input: createDish) : Dish
    deleteDish(input: deleteDish) : Dish
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
      return data;
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
      let obj = {
        id : index.value,
        name: args.input.name,
        description: args.input.description,
        image: args.input.image,
        price: args.input.price
      }
      let out = await dishes.create(obj);
      return out;
    },
    updateDish: async (_,args)=>{
      let obj = await dishes.findOne({id:args.input.id});
      args.input.name?obj.name = args.input.name:'';
      args.input.description?obj.description = args.input.description:'';
      args.input.image?obj.image = args.input.image:'';
      args.input.price?obj.price = args.input.price:'';
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
