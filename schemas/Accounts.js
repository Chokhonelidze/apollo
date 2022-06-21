export const types = `
   type Account {
    id: ID
    name: String
    email: String
    password: String
    deposit: Float
    role: String
  }
  type createID {
    id:ID
  }
  
  input createAccount {
    name: String
    email: String
    password: String
    deposit: Float
    role: String
  }
  input updateAccount {
    id:ID
    name: String
    email: String
    password: String
    deposit: Float
    role: String
  }
  input deleteAccount {
    id: ID!
  }
  input accountInput{
    user:String!
  }
  input payment {
    id:ID!
    value: Float!
  }
`;



export const queries = `
    getAccount(input:accountInput) : Account
`;
export const mutations = `
    createAccount(input: createAccount) : Account
    pay(input: payment): Account
`;
