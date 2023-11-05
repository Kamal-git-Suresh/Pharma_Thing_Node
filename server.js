const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const session = require("express-session");
const passport = require("passport");
var flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;

//const promise = require('promise')

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "aaa",
  database: "pharma",
});

connection.connect((error) => {
  if (error) {
    console.log("A error has been occurred " + "while connecting to database.");
    throw error;
  }
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  "pharmasist",
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authPharma(username, password).then((result) => {
      actualUsername = result[0].username;
      actualPassword = result[0].password;
      if (result == 0) {
        console.log("Failed");
        console.log("username: " + username);
        console.log('password" ' + password);
        return done(null, false, { message: "Invalid credentials" });
      } else {
        return done(null, { username: username, role: "pharmasist" });
      }
    });
  })
);

passport.use(
  "doctor",
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authDoctor(username, password).then((result) => {
      actualUsername = result[0].username;
      actualPassword = result[0].password;
      if (result == 0) {
        console.log("Failed");
        console.log("username: " + username);
        console.log('password" ' + password);
        return done(null, false, { message: "Invalid credentials" });
      } else {
        return done(null, { username: username, role: "doctor" });
      }
    });
  })
);

passport.use(
  "Admin",
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authAdmin(username, password).then((result) => {
      actualUsername = result[0].username;
      actualPassword = result[0].password;
      if (result == 0) {
        console.log("Failed");
        console.log("username: " + username);
        console.log('password" ' + password);
        return done(null, false, { message: "Invalid credentials" });
      } else {
        return done(null, { username: username, role: "admin" });
      }
    });
  })
);

function ensureAuthentication(requiredRole) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role == "pharmasist") {
      return next();
    } else {
      console.log("ensureAuthentication Failed");
      res.redirect("/");
    }
  };
}

function authPharma(username, password, auth_type) {
  var auth;
  var query = `select * from pharma_auth where username=? and password=?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [username, password], (err, rows, fields) => {
      if (err) throw err;
      //console.log(fields)
      if (rows.length > 0) {
        resolve(rows);
      } else {
        resolve(0);
      }
    });
  });
}

function authDoctor(username, password, auth_type) {
  var auth;
  var query = `select * from doctor_auth where username=? and password=?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [username, password], (err, rows, fields) => {
      if (err) throw err;
      if (rows.length > 0) {
        resolve(rows);
      } else {
        resolve(0);
      }
    });
  });
}

function authAdmin(username, password, auth_type) {
  var auth;
  var query = `select * from admin_auth where username=? and password=?`;
  return new Promise((resolve, reject) => {
    connection.query(query, [username, password], (err, rows, fields) => {
      if (err) throw err;
      if (rows.length > 0) {
        resolve(rows);
      } else {
        resolve(0);
      }
    });
  });
}

function searchPat(id) {
  return new Promise((resolve, reject) => {
    connection.query(query, [username, password], (err, rows, fields) => {
      if (err) throw err;
      console.log(rows.length);
      if (rows.length > 0) {
        resolve(rows);
      } else {
        resolve(0);
      }
    });
  });
}

const port = 3000;

app.get("/", (req, res) => {
  res.render("Front");
  //res.sendFile(path.join(__dirname + '\\front.html'));
});

app.get("/admin", ensureAuthentication('admin'), (req, res) => {
    res.render("admin_home", { rows: undefined });
  });

app.get("/doctor", ensureAuthentication('doctor'), (req, res) => {
    res.render("doctor_home", { rows: undefined });
  });

app.get("/pharma", ensureAuthentication('pharamasist'), (req, res) => {
  res.render("pharma_home", { rows: undefined });
});

app.post(
  "/pharma_login",
  passport.authenticate("pharmasist", {
    successRedirect: "/pharma",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post(
  "/doctor_login",
  passport.authenticate("doctor", {
    successRedirect: "/doctor",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post(
  "/admin_login",
  passport.authenticate("admin", {
    successRedirect: "/admin",
    failureRedirect: "/",
    failureFlash: true,
  })
);

app.post("/", (req, res) => {
  res.render("front", { error: "" });
});

app.post("/auth", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var choice = req.body.role;
  console.log(choice);
  const data = { message: username };
  switch (choice) {
    case "Doctor":
      res.render("doc_home");
      break;
    case "Pharmacist":
      var auth_type = "pharma_auth";
      //console.log('auth func out: ' + String(auth))
      var query = `select * from pharma_auth where username=? and password=?`;
      connection.query(query, [username, password], (err, rows, fields) => {
        if (err) throw err;
        console.log(rows.length);
        if (rows.length > 0) {
          res.render("/pharma");
        } else {
          res.redirect("/");
        }
      });
      /*console.log(authPharma(username, password, "auth_pharma"));
            if (authPharma(username, password, "auth_pharma") == true){
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/pharma')
            }
            else
                res.send('Incorrect Username and/or Password!'); */
      break;
    case "Administrator":
      res.render("admin_home");
      break;
  }
});

app.post("/search_pat", (req, res) => {
  var pat_id = req.body.pat_id;
  //var rows = searchPat(pat_id);
  var pharma_query = "select pharma_name from pharmasist where pharma_id = ?";
  var presc_query =
    "select patient.pat_id, pat_name, pat_dob, pat_sex, doc_id, presc_id, presc_date, amount from patient inner join prescription on patient.pat_id = prescription.pat_id where patient.pat_id = ?";

  connection.query(pharma_query, [pat_id], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
    if (rows.length == 0) {
      console.log("This patient does not exist");
    } else {
      console.log(rows);
      res.render("pharma_home", { rows: rows });
    }
  });

  connection.query(presc_query, [pat_id], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
    if (rows.length == 0) {
      console.log("This patient does not exist");
    } else {
      console.log(rows);
      res.render("pharma_home", { rows: rows });
    }
  });
});

const server = http.createServer(app);
server.listen(port);

//app.listen(port, ()=> {
console.log(`the server is running on port ${port}`);
//});