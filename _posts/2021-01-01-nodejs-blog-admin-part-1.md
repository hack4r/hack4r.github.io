---
layout: post
title:  "Build a Blog using Nodejs - Part 1 Creating Server"
summary: "Learn how to build a Blog App using Nodejs"
author: xplor4r
date: '2021-01-01 14:35:23 +0530'
category: ["nodejs", "express"]
thumbnail: /assets/img/posts/code.jpg
keywords: nodejs, express, create server, node blog
permalink: /blog/build-a-blog-using-nodejs-part-1/
usemathjax: false
---

We will be using Nodejs and Mongodb.. No Express Framework ! for building our App. This article is for those who wants to learn to use core of nodejs and its extensibility features.
Since we are not using any frameworks, we might need to build many stuff using our own. Feeling Excited ? Let's get started then :

# Part 1 - Setting up the project - Installing the requirements

Since we will be working with Nodejs and Mongodb based projects, we need to install few tools.

1. Node.js

Node.js is a Javascript runtime built on Chrome's V8 Javascript Engine.We will use this to run our code for Server Side Development.
You can install nodejs by downloading the executable binaries based on your OS at https://nodejs.org. Download the latest LTS version available.

For me the latest version of Nodejs, while writing this article is v.14.15.3 LTS. By installing we will get Node as well as NPM Installed

To check if Nodejs is installed properly, You can run this commands this in a new command prompt or bash terminal.

```
node -v
npm -v
```

It should be fine, if it shows up the versions.


2. Mongodb

Mongodb is a no-sql database, which we will use for data operations for our App. It supports JSON Type data, which is very useful for aggregration operations.
You can install mongodb by downloading the executable binaries based on your OS for Community version at https://www.mongodb.com/try/download/community. Download the current version.

For me the latest version of Mongodb, while writing this article is v.4.4.2. By Intstalling we will get Mongodb and Compass Installed.

To check if Mongodb is installed properly,

You can start the db server by running this commands in (in case of Windows) :

```
cd C:\Program Files\MongoDB\Server\4.4\bin>mongod.exe --dbpath "C:\data\db"
```

Here, dbpath refers to the db directory (you might need to create that incase it doesn't exist, otherwise the run might fail.

It should be fine..

3. VSCode

VSCode is a code editor that supports extensive development. You can use any code editor of your choice, but I recommend using VSCode as it supports great extentions and auto-complete codes.

You can download the executable binary based on your OS from https://code.visualstudio.com

4. Git Bash

We need bash for running bash commands in our terminal, VSCode can use bash in its integrated terminal which helps a lot.

You can download the executable binary based on your OS from https://git-scm.com/downloads

5. Postman

We need postman app for testing our API Endpoints later on.

You can download the app based on your OS from https://www.postman.com/downloads/

## Creating our nodejs project

To create a new nodejs project, you can start by create a project directory and creating a package.json file.

```
$ mkdir node-blog
$ cd node-blog
$ npm init
```
It will ask few questions on npm init, Accept the defaults and press Enter, it will create a package.json with something like this,
Note we have used server.js as our entry file for running our Server.

```
{
  "name": "node-blog",
  "version": "1.0.0",
  "description": "A Blog built using Nodejs",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hack4r/node-blog.git"
  },
  "keywords": [
    "node",
    "blog",
    "admin",
    "node-blog"
  ],
  "author": "xplor4r",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/hack4r/node-blog/issues"
  },
  "homepage": "https://github.com/hack4r/node-blog#readme"
}

```

Next, let's create index.html and 404.html to be served by our server.

index.html
```
<html>
    <head>
        <title> Node Blog</title>
    </head>
    <body>
        <h1> Blog </h1>

        <p> Welcome to my Blog</p>
    </body>
</html>
```

404.html

```
<html>
    <head>
        <title> 404 </title>
    </head>
    <body>
        <p> Sorry, the resource that you are looking, does not exist</p>
    </body>
</html>
```

Great, we have our Homepage and Error page setup. Now we need to tell node to check our request and return content accordingly.

### Creating the server

In our server.js file , add the following code:

```
const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {

    // check the type of request
    let filePath = '.' + req.url;
    if(filePath === './'){
        filePath = './index.html';
    }

    let extname = String(path.extname(filePath)).toLowerCase();

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
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

    // read the content
    fs.readFile(filePath, (err, content) => {
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
            // if no error occurs, return the content
            res.statusCode = 200;
            res.setHeader('Content-Type',contentType);
            res.end(content, 'utf-8');
        }
    });

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
```

Also, we want that our Node server restarts automatically on any changes. For this, let's install nodemon package globally.

```
$ npm install -g nodemon
```
and we need to use nodemon as our start script. In our package.json, change the start script accordingly :

```
  "scripts": {
    "start": "nodemon server.js"
  },
```

Now to run the server, all you need to do is run the following command :

```
$ npm run start
```
Thi will start our server :

```
$ npm run start

> node-blog@1.0.0 start C:\Users\Sujay\Downloads\projects\node-blog
> nodemon server.js

[nodemon] 2.0.6
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Server running at http://127.0.0.1:3000/
```
Now if you go http://127.0.0.1:3000/, it should show our index.html page. and in case of any error, it will throw the 404 error page.

Great ! That's it for this tutorial, upcoming articles we will focus on extending our APP.



