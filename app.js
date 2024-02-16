const express = require('express');
const path = require('path');

const port = 3000;

let app = express();

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', {
        params: 'Hello World!'
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});