---
layout: post
title:  "The Linux Commands Cheatsheat"
summary: "Learn how to use Linux Commands like a pro"
author: xplor4r
date: '2021-01-05 14:35:23 +0530'
category: ["linux"]
thumbnail: /assets/img/posts/code.jpg
keywords: linux,commands
permalink: /blog/linux-commands-cheatsheet/
usemathjax: false
---

### Move Files

```
mv old-file-name new-file-name
mv [options] old-file-name new-file-name
mv file1 file2
```

### Renaming Files

We can use mv command to rename a file:

```
mv /var/www/myfilae.pdf /var/www/myfile.pdf
```

Get a verbose output :

```
mv -v file1 file2
```

`file1' -> `file2'

### Copy Files

copy file.pdf and paste inside folder "myfolder"

```
cp -a /var/www/file.pdf /var/www/myfolder/file.pdf
```

copy all the files of folder2 in folder3

```
cp -a /var/www/folder2/. /var/www/folder3/
```

### Compress - Create Zip Files to Specific Directory

We need to install zip package :

```
$ sudo apt install zip
$ zip -r tecmint_files.zip tecmint_files
```

To unzip

```
$ unzip tecmint_files.zip
```

To unzip in a particular directory

```
$ mkdir -p /tmp/unziped
$ unzip tecmint_files.zip -d /tmp/unziped
$ ls -l /tmp/unziped/
```

