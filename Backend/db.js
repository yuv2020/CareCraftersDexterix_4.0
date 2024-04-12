const mongoose = require('mongoose');
const mongoURI ="mongodb+srv://carecrafter:carecrafter@carecrafter.4jmowdu.mongodb.net/saurav_crud"
const connectToMongo = ()=>{
     mongoose.connect(
    mongoURI,
    (err) => {
     if(err) {console.log(err) }
     else console.log("mongdb is connected");
    }
  );
}
module.exports = connectToMongo;