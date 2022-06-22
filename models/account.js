import mongoose from "mongoose";
const { Schema } = mongoose;

const schema = Schema({
    id:Number,
    name:String,
    email:String,
    password:String,
    deposit:Number,
    role:String
},
{
    collection : 'accounts'
})

export const account = mongoose.model("account",schema);