
const mongoose = require("mongoose");

let connect = async () => {
   try {
      await mongoose.connect('mongodb+srv://dbmsg:tlFiRhiuh22nFPBh@cluster0.roete.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         useFindAndModify: false,
         useCreateIndex: true
      });
      console.log("successfully")
   } catch (error) {
      console.log("failed")
   }
}
module.exports = { connect }