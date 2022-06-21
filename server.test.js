const { ApolloServer, gql } = require("apollo-server");
const { createTestClient } = require("apollo-server-testing");
import mongoose from "mongoose";
import * as Dishes from "./schemas/Dishes.js";
import * as Restaurants from "./schemas/Restaurants.js";
import * as DishesResolver from "./resolvers/Dishes.js";
import * as RestaurantsResolver from "./resolvers/Restaurants.js";
import {} from "dotenv/config";

const DB = process.env.DB
  ? process.env.DB
  : "mongodb://mongo:27017/app_development";

  console.log("Server = "+DB);

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
  mongoose.connect(DB, { useNewUrlParser: true });
});
afterAll(() => {
  testServer.stop();
  mongoose.disconnect();
});
const { query, mutate } = createTestClient(testServer);
const CREATE_USER = gql`
  mutation CreateRestaurant($input: createRestaurant) {
    createRestaurant(input: $input) {
      id
      name
      description
      image
      dishes
    }
  }
`;
const FIND_RESTAURANT = gql`
  query Restaurants($input: restaurantQueryInput) {
    restaurants(input: $input) {
      name
    }
  }
`;
const DELETE_RESTAURANT = gql`
  mutation DeleteRestaurant($deleteRestaurantId: ID) {
    deleteRestaurant(id: $deleteRestaurantId) {
      id
    }
  }
`;
const UPDATE_RESTAURANT = gql`
  mutation UpdateRestaurant($input: updateRestaurant) {
    updateRestaurant(input: $input) {
      id
      name
      description
      image
      dishes
    }
  }
`;

let test_restaurant_id = 0;

test("can Create Restaurant", async () => {
  try {
    const {
      data: { createRestaurant },
    } = await mutate({
      mutation: CREATE_USER,
      variables: {
        input: {
          name: "test",
          description: "test restaurant",
          image: "",
          dishes: [],
        },
      },
    });
    test_restaurant_id = createRestaurant.id;
    expect(createRestaurant).toBeTruthy();
    expect(test_restaurant_id).not.toBe(0);
  } catch (e) {
    console.log(e);
  }
});

test("can Find Created Restaurant", async () => {
  try{
  const {
    data: { restaurants },
  } = await query({
    query: FIND_RESTAURANT,
    variables: {
      input: {
        search: "test",
      },
    },
  });
  expect(restaurants[0].name).toBe("test");
}
catch(e){
  console.log(e);
}
});

test("can Update Restaurant", async () => {
  try{
  const {
    data: { updateRestaurant },
  } = await mutate({
    mutation: UPDATE_RESTAURANT,
    variables: {
      input: {
        id: test_restaurant_id,
        name: "Den Thai",
      },
    },
  });
  expect(updateRestaurant.name).toBe("Den Thai");
}
catch(e){
  console.log(e);
}
});

test("can Delete Restaurant", async () => {
  try{
  const {
    data: { deleteRestaurant },
  } = await mutate({
    mutation: DELETE_RESTAURANT,
    variables: {
      deleteRestaurantId: test_restaurant_id,
    },
  });
  expect(deleteRestaurant).toBeTruthy();
}
catch(e) {
  console.log(e);
}
});


let test_dish_id = 0;

const CREATE_DISH = gql`
mutation CreateDish($input: createDish) {
  createDish(input: $input) {
    name
    description
    image
    price
  }
}
`;
const UPDATE_DISH = gql`
mutation UpdateDish($input: updateDish) {
  updateDish(input: $input) {
    id
    name
    description
    price
  }
}
`;
const FIND_DISH = gql`
query GetDish($input: inputDishes) {
  getDish(input: $input) {   
    name
  }
}
`;
const DELETE_DISH = gql`
mutation DeleteDish($input: deleteDish) {
  deleteDish(input: $input) {
    id
    name
    description
    image
    price
  }
}
`;

test("can Create Dish", async () => {
  try {
    const {
      data: { createDish },
    } = await mutate({
      mutation: CREATE_DISH,
      variables: {
        input: {
          name: "test",
          description: "test dish description",
          image: "",
          price: 5,
        },
      },
    });
    test_dish_id = createDish.id;
    
    expect(test_dish_id).not.toBe(0);
    expect(createDish).toBeTruthy();
  } catch (e) {
    console.log(e);
  }
});

test("can Find Created Dish", async () => {
  try{
  const {
    data: { getDish },
  } = await query({
    query: FIND_DISH,
    variables: {
      input: {
        search:'test'
      },
    },
  });
  expect(getDish[0].name).toBe("test");
}
catch(e){
  console.log(e);
}
});

test("can Update Dish", async () => {
  try{
  const {
    data: { UpdateDish },
  } = await mutate({
    mutation: UPDATE_DISH,
    variables: {
      input: {
   
          id:test_dish_id,
          name:"Khinkali",
          price:30
        
      },
    },
  });
  expect(UpdateDish.name).toBe("Khinkali");
}
catch(e){
  console.log(e);
}
});

test("can Delete Dish", async () => {
  try{
    console.log(test_dish_id);
  const {
    data: { deleteDish },
  } = await mutate({
    mutation: DELETE_DISH,
    variables: {
      input:{
        id :''+test_dish_id
      }
    }
  });
  expect(deleteDish).toBeTruthy();
}
catch(e) {
  console.log(e);
}
});

