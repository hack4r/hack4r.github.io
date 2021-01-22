---
layout: post
title:  "Deploy your jekyll blog using Github Pages and Github Actions"
summary: "Learn how to deploy jekyll blog using Github Pages and Actions"
author: xplor4r
date: '2019-05-24 14:35:23 +0530'
category: ["jekyll","ruby","git"]
thumbnail: /assets/img/posts/code.jpg
keywords: jekyll blog,github pages,deploy using github actions
permalink: /blog/deploy-jekyll-blog-using-github-pages-and-github-actions/
usemathjax: false
---


I have finally built up a way to build up my jekyll blog using latest Jekyll 4.0 and Bundler. Thanks to **Github Actions** you can actually use it build up your site using your own configuration. You can checkout the complete step by step instructions on setting up the theme here  - [https://devlopr.netlify.app/get-started/](https://devlopr.netlify.app/get-started/)

### The Idea ?

Recently, I thought to migrate my  **Github Pages** hosted blog from the Jekyll 3.6 to latest available 4.0, but the fact that github pages-gem was not supporting it, was killing me. The bundler that was used was 1.7.x, i wanted to replace it with 2.x.x . And obviously, i wanted 3rd party plugins to work perfectly like jekyll-algolia , which are not actually listed in github pages dependency versions : [https://pages.github.com/versions/](https://pages.github.com/versions/ "https://pages.github.com/versions/")

So I wanted to use a CI/CD process like Travis CI or Circle CI to build up my site and push to my gh-pages branch, which is used to serve the site.

But what If, Github Actions can do the same for you ???

### What is Github Actions ?

Github Actions is a way to perform tasks automatically for you. To give you an example, I will use my blog workflow.
It all starts when I want to write a new post. I just create a new markdown file, write down whatever is on my head and save it. After this whole process, I need a way to transform my text in a website. Jekyll is doing the heavy-lifting for me, so I just go to my terminal and type:

```bash
    # the command will generate my entire website and all its dependencies
    jekyll build
```

After generating all the necessary files, I need to upload it somewhere. In this case, I just have to commit my changes to a specific branch called **gh-pages** and Github will serve my site on the web. For doing that, I usually perform the following commands in a bash script:

```bash
    # This is the folder Jekyll generates with my website. Lets just open it
    cd _site
    # Now we need a new git repository here,
    # so I can commit only the generated files and skip the source files
    git init
    git config user.name "Sujay Kundu"
    git config user.email "sujaykundu777@gmail.com"
    git add .
    # That will create a nice commit message with something like:
    git commit -m "New Build - $(date)"
    # Now lets push my commit to the gh-pages branch and replace everything there
    REPO=https://sujaykundu777@github.com/sujaykundu777.github.io.git
    git push --force $REPO master:gh-pages
    # Lets do some cleanup here since we don't need the generated files anymore
    rm -fr .git
    cd ..
    rm -rf _site
```

That is pretty simple right? It is indeed, but how cool would that be if Github could do that for me instead? That is where Github Actions come to give us a hand.

It all starts with a folder on your repository called **.github/workflows**.
inside of this folder, create a file called **deploy-workflow.yml** with the content below. Each line will be explained with a comment:

{% gist 2b321403222186b061dfa27d9f41e378 %}

Now lets create our custom action. [Github Actions are divided in 2 types](https://help.github.com/en/articles/about-actions#types-of-github-actions):

* **Docker container**
* **Javascript**

We are running our action using a Docker Container. Using Docker, we make sure the environment where our scripts are running will be the same, no matter what happens to the Github environment. So, lets dig deeper and create our **actions** folder under **.github/actions/build-dist-site**.

```bash
    # build-dist-site will be the folder for holding
    # our action configuration (Dockerfile, scripts and Metadata)
    mkdir -p .github/actions/build-dist-site
```

Under **.github/actions/build-dist-site** lets create 3 files:

* **`action.yml`: It will hold the metadata of our action**
* **`Dockerfile:` Will specify our Docker image to run Jekyll in a container**
* **`entrypoint.sh:` Will have our custom scripts to generate and deploy our website update**

{% gist ef32c780cb419b97e46a628b4b1a784f %}

Now that we have our Dockerfile ready, we need to tell Github to use it. That is why we need the **action.yml** file.

The **action.yml** file tells Github what to do. In this case, just tell it to use Docker and use our **Dockerfile** to build the container with it.

Now we just need our **entrypoint.sh** script to execute our website generation and deployment. Lets get our hands dirty with a bit of bash script:

🤯 That was a lot different from what I started with right? Ok, the reason for that is just Docker. Now we have a more robust implementation of our deployment pipeline where we could even move away from Github to Gitlab and reuse the Dockerfile and entrypoint.sh (with minor changes).

Now that we are armed with those files, lets commit our changes and push to Github and see what happens. Going to our Github repository page, there you can see a new button called **Actions**:

![](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,w_600/v1592673314/sujaykundu.com/github-actions-1.png){:class="img-fluid"}

![](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,w_600/v1592673317/sujaykundu.com/github-actions-2.png){:class="img-fluid"}

![](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,w_600/v1592673318/sujaykundu.com/github-actions-3.png){:class="img-fluid"}

![](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,w_600/v1592673321/sujaykundu.com/github-actions-4.png){:class="img-fluid"}

![](https://res.cloudinary.com/sujaykundu/image/upload/c_scale,fl_progressive.progressive:semi.progressive:steep,w_600/v1592673321/sujaykundu.com/github-actions-6.png){:class="img-fluid"}



Ok, now our automation work was fully done. As a cherry on top, you can also add a badge to your README.md file showing the current status of your custom actions like that:

    # Where /deploy/ must be replaced with your workflow name
    ![workflow-badge](https://github.com/sujaykundu777/sujaykundu777.github.io/workflows/deploy/badge.svg)

That will render a nice image by Github on your repository page with the current action status.

Isn't that Awesome ! Congrats You got a full automated deployment -

Now with Github Actions 🎉

All commits to **master** will trigger the **deploy** workflow and will generate the static files and deploy automatically to the **gh-pages** branch.

There's a nice tutorial for - if you want to setup node project using github-actions :
[https://dev.to/pierresaid/deploy-node-projects-to-github-pages-with-github-actions-4jco](https://dev.to/pierresaid/deploy-node-projects-to-github-pages-with-github-actions-4jco)