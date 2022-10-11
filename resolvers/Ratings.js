import { ratings } from "../models/ratings.js";
import {indexes} from "../models/indexes.js";

export const query = {
    getRating: async(_,args,context) =>{
      
        let data = null;
        if(args.input) {
            const {type} = args.input;
            const ip = context.ip;
            const voted = await ratings.findOne({type:type,ip:ip});
            console.log(voted);
            if(voted?.id){
                data = await ratings.find({type:voted.type});
                let sum = 0;
                data.forEach((item)=>{
                   
                    sum += parseInt(item.rating);
                });    
                voted.rating = Math.round(sum / data.length);
                data = voted;
            }

        }
        return data;

    },
}

export const mutation = {
    createRating: async (_, args,context) => {
        let index = await indexes.findOne({ id: "ratings" });
        if (!index) {
          index = new indexes({
            id: "ratings",
            value: 0,
          });
        }
        index.value = index.value + 1 ;
        index.save();
        let obj = {
            id:index.value,
            ip:context.ip,
            type:args.input.type,
            rating:args.input.rating,
        }
        let out = await ratings.create(obj);
        return out;
    }
    
}