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
const { pseudoRandomBytes } = require("crypto");
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
app.use(express.static("./static"));
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
  "pharmasist",
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authPharma(username, password).then((result) => {
      //actualUsername = result[0].username;
      //actualPassword = result[0].password;
      console.log("username:" + username);
      console.log("password:" + password);
      if (result == 0) {
        console.log("Pharma Failed");
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
      //actualUsername = result[0].doc_id;
      //actualPassword = result[0].password;
      if (result == 0) {
        console.log("Doctor Failed");
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
  "admin",
  new LocalStrategy(function (username, password, done) {
    var actualUsername, actualPassword;
    authAdmin(username, password).then((result) => {
      if (result == 0) {
        console.log("Admin Failed");
        console.log("username: " + username);
        console.log('password" ' + password);
        return done(null, false, { message: "Invalid credentials" });
      } else {
        return done(null, { username: username, role: "admin" });
      }
    });
  })
);

function queryDatabase(query, paramaters){
  return new Promise((resolve, reject) => {
    connection.query(
      query,
      paramaters,
      (err, rows, fields) => {
        if (err) {
          console.log(err);
          reject(err);
        } 
        else{
          resolve(rows);
        }
      }
    )
  })
}

function insertDoc(
  docID,
  docName,
  docSpec,
  docPassword,
  docExp,
  docAge,
  docEmail
) {
  var query = "insert into doctor values(?,?,?,?,?,?)";
  var auth_query = "insert into doctor_auth values(?,?)";
  connection.query(
    query,
    [docID, docName, docSpec, docExp, docAge, docEmail],
    (err, rows, fields) => {
      if (err) throw err;
      console.log(rows.length);
    }
  );
  connection.query(auth_query, [docPassword, docID], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
  });
}

function insertPat(patID, patName, patDOB, patSex) {
  var query = "insert into patient values(?,?,?,?)";
  connection.query(
    query,
    [patID, patName, patDOB, patSex],
    (err, rows, fields) => {
      if (err) throw err;
    }
  );
}

function insertPharma(pharmID, pharmName, pharmaPassword) {
  var query = "insert into pharmasist values(?,?)";
  var authQuery = "insert into pharma_auth values(?,?)";
  connection.query(query, [pharmID, pharmName], (err, rows, fields) => {
    if (err) throw err;
    else {
      return new Promise((resolve, reject) => {
        connection.query(
          query,
          [pharmID, pharmaPassword],
          (err, rows, fields) => {
            if (err) throw err;
            else {
              console.log("inserted username: " + pharmID);
              resolve(rows);
            }
          }
        );
      });
    }
  });
}

function docPageInfoQuery(doc_id) {
  var query =
    "select d.doc_id, d.doc_name, d.doc_spec, d.age, d.doc_exp, a.pat_id, p.pat_name, p.pat_age, p.pat_sex from doctor d join assigned_doc a join patient p on d.doc_id = a.doc_id and p.pat_id = a.pat_id where d.doc_id = ?";
  return new Promise((resolve, reject) => {
    connection.query(query, [doc_id], (err, rows, fields) => {
      if (err) throw err;
      else {
        resolve(rows);
      }
    });
  });
}
function ensureAuthentication(requiredRole) {
  return function (req, res, next) {
    if (req.isAuthenticated() && req.user.role == requiredRole) {
      return next();
    } else {
      console.log(requiredRole + " ensureAuthentication Failed");
      res.redirect("/login_page");
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
        console.log('yes');
        resolve(rows);
      } else {
        console.log("no");
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
  var patQuery = "select * from patient";
  return new Promise((resolve, reject) => {
    connection.query(patQuery, [id], (err, rows, fields) => {
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

function searchMed(id) {
  var patQuery = "select * from meds";
  return new Promise((resolve, reject) => {
    connection.query(patQuery, [id], (err, rows, fields) => {
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
  res.render("home");
})

app.get("/about", (req, res) => {
  res.render("about");
})

app.get("/login_page", (req, res) => {
  //req.logout();
  res.render("Front");
  //res.sendFile(path.join(__dirname + '\\front.html'));
});

app.post("/login_page", (req, res) => {
  //req.logout();
  res.render("Front");
  //res.sendFile(path.join(__dirname + '\\front.html'));
});

app.get("/admin", ensureAuthentication("admin"), (req, res) => {
  res.render("admin_home", { rows: undefined });
});



app.get("/doctor", ensureAuthentication("doctor"), (req, res) => {
  var doc_id = req.user.username;
  docPageInfoQuery(doc_id).then((result) => {
    searchPat(doc_id).then((patResult) => {
      searchMed(doc_id).then((medResult) => {
        console.log("patResult " + medResult);
        res.render("doctor_home", {
          rows: result,
          pats: patResult,
          meds: medResult,
        });
      });
    });
  });
});

app.get("/pharma", ensureAuthentication("pharmasist"), (req, res) => {
  res.render("pharma_home", { rows: undefined });
});

app.post("/insert_doc", ensureAuthentication("admin"), (req, res) => {
  var docName = req.body.name;
  console.log("name: " + docName);
  var docID = req.body.id;
  console.log("ID:" + docID);
  var docSpec = req.body.spec;
  console.log("Spec: " + docSpec);
  var docExp = req.body.exp;
  console.log("Exp: " + docExp);
  var docEmail = req.body.email;
  console.log("Email: " + docEmail);
  var docAge = req.body.age;
  console.log("Age: " + docAge);
  var docPassword = req.body.password;
  console.log("Password: " + docPassword);
  insertDoc(docID, docName, docSpec, docPassword, docExp, docAge, docEmail);
  res.redirect("admin");
});

app.post("/insert_pat", ensureAuthentication("admin"), (req, res) => {
  var patName = req.body.pat_name;
  var patID = req.body.pat_id;
  var patAge = req.body.pat_age;
  var patSex = req.body.pat_sex;
  insertPat(patID, patName, patAge, patSex);
  res.redirect("/admin");
});

app.post("/insert_pat_by_doc", ensureAuthentication("doctor"), (req, res) => {
  var patName = req.body.pat_name;
  var patID = req.body.pat_id;
  var patAge = req.body.pat_age;
  var patSex = req.body.pat_sex;
  insertPat(patID, patName, patAge, patSex);
  res.redirect("/doctor");
});

app.post("/insert_pharma", ensureAuthentication("admin"), (req, res) => {
  var pharmaName = req.body.name;
  console.log("name: " + pharmaName);
  var pharmaID = req.body.id;
  console.log("ID:" + pharmaID);
  var pharmaPassword = req.body.password;
  console.log("Password: " + pharmaPassword);
  insertPharma(pharmaID, pharmaName, pharmaPassword);
  insertPharma(pharmaID, pharmaName, pharmaPassword).then((Result) => {
    res.render("Front", { rows: undefined });
  });
});

app.post("/insert_admin", ensureAuthentication("admin"), (req, res) => {
  var query = "insert into admin values(?,?)";
  var adminUsername = req.body.admin_user_name;
  var adminPassword = req.body.admin_password;
  connection.query(
    query,
    [adminUsername, adminPassword],
    (err, rows, fields) => {
      if (err) throw err;
      console.log(rows.length);
    }
  );
  res.redirect("/admin");
});

app.post('/hello', (req, res) => {
  const pat_id = req.body.pat_id;
  const presc_id = req.body.presc_id;
  const doc_id = req.body.doc_id;
  console.log("Received: ", req.body);
  var query = "update prescription set prescribed = 1 where pat_id = ? and presc_id = ?";
  queryDatabase(query, [pat_id, presc_id])
    .then(results => {
      console.log(results);
      const returnData = {
        presc_id: presc_id,
        doc_id: doc_id
      }
      res.json(returnData);
    })
    .catch(err => {
      console.log('error: ', err)
    })
});

app.post("/prescribe", ensureAuthentication("doctor"), (req, res) => {
  var query = "insert into prescription values(?,?,?,?,?,?)";
  var prescId = req.body.presc_list;
  var docId = req.body.presc_doc_id;
  var patId = req.body.id_list;
  var prescDate = req.body.pat_presc_date;
  var amount = req.body.amount;
  connection.query(
    query,
    [prescId, docId, patId, prescDate, amount, 0],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.send("error");
      } else {
        res.redirect("/doctor");
      }
    }
  );
});

app.post("/get_pat", (req, res) => {});
app.post("/login", (req, res) => {
  res.send("tf");
});

app.get(
  "/pharma_login",
  passport.authenticate("pharmasist", {
    successRedirect: "/pharma",
    failureRedirect: "/login_page",
    failureFlash: true,
  })
);

app.get(
  "/doctor_login",
  passport.authenticate("doctor", {
    successRedirect: "/doctor",
    failureRedirect: "/login_page",
    failureFlash: true,
  })
);

app.get(
  "/admin_login",
  passport.authenticate("admin", {
    successRedirect: "/admin",
    failureRedirect: "/login_page",
    failureFlash: true,
  })
);

app.post("/", (req, res) => {
  res.render("front", { error: "" });
});



app.post("/search_pat", (req, res) => {
  var pat_id = req.body.pat_id;
  console.log('pat id: ', pat_id);
  //var rows = searchPat(pat_id);
  const pat_check_query = 'select * from patient where pat_id = ?';
  var pharma_query = "select pharma_name from pharmasist where pharma_id = ?";
  var presc_query =
    "select p.pat_id, p.pat_name, p.pat_sex, p.pat_age, pr.presc_id, m.presc_name, pr.presc_date, pr.prescribed, pr.amount from patient p join prescription pr on p.pat_id = pr.pat_id join meds m on pr.presc_id = m.presc_id where p.pat_id = ? and pr.prescribed = 0";
  presc_query = 'select * from pharmasist_view where pat_id = ? and prescribed = 0';
  
  connection.query(presc_query, [pat_id], (err, rows, fields) => {
    if (err) throw err;
    console.log(rows.length);
    if (rows.length == 0) {
      console.log("This patient does not exist");
      res.status(404).json({ error: 'patient not found' });
    } else {
      console.log(rows);
      res.json(rows);
      //res.status(200).send({rows : rows});
      //res.render("pharma_home", { rows: rows });
    }
  });
});

const server = http.createServer(app);
server.listen(port);

//app.listen(port, ()=> {
console.log(`the server is running on port ${port}`);
//});
