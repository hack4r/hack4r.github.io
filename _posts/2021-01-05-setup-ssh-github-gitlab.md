---
layout: post
title:  "Setting up SSH Keys using Github and Gitlab"
summary: "Learn how to build a Blog App using Nodejs"
author: xplor4r
date: '2021-01-05 14:35:23 +0530'
category: ["git"]
thumbnail: /assets/img/posts/code.jpg
keywords: using ssh, github ssh, gitlab ssh
permalink: /blog/setup-ssh-github-gitlab/
usemathjax: false
---

Using the SSH protocol, you can connect and authenticate to remote servers and services. With SSH keys, you can connect to GitHub without supplying your username or password at each visit.

# Setting up SSH keys

# For Github

Open Terminal

### Generating a SSH Key

Paste the text below, substituting in your GitHub email address.

```bash
$ ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

This will create a public ssh key

When you're prompted to "Enter a file in which to save the key,".

`Enter a file in which to save the key (/home/you/.ssh/id_rsa): `

Enter the filename as yourusername-github (example: sujaykundu777-github)

`At the prompt, type a secure passphrase. For more information, see "Working with SSH key passphrases".`

Just press `Enter` twice"

### Adding your SSH key to the ssh-agent

Start the ssh-agent in the background.

```sh
$ eval "$(ssh-agent -s)"
```

Add your SSH private key to the ssh-agent. If you created your key with a different name, in our case yourusername-github

```sh
$ ssh-add ~/.ssh/yourusername-github
```

The files - the private key and the public key should be inside the /home/yourusernme/.ssh folder.

### Adding the ssh key to your Github Account

Copy the ssh key to your clipboard

```sh
$ sudo apt-get install xclip
```

 Downloads and installs xclip. If you don't have `apt-get`, you might need to use another installer (like `yum`)

```sh
$ xclip -sel clip < ~/.ssh/yourusername-github.pub
```

Copies the contents of the yourusername-github.pub file to your clipboard

Now paste this ssh key in Github settings page under settings > SSH and CPG Keys > Add SSH Key > Save SSH Key.Use a suitable title for the key.If prompted, confirm your GitHub password.

After saving the ssh key, just set the remote url using the ssh url provided for the repo:

```sh
$ git remote set-url origin git@yourname-github:yourname/yourrepo.git
```

That's it, Now you don't have to enter password everytime for a push


# For Gitlab

```sh
$ KEY=yourname-gitlab && ssh-keygen -t rsa -b 4096 -f ~/.ssh/$KEY -C "$KEY"
```

This will create a public ssh key,Now open config file:

```sh
$ nano ~/.ssh/config
```

and save the host details :

```sh
 Host yourname-gitlab
 HostName gitlab.com
 IdentityFile ~/.ssh/yourname-gitlab
```

Now copy the ssh signed rsa public key by:

```sh
$ cat ~/.ssh/yourname-gitlab.pub
```

Now paste this ssh key in Gitlab settings page

After saving the ssh key, just set the remote url using the ssh url provided for the repo:

```sh
$ git remote set-url origin git@yourname-gitlab:yourname/yourrepo.git
```

That's it, Now you don't have to enter password everytime for a push

`ggpush and ggpull`  works too !!
