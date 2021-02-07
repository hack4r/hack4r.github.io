---
layout: post
title:  "Build a Blog using Nodejs - Part 3 Add New Posts"
summary: "Learn how to build a Blog App using Nodejs"
author: xplor4r
date: '2021-02-07 14:35:23 +0530'
category: ["nodejs", "express"]
thumbnail: /assets/img/posts/code.jpg
keywords: nodejs, express, create server, node blog
permalink: /blog/build-a-blog-using-nodejs-part-3/
usemathjax: false
---

In this article, we will see how to create blog posts :

Lets create a route for creating posts :

We will create a /add-post route

add-post.ejs
```html
<html>
    <head>
        <title> Add Blog Post - Node Blog</title>

        <link rel="stylesheet" href="assets/css/style.css"/>
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
            <li>
                <a href="/add-post"> Add Post</a>
            </li>
        </ul>
        <h1> Blog - Add Blog Post </h1>

        <p>Add Blog Post</p>

        <h3>Create a blog post</h3>
        <form action="/create-post" method="POST">
            <fieldset>
                <label for="posttitle">Title :</label>
                <input type="text" name="posttitle"/>
            </fieldset>
            <fieldset>
                <label for="postsummary"> Summary :</label>
                <input type="summary" name="postsummary" />
             </fieldset>
             <fieldset>
                <label for="postcontent"> Content : </label>
                <textarea name="postcontent" rows="10" cols="14">
                </textarea>
             </fieldset>
             <fieldset>
                <label for="postauthor"> Author : </label>
                <input type="text" name="postauthor">
             </fieldset>
            <button type="submit">Send</button>
        </form>

    </body>
</html>

```
The /create-post will be our api endpoint to capture the form data. Since it will be in 'application/x-www-form-urlencoded' format, we need to parse the data to represent as json and then save it in our postsLists.json (posts file)

We will create a handler function for collecting this data from the form

Lets create a src/handler.js

```js
const querystring = require('querystring');

function collectRequestData(request, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    if(request.headers['content-type'] === FORM_URLENCODED) {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            callback(querystring.parse(body));
        });
    }
    else {
        callback(null);
    }
}

exports.collectFormData = collectRequestData;
//exports.someMethod = function() {}
```



```js
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

const {collectFormData} = require('./src/handlers');

// data for posts
const blogPosts = require('./posts/postsLists.json');


const app = (req, res) => {

    // check the type of request
    let endpoint = req.url;
    let method = req.method;

    console.log('Server Hit :', endpoint);

    // submit post
    if(endpoint === '/create-post' && method === 'POST'){
        collectFormData(req, result => {

            // res.end(`Parsed data ${result.posttitle}`)
           let resultObj = {
               'title': result.posttitle,
               'excerpt':result.postsummary,
               'description': result.postcontent,
               'author': result.postauthor
           }

           // read the file
           fs.readFile('./posts/postsLists.json', (err, data) => {
                let fetchedData = JSON.parse(data);
                let postId = fetchedData.length + 1;
                resultObj.id = postId;

                fetchedData.push(resultObj); //since its array of json Objects
                resultObj = JSON.stringify(fetchedData);

                //append to the file
                fs.writeFileSync('./posts/postsLists.json', resultObj, (err) => {
                    if (err){
                      throw err;
                    }
                    console.log('The "data to append" was appended to file!');
                });
           });


           // redirect
           res.statusCode = 302;
           res.setHeader('Location', '/blog');
           return res.end('OK');
        })
    }else{
        let routePath = '.' + endpoint;

        if(routePath === './'){
            routePath = './index.ejs';
        }
        else if(routePath === './blog'){
            routePath = './blog.ejs';
        }
        else if(routePath === './add-post'){
            routePath = './add-post.ejs';
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

                    if(endpoint === '/blog'){
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
     };
}

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

In our posts "/posts/postsLists.json", we can see the posts generated whenever we create a post.

In the next article we will check how to enhance our blog further.



