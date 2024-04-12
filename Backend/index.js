const connectToMongo = require ('./db');
const express = require('express');
const { urlencoded } = require('express');
const cors = require('cors');

connectToMongo();  
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.static("/public/tour website"));
const port = 5000

// Middle-Ware for undefined
app.use(express.json())
app.use(urlencoded({extended: true}));

// Available Routes 
app.use('/app/auth', require('./routes/auth'));
app.use('/app/notes', require('./routes/newblog'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
