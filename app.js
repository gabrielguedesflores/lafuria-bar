const express = require('express');
const session = require('express-session');
const app = express();
const routes = require('./routes/index');

app.use(express.json())
app.use(session({
    secret: 'your-secret-value', 
    resave: false,
    saveUninitialized: false,
}));

app.use(express.static('public'));
app.use('/', routes);

app.listen(8080, () => {
    console.log('App listening on port 8080!');
});
