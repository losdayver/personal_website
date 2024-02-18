const express = require('express');
const path = require('path');

const port = 3000;

let app = express();

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/:route', (req, res) => {
    if (req.params.route === 'home'){
        res.render('index', {
            nav_highlight: 'Home',
            container_contents: 'homepage'
        });
    }        
    else if (req.params.route === 'posts'){
        res.render('index', {
            nav_highlight: 'Posts',
            container_contents: 'postspage'
        });
    }        
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});