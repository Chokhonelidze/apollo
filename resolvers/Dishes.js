import {dishes} from "../models/dishes.js"
import {indexes} from "../models/indexes.js";
export const query = {
    getDish: async (_,args) => {
        let data = null;
        if (args.input) {
         
          const { limit, offset, search, id } = args.input;
          data = await dishes.find().limit(limit).skip(offset);
          if (id) {
            data = data.filter((item)=>{
              if(Number(item.id) === Number(id)) return item;
            });
          }
          if (search) {
            const regex = new RegExp(search, "i");
            data = data.filter((item)=>{
              if(item.name.match(regex)) return item;
            });
          }
        }
        else {
          data = await dishes.find();
        }
        return data;
        
    }
}
export const mutation = {
    createDish: async(_,args,context) => {
      if (!context.user.role ==='admin') return null;
        let index = await indexes.findOne({ id: "dishes" });
        
        if (!index) {
          index = new indexes({
            id: "dishes",
            value: 0,
          });
        }
        index.value = index.value + 1;
        index.save();
        let obj = {
          id : index.value,
          name: args.input.name,
          description: args.input.description,
          image: args.input.image,
          price: Number(args.input.price)
        }
        let out = await dishes.create(obj);
        return out;
      },
      updateDish: async (_,args,context)=>{
        if (!context.user.role ==='admin') return null;
        let obj = await dishes.findOne({id:args.input.id});
        args.input.name?obj.name = args.input.name:'';
        args.input.description?obj.description = args.input.description:'';
        args.input.image?obj.image = args.input.image:'';
        args.input.price?obj.price = Number(args.input.price):'';
        obj.save();
        return obj;
      },
      deleteDish: async (_,args,context) =>{
        if (!context.user.role ==='admin') return null;
        let id = await dishes.findOneAndDelete(args.input.id);
        return id;
      }
}