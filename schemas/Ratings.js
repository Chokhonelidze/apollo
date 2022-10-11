export const types = `
type Rating {
    id:ID
    ip:String
    type:String
    rating:Int
}
input createInputRating{
    type:String
    rating:Int
}
input inputRating {
    type:String
}

`;

export const queries = `
    getRating(input: inputRating):Rating
`;

export const mutations = `
    createRating(input: createInputRating): Rating
   
`;
