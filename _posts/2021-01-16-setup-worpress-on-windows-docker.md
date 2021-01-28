---
layout: post
title:  "Setup wordpress for local development using Windows and Docker"
summary: "Learn how to build a Blog App using Nodejs"
author: xplor4r
date: '2021-01-16 14:35:23 +0530'
category: ["windows","wordpress","docker","php","mysql","mariadb"]
thumbnail: /assets/img/posts/setup-wordpress-with-docker-mariadb-phpmysql-windows-10.png
keywords: windows, express, wordpress development, wordpress using docker
permalink: /blog/setup-worpress-on-windows-docker/
usemathjax: false
---

## Setup wordpress for local development using Docker

In this tutorial, I am going to show you how to setup wordpress local development environment using Windows and Docker.

## Requirements:

- Windows 10
- Docker Desktop
- Mariadb Docker Image
- Phpmyadmin Docker Image
- Wordpress Image


Download Mariadb Docker Image :

```s
$ docker pull mariadb:latest
```

Start a mariadb server instance

Starting a MariaDB instance is simple:

```s
$ docker run --name mariadb-container -e MYSQL_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=wordpress -v /my/own/datadir:/var/lib/mysql  -p 3306:3306 -d mariadb:tag
```

Here,

**--name** is mariadb-container // name of the container we want to give
**-e** // environment variables
**-v** // location of host to store data
**-p** // port
**-d** – Tells Docker to run the container in daemon.
**mariadb:latest** – Finally defines what to install and which version.

Environment variables :

1. MYSQL_ROOT_PASSWORD

This environment variable is mandatory and specifies the password that will be set for the MariaDB root superuser account. In the above example, it was set to my-secret-pw.

2. MYSQL_DATABASE

This variable is optional and allows you to specify the name of a database to be created on image startup. If a user/password was supplied (see below) then that user will be granted superuser access (corresponding to GRANT ALL) to this database.

3. MYSQL_USER, MYSQL_PASSWORD

These variables are optional, used in conjunction to create a new user and to set that user's password. This user will be granted superuser permissions (see above) for the database specified by the MYSQL_DATABASE variable. Both variables are required for a user to be created.

Do note that there is no need to use this mechanism to create the root superuser, that user gets created by default with the password specified by the MYSQL_ROOT_PASSWORD variable.

```
-v /my/own/datadir:/var/lib/mysql
```

Create a data directory on the host system (outside the container) and mount this to a directory visible from inside the container. This places the database files in a known location on the host system, and makes it easy for tools and applications on the host system to access the files. The downside is that the user needs to make sure that the directory exists, and that e.g. directory permissions and other security mechanisms on the host system are set up correctly.

In this case, we are saying that use the **/my/own/datadir** to save the database files.

```
-p 3306:3306
```

the parameter “-p (localPort: containerPort)” is important in this process. You can choose a specific local port but not the container port, because most software such as MySQL, MariaDB set default ports (3306) in environment settings. If you set the container other than the default port (3306), you can’t use MySQL. (You need to change the config in my.cnf file in a Docker container if you want to use another port.)


For our requirements let's run the following command to run mariadb:

```s
$ docker run -e MYSQL_ROOT_PASSWORD=<your_password> -e MYSQL_DATABASE=wordpress --name wordpressdb  -d mariadb:latest
```
Now if we check the running containers:

```s
$ docker ps
CONTAINER ID   IMAGE                 COMMAND                  CREATED          STATUS         PORTS                    NAMES
c4f1801fab01   mariadb:latest        "docker-entrypoint.s…"   10 seconds ago   Up 8 seconds   3306/tcp                 wordpressdb
```
Our container for mariadb is running successfully at port **3306**.

## Installing Phpmyadmin

We can use phpmyadmin as our database management tool :

```s
docker run --name [container_name]-d --link [mariadb_container_name]:db -p 8080:80 phpmyadmin/phpmyadmin
```

In our case, to link **mariadb** we will use wordpressdb container that is running already.

```s
$ docker run --name phpMyAdmin -d --link wordpressdb:db -p 8080:80 phpmyadmin/phpmyadmin
```

This should start our phpmyadmin container at port 8080. Visit http://localhost:8080 to view admin panel.

You need to use this credentials to login to phpmyadmin:

```
username : root
password: my-secret-pw
```

Now, you can use phpMyAdmin that is connected with MariaDB.

### Installing Wordpress

```s
$ docker pull wordpress
```

Now we need to connect wordpress container withour mariadb (database) container

```s
$ docker run -e WORDPRESS_DB_PASSWORD=your_password --name wordpress --link wordpressdb:mysql -p 80:80  -v "$PWD/html":/var/www/html -d wordpress
```

You can also store data by passing

```
-v "$PWD/html":/var/www/html
```

Now, it should start our wordpress container that is using mariadb as database,  we can run our wordpress site `http://localhost:80`

At First, the setup will start for configuring wordpress.

### Fixing Errors

If you get an error linking your server’s public IP address to the WordPress container’s internal address, remove the failed container using the following command:

```s
docker rm wordpress
```

Restart Docker and the database container, also make sure no other service is already bound to the port 80.

```s
docker start wordpressdb
```

Then try creating the WordPress container again. It should work fine if everything goes well !


