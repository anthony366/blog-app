const express = require('express'); 
const app = express();
const router = express.Router(); 
const mongoose = require('mongoose');
const config = require('./config/database');
const path = require('path');
const authentication = require('./routes/authentication')(router);
const blogs = require('./routes/blogs')(router);
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('Cannot connect to database: ', err);
    } else {
       console.log('Connected to database: ' + config.db);
    }
});

// Middleware
app.use(cors({
    origin: 'http://localhost:4200'
}));
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/client/dist'));
app.use('/authentication', authentication); // Use Authentication routes in application
app.use('/blogs', blogs);

// Connect server to Angular 2 Index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

app.listen(port, () => {
    console.log('Listening on port ' + port);
});