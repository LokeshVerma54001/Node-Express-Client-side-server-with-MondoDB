// routing chaper
const express = require('express');
const router = express.Router();
const path = require('path');

//request and response
// ^/$|/index.html means it must start or end with /
// or it should be index.html and .html is optional
router.get('^/$|/index(.html)?', (req, res) => {
    // res.sendFile('./views/index.html', {root:__dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res) => {
    res.redirect(301,'/new-page.html'); //it will send 302 by default
});

module.exports = router;