---
layout: post
title:  "Customize Hyper Terminal in Windows using Oh My Zsh and Powerline Fonts"
summary: "Learn how to customize hyper terminal in windows"
author: xplor4r
date: '2021-01-05 14:35:23 +0530'
category: windows
thumbnail: /assets/img/posts/code.jpg
keywords: windows, hyper terminal, windows terminal, customize terminal, oh my zsh,zsh
permalink: /blog/customize-hyper-terminal-windows/
usemathjax: false
---

If you are a developer who is used to linux style - bash terminal for all your development, and when switched to Windows ! feel like a nightmare, this post is for you. Because I will help you get the same experience as you get in you in Linux ! Well Good News is soon, they will be launching a new Windows Terminal, which got all the features inbuilt, which will replace your default Command Prompt :D

We get something like this in the end :


![hyper-11.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104667716/usm5bYKBB.webp)


So Let's get started in customizing up our environment ! So this are the steps we gonna follow :

##### [1. Switch to Windows Developer Mode](#switch-to-windows-developer-mode)
##### [2. Setup Windows Subsystem for Linux](#setup-windows-subsystem-for-linux)
##### [3. Install Ubuntu from App Store](#install-ubuntu-from-app-store)
##### [4. Install Hyper Terminal](#install-hyper-terminal)
##### [5. Install Zsh Terminal](#install-zsh-terminal)
##### [6. Install Oh My Zsh](#install-oh-my-zsh)
##### [7. Install Powerline Fonts](#install-powerline-fonts)
##### [8. Install ZSH Syntax Highlighting](#install-zsh-syntax-highlighting)
##### [9. Selecting the Theme](#selecting-the-theme)

### Switch To Windows Developer Mode

We need to switch to developer mode in windows to make some changes to the current shell.

1. Go to Settings > Update and Security > For developers ( From Sidenav).

2. Select the Developer Mode Option and Press Yes !


![hyper-1.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104763583/V-JXlLyYC.webp)

3. After the necessary components, you'll need to restart your computer.

4. Once your Computer Reboots, open Control Panel.

#### Setup Windows Subsystem For Linux

5. Click on Programs


![hyper2.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104793907/1uRS6RMJw.webp)

6. Click on Turn Windows Features on or off


![hyper-3.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104836341/0ggS08UqP.webp)

7. Check the Windows Subsystem for Linux option and Press Ok.


![hyper-4.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104972300/ClnBkcB-8.webp)

8. Once the components are installed on your computer, click the Restart Now button to complete the task.

After your computer restarts, you will notice that Bash will not appear in the "Recently Added" list of apps, this is because Bash isn't actually installed yet. Let's do it now.

#### Install Ubuntu From App Store

9. Go to Windows App Store and Search for Ubuntu 18.04 LTS


![hyper-5.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104963818/MAS2fLqNg.webp)


10. Open start, do a search for Ubuntu and press Enter.

11. Create a new Unix User and Password, This account doesn't have to be the same as your Windows Account. Enter the username in the required field and press Enter( you can't use the username "admin")


![hyper-6.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603104990007/qocIXE8yz.webp)

12. Done. Now you can use the bash commands in the Ubuntu Bash Shell.

(Tip: In ubuntu bash you can directly move to your Windows Folders using :  `cd \mnt\c`)

#### Install Hyper Terminal

To use all the customizations, we require a terminal that supports them. So let's install Hyper Terminal, which is built upon Javascript.


![hyper-7.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105003031/xmfBLkezy.webp)

Setup Hyper terminal to use ZSH

After you installed Hyper Terminal open %USERPROFILE%/.hyper.js config file and replace line:

```sh
shell: '',
```

with

```sh
shell: 'C:\\Windows\\System32\\bash.exe',
```

Now each time when you will open hyper terminal it’s will be use zsh as default shell environment.

#### Install ZSH Shell

```sh
sudo apt-get install zsh
```
and open bashrc using nano editor

```sh
nano ~/.bashrc`
```

add

```sh
if [ -t 1 ]; then
exec zsh
fi
```

![hyper-8.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105019944/BZokFifIS.webp)

#### Install Oh My Zsh

[Repo](https://github.com/robbyrussell/oh-my-zsh)

```bash
curl -L https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh | bash
```


![hyper-12.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105032661/9Tp3I3CGU.webp)

#### Install Powerline Fonts

[Repo](https://github.com/powerline/fonts)

 - Download fonts-master

 - We require to change some permissions first. Open the folder using Powershell ins Administrator Mode and type:

```sh
SetExecutionPolicy Bypass
```

- Press y

Once done Install the fonts using

```sh
sudo apt-get install fonts-powerline
.\install.ps1
```


![hyper-9.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105047680/3OaXQdxZl.webp)

## Install ZSH Syntax Highlighting

Clone the ohmyzsh synta highlighting plugin using this:

```sh
git clone https://github.com/zsh-https://github.com/robbyrussell/oh-my-zsh/wiki/Themesusers/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
Then edit zshrc file using nano editor :

```sh
nano ~/.zshrc
```

add plugin(git zsh-syntax-highlighting) then after saving do :

```sh
source ~/.zshrc
```

### Selecting The Theme

You can use any theme you want. We will be using the very famous Spaceship Theme : For more themes please visit: [Oh My Zsh Themes](https://github.com/robbyrussell/oh-my-zsh/wiki/Themes)

To Select the Theme for the terminal to use:

Open your terminal and type :

```sh
nano ~/.zshrc
```

and search for the line for the theme and replace it with the theme you want to use:


![hyper-14.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105061944/jwIJpJerW.webp)


## Install Spaceship Theme

```sh
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"
```


![hyper-13.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105073211/C76mTZQqD.webp)

Now Symlink spaceship-prompt

```sh
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

Done, Restart the terminal and enjoy hacking with your brand new Terminal :D


![hyper-10.webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105085457/vVmGFkpsw.webp)


![hyper-11 (1).webp](https://cdn.hashnode.com/res/hashnode/image/upload/v1603105096973/C-DSPOsPK.webp)

###### Thanks for reading, hope you like the tutorial. Do forget to subscribe to my blog for more cool tricks upcoming ! :D

Have a great day :)