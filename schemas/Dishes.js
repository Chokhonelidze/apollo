export const types = `
   type Dish {
    id: ID
    name: String
    description: String
    image: String
    price: Float
  }
  type createID {
    id:ID
  }
  input inputDishes {
    id : String
    limit: Int = 10
    offset: Int = 0
    search: String
  }
  input createDish {
    id:ID
    name: String
    description: String
    image: String
    price: Float
  }
  input updateDish {
    id:ID
    name: String
    description: String
    image: String
    price: Float
  }
  input deleteDish {
    id: ID!
  }
`;

export const queries = `
    getDish(input: inputDishes) : [Dish]
`;

export const mutations = `
    updateDish(input: updateDish) : Dish
    createDish(input: createDish) : Dish
    deleteDish(input: deleteDish) : Dish
`;
