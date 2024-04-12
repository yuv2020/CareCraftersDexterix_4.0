const mongoose = require('mongoose');
const { Schema } = mongoose;
const BlogSchema = new Schema({
    //work as a foreign key in sql to associate the users with notes
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        require: true,
    
    },
    tag:{
        type: String,
       default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
  });

  module.exports = mongoose.model('blog', BlogSchema);