const router = require('express').Router();
const Db = require('./users-model.js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const secrets = require('../config/secrets.js')


router.post("/register",(req,res) => {
  const creds = req.body
  const hash = bcrypt.hashSync(creds.password, 14)
  creds.password = hash
  Db.register(creds)
      .then(added => {
          res.status(201).json(added)
      })
      .catch(err => {
          res.status(500).json({message: 'You did not create a user'})
      })
})

router.post('/login', (req,res) => {
  const body = req.body

  Db.findUser(body)
      .then(user => {
          if(user && bcrypt.hashSync(body.password, user.password)){
              const token = generateToken(user)
              // req.session.user = user;
              res.status(200).json({ message: `${user.username} is logged in!`,
                  token
              })
          } else {
              res.status(401).json({errormessage: "You shall not pass!"})
          }
      })
      .catch(err => {
          res.status(500).json({ errormessage: "Could not get the user"})
      })
})

function generateToken(user){
  const payload ={
      subject: user.id,
      username: user.username,
  }
   const options ={
       expiresIn: '8h',

   }
  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = router;
