const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('home.html', {root: 'public/views'});
});

router.get('/products', (req, res) => {
    res.sendFile('products.html', {root: 'public/views'});
});

router.get('/reports', (req, res) => {
    res.sendFile('reports.html', {root: 'public/views'});
});

module.exports = router;