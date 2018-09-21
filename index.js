const express = require("express");
const server = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db/dbConfig.js")
server.use(express.json());
server.use(cors());

const secret = "2co517";

const tokenGeneration = user => {
  const payload = { username: user.username };
  const options = {
    expiresIn: "2h",
    jwtid: "9876"
  };
  return jwt.sign(payload, secret, options);
};

const auth = (req, res, next) => {
  //auth using jwts instead of sessions
  const token = req.headers.authorization
  if(token){
      //verify then token
      jwt.verify(token, secret, (err, decodedToken) => {
          if(err) {
              //token is invalid
              res.status(401).json({message: "Invalid token"});
          }else{
              //token is valid
              console.log(decodedToken)
              req.username = decodedToken.username;
              next();
          }
      })

  }else{
      res.status(401).json({message: "No token provided"});
  }
};

server.post("/api/register", (req, res) => {
  const creds = req.body;
  const hash = bcrypt.hashSync(creds.password, 12);
  creds.password = hash;

  db("users")
    .insert(creds)
    .then(ids => {
      const id = ids[0];
      //get the user using id
      db("users")
        .where({ id })
        .first()
        .then(user => {
          const token = tokenGeneration(user);
          res.status(201).json({ id: user.id, token });
        })
        .catch(err => res.status(500).json(err));
    })
    .catch(err => res.status(500).send(err));
});

server.post("/api/login", (req, res) => {
  const creds = req.body;
  db("users")
    .where({ username: creds.username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(creds.password, user.password)) {
        //generate token
        const token = tokenGeneration(user);
        //attach that token to the response
        res.status(200).json(token);
      } else {
        res
          .status(401)
          .json({ message: "You shall not pass! Go Back to the Shadows!" });
      }
    })
    .catch(err => res.status(500).send(err));
});

//router post


//done on the client level
// server.get("/api/logout", (req, res) => {
//   if (req.data) {
//     req.data.destroy(err => {
//       if (!err) {
//         res.send("goodbye");
//       } else {
//         res.send("error logging out");
//       }
//     })
//     .catch(err => res.status(500).send(err));
//   }
// });

server.get("/api/users", auth, (req, res) => {
  db("users")
    .select("id", "username", "password", "department")
    .then(users => {
      res.json(users);
    })
    .catch(err => res.json({ message: "Please login to access information" }));
});

server.listen(8000, () => console.log("======API running on Port 8000======"));
