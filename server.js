const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const session = require("express-session");
const passport = require("passport");
var flash = require("connect-flash");
const { defaultMaxListeners } = require("events");
const { domainToASCII } = require("url");
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
app.use(express.static('./static'))
//app.use(express.static("express"));
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
  'pharmasist',
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authPharma(username, password).then((result) => {
      actualUsername = result[0].username;
      actualPassword = result[0].password;
      console.log('username:' + username);
      console.log('password:' + password);
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
  'doctor',
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
  'admin',
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authAdmin(username, password).then((result) => {
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

class doctor{
  constructor(docID, docName, docSpec, docExp, docAge, docEmail){
    this.docID = docID;
    this.docName = docName;
    this.docSpec = docSpec;
    this.docExp = docExp;
    this.docAge = docAge;
    this.docEmail = docEmail;
  }
}

function insertDoc(docID, docName, docSpec, docPassword, docExp, docAge, docEmail){
  var query = "insert into doctor values(?,?,?,?,?,?)";
  var auth_query = "insert into doctor_auth values(?,?)";
  connection.query(query, [docID, docName, docSpec, docExp, docAge, docEmail], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
  });
  connection.query(auth_query, [docPassword, docID], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
  });

}

function insertPat(patID, patName, patDOB, patSex){
  var query = "insert into patient values(?,?,?,?)";
  connection.query(query, [patID, patName, patDOB, patSex], (err, rows, fields) => {
    if (err) throw err;
  });
}

function insertPharma(pharmID, pharmName){
  var query = "insert into pharmasist values(?,?)";
  connection.query(query, [pharmID, pharmName], (err, rows, fields) => {
    if (err) throw err;
  });
}

function ensureAuthentication(requiredRole) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role == requiredRole) {
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
        console.log('no');
        resolve(0);
      }
    });
  });
}

function authDoctor(username, password, auth_type) {
  var auth;
  var query = `select * from doctor_auth where id=? and password=?`;
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
  var patQuery =  "select pat_name from patient where pat_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(patQuery, [id], (err, rows, fields) => {
      if (err) throw err;
      console.log(rows.length);
      if (rows.length > 0) {
        resolve(rows[0].pat_name);
      } else {
        resolve(0);
      }
    });
  });
}

const port = 3000;

app.get("/", (req, res) => {
  //req.logout();
  res.render("Front");
  //res.sendFile(path.join(__dirname + '\\front.html'));
});

app.get("/admin", ensureAuthentication('admin'), (req, res) => {
  res.render("admin_home", { rows: undefined });
});

app.get("/doctor", ensureAuthentication('doctor'), (req, res) => {
  res.render("doctor_home", { rows: undefined });
});

app.get("/pharma", ensureAuthentication('pharmasist'), (req, res) => {
  res.render("pharma_home", { rows: undefined });
});

app.post("/insert_doc", ensureAuthentication("admin"), (req, res) => {
  var docName = req.body.name;
  console.log('name: ' + docName);
  var docID = req.body.id;
  console.log('ID:' + docID);
  var docSpec = req.body.spec;
  console.log('Spec: ' + docSpec);
  var docExp = req.body.exp;
  console.log('Exp: ' + docExp);
  var docEmail = req.body.email;
  console.log('Email: ' + docEmail);
  var docAge = req.body.age;
  console.log('Age: ' + docAge);
  var docPassword = req.body.password;
  console.log('Password: ' + docPassword);
  insertDoc(docID, docName, docSpec, docPassword, docExp, docAge, docEmail);
  res.redirect('admin');
});

app.post("/insert_pat", ensureAuthentication("admin"), (req, res) => {
  var patName = req.body.pat_name;
  var patID = req.body.pat_id;
  var patDOB = req.body.pat_dob;
  var patSex = req.body.pat_sex;
  insertPat();
  res.redirect('/admin');
});

app.post("/insert_pharma", ensureAuthentication("admin"), (req, res) => {
  
  var pharmName = req.body.pharm_name;
  var pharmID = req.body.pharm_id;
  insertPharma(pharmID, pharmName);
  
  res.redirect('/admin');
});

app.post("/insert_admin", ensureAuthentication("admin"), (req, res) => {
  var query = "insert into admin values(?,?)";
  var adminUsername = req.body.admin_user_name;
  var adminPassword = req.body.admin_password;
  connection.query(query, [adminUsername, adminPassword], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
  });
  res.redirect('/admin');
});

app.post("/prescribe", ensureAuthentication("doctor"), (req,res) => {
    var query = 'insert into prescription values(?,?,?,?,?)'
    var prescId = req.body.presc_id;
    var docId = req.body.doc_id;
    var patId = req.body.pat_id;
    var prescDate = req.body.presc_date;
    var amount = req.body.presc_amount;
    connection.query(query, [prescId, docId, patId, prescDate, amount], (err, rows, fields) => {
      if (err) throw err;
      console.log(rows.length);
    });
    res.redirect('/doctor');
});


app.post("/login", (req, res) => {
  res.send("tf");
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
    "select p.pat_id, p.pat_name, p.pat_sex, p.pat_dob, pr.presc_id, m.presc_name, pr.presc_date, pr.prescribed, pr.amount from patient p join prescription pr on p.pat_id = pr.pat_id join meds m on pr.presc_id = m.presc_id where p.pat_id = ? and pr.prescribed = 0";
  
  /*connection.query(pharma_query, [pat_id], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
    if (rows.length == 0) {
      console.log("This patient does not exist");
      //res.render("pharma_home", { rows: 'invalid' });
    } else {
      console.log(rows);
      res.render("pharma_home", { rows: rows });
    }
  }); */

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

