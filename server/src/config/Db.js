import mongoose from 'mongoose'

export const ConnectDb = async()=>{
   try {
    mongoose.connect(process.env.MONGO_URL)
   .then(()=>{
    console.log(`DB CONNECTED`); 
   })
   } catch (error) {
    process.exit(1)
    console.log(`${error.message}`);
   }
}