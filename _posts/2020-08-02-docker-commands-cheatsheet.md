---
layout: post
title:  "The Docker Commands Cheatsheet"
summary: "Learn to use Docker Commands"
author: xplor4r
date: '2020-08-02 14:35:23 +0530'
category: docker
thumbnail: /assets/img/posts/code.jpg
keywords: jekyll blog,github pages,deploy using github actions
permalink: /blog/docker-cheatsheet/
usemathjax: false
---

To pull a docker image from the docker hub, we can use the command:

```bash
$ docker pull <image-name:tag>
```

To run that image, we can use the command :

```bash
$ docker run <image-name:tag> or $ docker run <image-id>
```

To list down all the images in our system, we can give the command :

```bash
$ docker images
```

To list down all the running containers, we can use the command :

```bash
$ docker ps
```

To list down all the containers ( even if they are not running ) :

```bash
$ docker ps -a
```

Creating a Dockerfile

Docker file - It contains instructions for building a docker image. Instructions contain various keywords.

FROM -> This keyword indicates the base image from which the container is built. RUN -> This keyword indicates the command that needs to be executed on the image.

Command to build an image:

```bash
$ docker build -t [image-name]:tag
```

eg. $ docker build -t gamershub:1.0

Command to Run the newly built image :

```bash
$ docker run --name "container-name" -p <host port>:<container port><image_name:tag>
```

eg.
```bash
$ docker run --name "ubuntutomcat7" -p 8080:8080 gamershub:1.0
```

Start / Stop Containers

- We can start / stop containers by just running a command from the terminal
- We need to specify the container id as parameter

To list down all the containers and their ID's, use :

```bash
$ docker ps -a
```

To start the container, use the command :

```bash
$ docker start <container id>
```

To restart the container, use the command :

```bash
$ docker restart <container id/name>
```

To pause or unpause the container, use the command :

```bash
$ docker pause <container name/id>
$ docker unpause <container name/id>
```

To stop the container, use the command :

```bash
$ docker stop <container id>
```

To remove the container, use the below command after stopping the container

```bash
$ docker rm <container name>
```

To delete an image, we can use :

```bash
$ docker rmi <image id>
$ docker rmi <repo:tag>
```

To show all containers

```bash
$ docker ps -aq
```

To stop all containers

```bash
$ docker stop $(docker ps -aq)
```

To remove all containers

```shell
$ docker rm $(docker ps -aq)
```

To remove all images

```bash
$ docker rmi $(docker images -q)
```

To build image using dockerfile

```shell
$ docker build --no-cache -t ubuntu-py3 .
```

To run image

```bash
$ docker run -i -t ubuntu-py3 /bin/bash
```

## Saving State


Normally we dont want to save the state : we do something like this, suppose we want to run a ubuntu container, we will install all the dependencies, we do something like this. For example i will install heroku in this ubuntu :

```bash
$ docker run -i -t ubuntu /bin/bash
```

After bash is open:

```bash
$ apt-get update
$ apt-get install curl
```

To install heroku cli

```bash
$ curl https://cli-assets.heroku.com/install.sh | sh
heroku -v
```

Heroku will be installed !

But once you close/exit the container. All your changes will be lost.
What if we want to save state ? We dont want to reinstall this everytime. What if i want to reuse whatever i did earlier.. and make things easier !

### How to save state ?

Cool to demonstrate, lets create a new container named "boring_shaw_ubuntu" from ubuntu image

```bash
$ docker container run -i -t --name boring_shaw_ubuntu ubuntu /bin/bash
```

![Create a new docker container](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592653263/sujaykundu.com/new2.webp)

Do all the changes in this container:

I installed heroku cli. like the previous steps in this container too.

![Install Heroku in docker container](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592653260/sujaykundu.com/new3.webp)

Lets now save the state , Open a new terminal and type :

```bash
$ docker container commit boring_shaw_ubuntu ubuntu-heroku
```

![Save state of docker container](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592653259/sujaykundu.com/new4.webp)

This will create a new image with the changes with name ubuntu-heroku:
You can see in the image below,

Lets now test our new image that we created

![Checking the state in docker container](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592653261/sujaykundu.com/new5.webp)

If you run this image this will have heroku already installed.

### Saving the container as Image

What if we want to make this image portable. We can save it as compressed file :

```bash
$ docker image save -o ubuntu-heroku.tar ubuntu-heroku
```

So this will create a ubuntu-heroku.tar , which is portable

```bash
$ docker image load -i ubuntu-heroku.tar
```

and then you can run the container using :

```bash
$ docker run -i -t ubuntu-heroku /bin/bash
```

![Running saved state in docker container](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,q_auto:best,w_auto/q_auto:best/v1592653260/sujaykundu.com/new6.webp)

Some Great Tutorials on Docker :

[Intro to Docker Containers](https://docs.microsoft.com/en-us/learn/modules/intro-to-docker-containers/1-introduction/)

