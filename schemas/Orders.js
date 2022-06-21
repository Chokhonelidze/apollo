export const types = `
type Order {
    id:ID
    total: Int
    compleated: String
    dishes: [ID]
}
input inputOrders {
    id : String
    limit: Int = 10
    offset: Int = 0
}
input createOrder {
    id:ID
    total: Int
    compleated: String
    dishes: [ID]
}
input updateOrder {
    id:ID
    total: Int
    compleated: String
    dishes: [ID]
}
input deleteOrder {
    id:ID!
}
`;
export const queries = `
    getOrders(input: inputOrders) : [Order]
`;

export const mutations = `
    updateOrder(input: updateOrder) : Order
    createOrder(input: createOrder) : Order
    deleteOrder(input: deleteOrder) : Order
`;
