const express = require('express');
const app = express();
const routes = require('./routes/index');

app.use(express.static('public'));
app.use('/', routes);

app.listen(8080, () => {
    console.log('App listening on port 8080!');
});
