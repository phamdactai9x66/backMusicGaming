
const mongoose =require("mongoose");

let connect=async () =>{
   try{
    await mongoose.connect('mongodb://localhost:27017/cofffe_house', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true});
              console.log("successfully")
   }catch(error){
    console.log("failed")
   }
}
module.exports={connect}