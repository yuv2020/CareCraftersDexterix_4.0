const UserSchema = require('../models/User')
const express = require('express');
const router = express.Router();
// const app = express();
router.use(express.static("/public"));
router.use(express.static("/public/tour website"));

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

// Creating the Secret for JWT
const JWT_SECRET = 'sauravpianist';



router.post('/createuser',[
  body('name', 'Enter Valid Name').isLength({ min: 3 }),
  body('email', 'Enter valid email adress').isEmail(),
  body('password', 'Password must be atleast min 5 characters').isLength({ min: 5 })
], async (req, res) => {
  // If there are errors, return bad request and the error
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check wheather the user email is already exist or not
  try {
    // let user = await User.findOne({ email: req.body.email });
    let user = await UserSchema.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "User with this email already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    // console.log(salt);
    const secPass = await bcrypt.hash(req.body.password, salt);

    //create a new user
    user = await UserSchema.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })
    const data = {
      user: {
        id: user.id
      }
    }

    //Authentication by using Json Web Token

    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken);
    res.cookie('jwt', authtoken, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Cookie expires in 24 hours
      httpOnly: true // Cookie accessible only through HTTP(S) requests
    });
      res.redirect("http://localhost:7000/");
    

  } catch (error) {
    console.error(error);
    res.status(500).send("some error occured");
  }

});


// Authenticate the user using: Post "/api/auth/login" . No-login required

router.post('/login', [
  body('email', 'Enter valid email address').isEmail(),
  body('password', 'Password can not be blank').exists()
], async (req, res) => {
  // If there are errors, return bad request and the error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await UserSchema.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ error: "Please Enter a valid email" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "Please Enter a valid Credentials" });
    }

    const data = {
      user: {
        id: user.id,
        name:user.name,
        email:user.email
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken);
    // res.json(user);
    // if(authtoken){
    //   res.redirect("http://localhost:3000/");
    // }
    // res.json({ authtoken });
    return res.json({ authtoken, user: data.user });


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error 1");
  }


});

// Get the user using: Post "/api/auth/getuser" . Login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
   const userId = req.user.id;
    const user = await UserSchema.findById(userId).select("-password");
    res.send(user);
    // res.json({ authtoken, user: data.user });
    // res.send("success")
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error 2");
  }

});



module.exports = router;