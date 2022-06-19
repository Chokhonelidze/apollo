import {indexes} from "../models/indexes.js";
import { account } from "../models/account.js";
import { ApolloError } from 'apollo-server-errors';


export const query  ={

}
export const mutation = {
    createAccount: async(_,args) => {
        if(args.input){
        let index = await indexes.findOne({ id: "accounts" });
        
        if (!index) {
          index = new indexes({
            id: "accounts",
            value: 0,
          });
        }
        index.value = index.value + 1;
        let obj = {
            id : index.value,
            name: args.input.name,
            email: args.input.email,
            password: args.input.password,
            deposit: 0,
            role: args.input.role
          }
          let checkEmail = await account.findOne({email:obj.email});
          let checkName = await account.findOne({name:obj.name});
          if(checkEmail && checkEmail.email || checkName && checkName.name) {
            let errors = [];
            if(checkEmail)errors.push("email is already used");
            if(checkName)errors.push("name is already used");
            throw new ApolloError(errors, '400');
          }
          else {
              let out = await account.create(obj);
              index.save();
              return out;
          }

        }
       
    }
}