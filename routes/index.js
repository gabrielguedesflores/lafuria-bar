const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile('home.html', {root: 'public/views'});
});

router.get('/comandas', (req, res) => {
    res.sendFile('orders.html', {root: 'public/views'});
});

router.get('/produtos', (req, res) => {
    res.sendFile('products.html', {root: 'public/views'});
});

router.get('/relatorios', (req, res) => {
    res.sendFile('reports.html', {root: 'public/views'});
});

router.get('/configuracoes', (req, res) => {
    res.sendFile('settings.html', {root: 'public/views'});
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', {root: 'public/views'});
});

router.get('/sair', (req, res) => {
    res.sendFile('logout.html', {root: 'public/views'});
});

module.exports = router;