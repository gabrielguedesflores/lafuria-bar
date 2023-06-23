const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('./../middleware').ensureAuthenticated;

router.post('/start-session', (req, res) => {
    req.session.isAuthenticated = true;
    res.cookie('userid', req.body.userid);  
    res.redirect('/login');
});

router.get('/sair', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.send({ success: false });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('userid'); 
        res.redirect('/login');
    });
});


router.post('/end-session', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return res.send({ success: false });
        }
        res.clearCookie('connect.sid'); // substitua 'connect.sid' pelo nome do seu cookie de sessão
        res.send({ success: true });
    });
});

router.get('/', ensureAuthenticated, (req, res) => {
    res.sendFile('home.html', {root: 'public/views'});
});

router.get('/comandas', ensureAuthenticated, (req, res) => {
    res.sendFile('orders.html', {root: 'public/views'});
});

router.get('/produtos', ensureAuthenticated, (req, res) => {
    res.sendFile('products.html', {root: 'public/views'});
});

router.get('/relatorios', ensureAuthenticated, (req, res) => {
    res.sendFile('reports.html', {root: 'public/views'});
});

router.get('/configuracoes', ensureAuthenticated, (req, res) => {
    res.sendFile('settings.html', {root: 'public/views'});
});

router.get('/login', (req, res) => {
    res.sendFile('login.html', {root: 'public/views'});
});

// router.get('/sair', (req, res) => {
//     res.sendFile('logout.html', {root: 'public/views'});
// });

module.exports = router;