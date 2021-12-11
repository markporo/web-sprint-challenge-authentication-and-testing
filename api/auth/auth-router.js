//invoke the router method from the express library
const router = require('express').Router();

//
const { JWT_SECRET } = require("../secrets"); // use this secret!


//require bcrypt library
const bcrypt = require('bcryptjs')

//require jwt
const jwt = require('jsonwebtoken');


//middleware from auth-middleware.js
const { checkPasswordLength, passwordAndUsernameInReqBody, checkUsernameFree, checkUsernameExists } = require('../auth/auth-middleware')

// access the  hard coded jokes - don't need for this
//const dadJokes = require('../jokes/jokes-data')

// access the usersModel
const usersModel = require('../users/users-model')

//REGISTER A USER -- HASH THEIR PW -- ADD TO DB
router.post('/register', checkPasswordLength, passwordAndUsernameInReqBody, checkUsernameFree, (req, res) => {
  //res.end('implement register, please!');

  // hash password!
  const hash = bcrypt.hashSync(req.body.password, 8)
  //assign hash of password to the user's password
  req.body.password = hash;

  usersModel.add({ username: req.body.username, password: hash })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(() => {
      res.status(500).json({ message: "The User could not be added to the DB." })
    })
});


/*
  IMPLEMENT
  You are welcome to build additional middlewares to help with the endpoint's functionality.
  DO NOT EXCEED 2^8 ROUNDS OF HASHING!

  1- In order to register a new account the client must provide `username` and `password`:
    {
      "username": "Captain Marvel", // must not exist already in the `users` table
      "password": "foobar"          // needs to be hashed before it's saved
    }

  2- On SUCCESSFUL registration,
    the response body should have `id`, `username` and `password`:
    {
      "id": 1,
      "username": "Captain Marvel",
      "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
    }

  3- On FAILED registration due to `username` or `password` missing from the request body,
    the response body should include a string exactly as follows: "username and password required".

  4- On FAILED registration due to the `username` being taken,
    the response body should include a string exactly as follows: "username taken".
*/


router.post('/login', passwordAndUsernameInReqBody, checkUsernameExists, (req, res) => {
  //res.end('implement login, please!');

  if (bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = generateToken(req.user);
    res.status(200).json({
      "message": `welcome, ${req.user.username}`,
      token,
    })
  } else {
    res.status(401).json({ "message": 'Invalid Credentials' });
  }


  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

function generateToken(user) {
  const payload = {
    subject: user.id, // sub property in header of the token; normally user id
    username: user.username,
    //...other data put here --never any sensitive information because
    //this token can be easily translated
  }
  //const secret = JWT_SECRET  //'this sectret is how we sign the token only the server knows it';
  const options = {
    expiresIn: '1d', //1d
    // we can use many other options if we want
  }

  return jwt.sign(payload, JWT_SECRET, options)
}

module.exports = router;
