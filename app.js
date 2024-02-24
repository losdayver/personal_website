const express = require('express');
const path = require('path');
const fs = require('fs');

const port = 3000;

let app = express();

app.use(express.static('public'));

app.set('views', path.join(__dirname, 'public', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/posts', (req, res) => {
    const posts_descriptors_path = 
    './public/views/posts_descriptors.json';

    const posts_path = './posts/';

    let rawdata = fs.readFileSync(posts_descriptors_path);
     
    let posts = JSON.parse(rawdata).posts;

    let posts_sorted = [];

    if (req.query.substring || req.query.tags) {
        for (post of posts) {
            let substring_check = true;
            let tags_check = false;

            if (req.query.substring && !post.title.toLowerCase().includes(req.query.substring)) {
                substring_check = false;
            }

            if (req.query.tags) {
                const tags = req.query.tags.split(' ');

                for (let tag of tags) {
                    if (post.tags.includes(tag)) {
                        tags_check = true;
                        break;
                    } 
                }
            }

            if (substring_check && tags_check) {
                posts_sorted.push(post);
            }
        }
    }
    else {
        posts_sorted = posts;
    }

    res.render('index', {
        nav_highlight: 'Posts',
        container_contents: 'postspage',
        posts: posts_sorted,
        posts_path: posts_path
    });
});

app.get('/home', (req, res) => {
    res.render('index', {
        nav_highlight: 'Home',
        container_contents: 'homepage'
    });      
});

app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});