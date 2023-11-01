const express = require('express');
const expressNunjucks = require('express-nunjucks').default;
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("express"));
app.use(bodyParser.urlencoded({ extended: false }));

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


const server = http.createServer(app);
server.listen(port)

//app.listen(port, ()=> {
console.log(`the server is running on port ${port}`);
//});