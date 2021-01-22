---
layout: post
title:  "Build a Blog using Nodejs - Part 2 Templating and Routing"
summary: "Learn how to build a Blog App using Nodejs"
author: xplor4r
date: '2021-01-02 14:35:23 +0530'
category: ["nodejs", "express","javascript"]
thumbnail: /assets/img/posts/code.jpg
keywords: nodejs, express, create server, node blog
permalink: /blog/build-a-blog-using-nodejs-part-2/
usemathjax: false
---

In our previous tutorial [Part-1](/blog/build-a-blog-using-nodejs-part-1/), we saw how to setup our server.In this tutorial, we will work on the templating and routing of our blog app. Let's get going...

# Templating

In Nodejs we can use Template Engines to render dynamic content in our template by representational logic. In our case,
we will use ejs (embedded js) for our Blog.

You can visit here for more info :
https://github.com/mde/ejs

Lets install ejs

`
npm install ejs --save
`

Adding support for our server to use ejs :

```
const ejs = require('ejs');
```

We will use this soon, but lets first create our templates which will be using ejs.

# Creating Templates :

Lets create index.html, about.html, contact.html and for our blog - blog.ejs.

index.html :

```html
<html>
    <head>
        <title> Home - Node Blog</title>
    </head>

    <body>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/blog">Blog</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>

        <h1> Home </h1>


        <p> Welcome to my Blog</p>

    </body>
</html>

```

about.html

```html
<html>
    <head>
        <title> About - Node Blog</title>
    </head>
    <body>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/blog">Blog</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>
        <h1> About </h1>

        <p> Hi ! This blog is built using node</p>
    </body>
</html>

```

contact.html

```html
<html>
    <head>
        <title> Contact - Node Blog</title>
    </head>
    <body>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/blog">Blog</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>
        <h1> Contact </h1>

        <p> Contact Form goes here...</p>
    </body>
</html>

```
In blog/postsLists.json add this :

```json
[
    {
        "title": "Hello World",
        "excerpt": "This is my first post",
        "description": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        "title": "Hello World again !",
        "excerpt": "This is my second post",
        "description": "CASsfsas Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]
```

And blog.ejs

```html
<html>
    <head>
        <title> Blog - Node Blog</title>
    </head>
    <body>
        <ul>
            <li>
                <a href="/">Home</a>
            </li>
            <li>
                <a href="/blog">Blog</a>
            </li>
            <li>
                <a href="/about">About</a>
            </li>
            <li>
                <a href="/contact">Contact</a>
            </li>
        </ul>
        <h1> Blog </h1>

        <p>Showing All Posts</p>

        <ul>
             <% posts.map(post => { %>
                <li>
                    <h2><%= post.title %></h2>
                    <p><%= post.excerpt %></p>
                    <p><%= post.description %></p>
                </li>
            <% }); %>
        </ul>
    </body>
</html>

```
As you can see, we are rendering posts in our blog from postsLists.json. Rendering will happen with the logic we will write soon!

# Routing

Lets create our Routes, For now let's create :

Home - /  (Our Homepage) - Create index.ejs
Blog - /blog (Blog Page to list all posts) - Create blog.ejs
About  - /about (About Page) - Create about.html
Contact - /contact (Contact Page) - Create contact.html
Posts - /api/posts (API to output posts json) - postsLists.json

In order to check which route we are visiting and based on it the template to be rendered, lets write the logic :

In our server.js, modify it like this:

```js
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

// data for posts
const blogPosts = require('./blog/postsLists.json');

const server = http.createServer((req, res) => {

    // check the type of request
    let url = req.url;
    let routePath = '.' + url;

    if(routePath === './'){
        routePath = './index.html';
    }
    else if(routePath === './blog'){
        routePath = './blog.ejs';
    }
    else if(routePath === './about'){
        routePath = './about.html';
    }
    else if(routePath === './contact'){
        routePath = './contact.html';
    }
    else if(routePath === './api/posts'){
        routePath = './blog/postsLists.json';
    }

    let extname = String(path.extname(routePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.ejs': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream';

    // read the content and return accordingly
     fs.readFile(routePath, (err, content) => {
        // if error occurs, throw 404 or throw error message
        if(err){

            // IF RESOURCE NOT FOUND
            if(err.code == 'ENOENT'){
                fs.readFile('./404.html', (err, content) => {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.end(content, 'utf-8');
                });
            }else{
                res.writeHead(500);
                res.end('Sorry, something went wrong. Please contact the admin for error' + err.code + '..\n');
            }
        }else{

            // if no error occurs, return the content based on the content-type
            res.statusCode = 200;

            // if templates are called (ejs rendered pages)
            if(contentType === "application/javascript")
            {
                let htmlContent = fs.readFileSync(routePath, 'utf8');
                let htmlRendered;

                if(url === '/blog'){
                    htmlRendered = ejs.render(htmlContent, {posts: blogPosts });
                }
                else{
                    htmlRendered = ejs.render(htmlContent);
                }

                res.setHeader('Content-Type', 'text/html');
                res.end(htmlRendered, 'utf-8');
            }else{

                // if no ejs or normal asset files
                res.setHeader('Content-Type',contentType);
                res.end(content, 'utf-8');
            }
        }
    });

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

So what we did is we check which type of route is getting called, if it is ejs or "application/javascript" type content,
we render the ejs files and pass the posts data in case the route is '/blog', ejs will render the template and the data
, else if not ejs it will render normally for the html or any other content types. You can also check using Postman App


Now if you run the server:

```
$ npm run start
```
Visit http://localhost:3000

You should see everything working fine. We will try to create more functionality in the upcoming articles !

