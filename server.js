const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql')
const session = require('express-session')


const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'aaa',
    database: "pharma"
});

connection.connect(error => {
    if (error){
        console.log("A error has been occurred "
            + "while connecting to database.");        
        throw error;
    }
});
connection.query('select * from doctor', (err, rows, fields) => {
    if (err) throw err
  
    console.log(rows)
  })
  
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret:'secret',
    resave:true,
    saveUninitialized:true
}));

const port = 3000;

app.get('/', (req, res)=> {
    res.render('Front')
    //res.sendFile(path.join(__dirname + '\\front.html'));   
});

app.post('/', (req, res) =>{
    var username = req.body.username;
    console.log(username)
    var password = req.body.password;
    const data = { message: username };
    res.render('homepage', {name: username });
});

app.post('/auth', (req, res) =>{
    
});

const server = http.createServer(app);
server.listen(port)

//app.listen(port, ()=> {
console.log(`the server is running on port ${port}`);
//});