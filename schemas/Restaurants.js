export const types = `
type Restaurant {
    id: ID
    name: String
    description: String
    image: String
    dishes: [String]
  }

  input restaurantQueryInput {
    id : String
    limit: Int = 10
    offset: Int = 0
    search: String
  }
  input createRestaurant {
    name: String
    description: String
    image: String
    dishes: [String]
  }

  input updateRestaurant {
    id:ID
    name: String
    description: String
    image: String
    dishes: [String]
  }

  type deleteRestaurant {
    id: ID!
  }

`;

export const queries = `
    restaurants(input: restaurantQueryInput): [Restaurant]
`;

export const mutations = `
    createRestaurant(input: createRestaurant): Restaurant
    updateRestaurant(input: updateRestaurant): Restaurant
    deleteRestaurant(id: ID): deleteRestaurant!
`;
