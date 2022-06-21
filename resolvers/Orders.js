import {indexes} from "../models/indexes.js";
import { orders } from "../models/orders.js";

export const query = {
    getOrders: async (_,args) => {
        let data =null;
        if(args.input) {
            const { limit, offset, id } = args.input;
            data = await orders.find().limit(limit).skip(offset);
            if (id) {
                data = data.filter((item)=>{
                  if(Number(item.id) === Number(id)) return item;
                });
              }
            
        }
        else{
            data = await orders.find();
        }
        return data;
    }
}
export const mutation = {
    createOrder: async(_,args) => {
        let index = await indexes.findOne({ id: "orders" });
        
        if (!index) {
          index = new indexes({
            id: "orders",
            value: 0,
          });
        }
        index.value = index.value + 1;
        index.save();
        let obj = {
            id:index.value,
            total: Number(args.input.total),
            compleated : 0,
            dishes : args.input.dishes
        }
        let out = await orders.create(obj);
        return out;
    },
    updateOrder: async (_,args) =>{
        let obj = await orders.findOne({id:args.input.id});
        args.input.total ? obj.total = args.input.total:'';
        args.input.compleated? obj.compleated = args.input.compleated:'';
        args.input.dishes? obj.dishes = args.input.dishes: '';
        obj.save();
        return obj;
    },
    deleteOrder: async (_,args) => {
        let id = await orders.findOneAndDelete(args.input.id);
        return id;
    }
}