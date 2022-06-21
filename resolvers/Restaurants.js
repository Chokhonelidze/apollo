import {restaurant} from "../models/restaurant.js";
import {indexes} from "../models/indexes.js";
export const query = {
    restaurants: async (_, args) => {
        let data = null;
        if (args.input) {
          const { limit, offset, search, id } = args.input;
          data = await restaurant.find().limit(limit).skip(offset);
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
          data = await restaurant.find();
        }
        return data;
      }
}

export const mutation = {
    createRestaurant: async (_, args,context,info) => {
        if (!context.user.role ==='admin') return null;
        let index = await indexes.findOne({ id: "restaurants" });
        if (!index) {
          index = new indexes({
            id: "restaurants",
            value: 0,
          });
        }
        index.value = index.value + 1;
        index.save();
        let obj = {
          name: args.input.name,
          image: args.input.image,
          description: args.input.description,
          id : index.value
        };
       
        let out = await restaurant.create(obj);
        return out;
      },
      updateRestaurant: async (_,args,context) => {
        if (!context.user.role ==='admin') return null;
        let obj = await restaurant.findOne({id:args.input.id});
        args.input.name?obj.name = args.input.name:'';
        args.input.description?obj.description = args.input.description:'';
        args.input.image?obj.image = args.input.image:'';
        args.input.dishes?obj.dishes = args.input.dishes:'';
        obj.save();
        return obj;
      },
      deleteRestaurant: async (_,args,context) => {
        if (!context.user.role ==='admin') return null;
        let id = await restaurant.findOneAndDelete(args.id);
        return id;
      }
}