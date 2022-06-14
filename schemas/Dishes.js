export const types = `
   type Dish {
    id: ID
    name: String
    description: String
    image: String
    price: Int
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
`;

export const queries = `
    getDish(input: inputDishes) : [Dish]
`;

export const mutations = `
    updateDish(input: updateDish) : Dish
    createDish(input: createDish) : Dish
    deleteDish(input: deleteDish) : Dish
`;
