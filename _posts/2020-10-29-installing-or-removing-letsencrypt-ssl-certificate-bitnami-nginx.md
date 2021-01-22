---
layout: post
title:  "Installing or Removing Letsencrypt SSL Certificate in AWS hosted Bitnami Nginx"
summary: "Learn how to install or remove letsencrypt ssl certificate using AWS Bitnami Nginx"
author: xplor4r
date: '2020-10-29 14:35:23 +0530'
category: ["aws","nginx"]
thumbnail: /assets/img/posts/code.jpg
keywords: jekyll blog,github pages,deploy using travis ci
permalink: /blog/installing-or-removing-letsencrypt-ssl-certificate-bitnami-nginx/
usemathjax: false
---

In this article, we will look in to how to create ssl certificate using Letsencrypt in Bitnami Nginx containers hosted at AWS

## Let's Encrypt certificate generation

WordPress with NGINX and SSL comes with a ready-to-use script that takes care of generating the Let's Encrypt certificates to secure your application. It will also modify the configuration of the Web server so you do not need to worry about editing the files or restarting it.

```bash
$ sudo /opt/bitnami/letsencrypt/scripts/generate-certificate.sh -m YOURMAIL -d YOURDOMAIN
```

> **NOTE**: Remember that both YOURMAIL and YOURDOMAIN are placeholders. Replace them with your current email and with the new domain name you want to set.

> **NOTE**: You can use multiple domains specifying the *\-d* option as many times as domains you want to specify. When supplying multiple domains, Lego creates a SAN (Subject Alternate Names) certificate which results in only one certificate valid for all domains you entered. The first domain in your list will be added as the "CommonName" of the certificate and the rest, will be added as "DNSNames" to the SAN extension within the certificate.

You can follow this section of the [Bitnami documentation](https://docs.bitnami.com/general/apps/wordpress-pro/administration/generate-configure-certificate-letsencrypt/) to get more information about how to use this certificate.

So it created the certificate. But for some reasons, there was a mismatch for I created a new certificate using the same command for www.YOURDOMAIN.com

so this led to the problem of certificate mismatch problem between YOURDOMAIN and WWW.YOURDOMAIN.COM.  For this issue i checked the DNS for what caused the problems,but Route 53 config seemed fine :

### Create Hosted Zones

```
1.Record name - YOURDOMAIN.com
Type - A
Alias yes
value/Route traffice to www.YOURDOMAIN.com.

2.Record name - YOURDOMAIN.com
Type - NS
Alias No
Value/Route traffic to :

ns-285.awsdns-35.com.
ns-1883.awsdns-43.co.uk.
ns-1323.awsdns-37.org.
ns-828.awsdns-39.net.

TTL seconds -300

3. Record name - www.YOURDOMAIN.com
Type - A
Alias No
Value/Route traffic to
52.91.160.175
TTL seconds -300
```

So, this seemed fine !

So the next step, I thought I should remove the current certificate and reinstall it again, as maybe i forgot or might have missed something while generating the certificate.

I delete the generated certificates by :

```bash
$ rm -rf /opt/bitnami/letsencrypt`
```

also

I did inside /opt/bitnami/nginx/conf

```bash
$ sudo rm -rf yourdomain.com.key yourdomain.com.crt www.yourdomain.com.key www.yourdomain.com.crt
```

This was a huge mistake !

I forgot to take a backup of the letsencrypt folder, it had the generate-certificate script too ! which got deleted - unfortunately. And when I tried to restart the services, it was throwing errors.

The default SSL certificate provided by bitnami was also deleted, so i tried creating them again using OpenSSL https://docs.bitnami.com/aws/apps/wordpress-pro/administration/create-ssl-certificate-nginx/

But that dint work , halfthe way server crashed. (Nginx died!)

### Reinstalling the certificates

> 1. Installing lego and the generation of new certificates also renewing the certificate.

```bash
$ cd /tmp
$ curl -Ls https://api.github.com/repos/xenolf/lego/releases/latest | grep browser_download_url | grep linux_amd64 | cut -d '"' -f 4 | wget -i -
$ tar xf lego_vX.Y.Z_linux_amd64.tar.gz
$ sudo mkdir -p /opt/bitnami/letsencrypt
$ sudo mv lego /opt/bitnami/letsencrypt/lego
```

> 2. Generate A Let’s Encrypt Certificate For Your Domain

Remember don't put  --domains="WWW.DOMAIN.COM" again , it should automatically be handled in the second command below:

```bash
$ sudo /opt/bitnami/ctlscript.sh stop
$ sudo /opt/bitnami/letsencrypt/lego --tls --email="EMAIL-ADDRESS" --domains="DOMAIN" --path="/opt/bitnami/letsencrypt" run
```

> **NOTE**: You can use more than one domain (for example, DOMAIN and www.DOMAIN) by specifying the --domains option as many times as the number of domains you want to specify. When supplying multiple domains, Lego creates a SAN (Subject Alternate Names) certificate which results in only one certificate valid for all domains you entered. The first domain in your list will be added as the “CommonName” of the certificate and the rest, will be added as “DNSNames” to the SAN extension within the certificate.

> 3: Configure The Web Server To Use The Let’s Encrypt Certificate

```bash
$ sudo ln -s /opt/bitnami/letsencrypt/certificates/DOMAIN.crt /opt/bitnami/nginx/conf/server.crt
$ sudo ln -s /opt/bitnami/letsencrypt/certificates/DOMAIN.key /opt/bitnami/nginx/conf/server.key
$ sudo chown root:root /opt/bitnami/nginx/conf/server*
$ sudo chmod 600 /opt/bitnami/nginx/conf/server*
```

**Restart**

```bash
$ sudo /opt/bitnami/ctlscript.sh start
```

> **Note** : To add one or more domains to an existing certificate, simply repeat Steps 2 and 3 again, ensuring the same order of domain names is maintained in the lego command and adding the new domain name(s) to the end with additional –domains arguments.



![ssl-cert](testing.png "ssl-configuration-letsencrypt-nginx-bitnami-aws")

> 4. Test Configuration

Visit the site using https ! Should work now

> 5. Renew The Let’s Encrypt Certificate

Let’s Encrypt certificates are only valid for 90 days. To renew the certificate before it expires, run the following commands from the server console as the bitnami user. Remember to replace the DOMAIN placeholder with your actual domain name, and the EMAIL-ADDRESS placeholder with your email address.

```bash
$ sudo /opt/bitnami/ctlscript.sh stop
$ sudo /opt/bitnami/letsencrypt/lego --tls --email="EMAIL-ADDRESS" --domains="DOMAIN" --path="/opt/bitnami/letsencrypt" renew --days 90
$ sudo /opt/bitnami/ctlscript.sh start
```

To automatically renew your certificates before they expire, write a script to perform the above tasks and schedule a cron job to run the script periodically. To do this:

 > Create a script at **/opt/bitnami/letsencrypt/scripts/renew-certificate.sh**

```bash
$ sudo nano /opt/bitnami/letsencrypt/scripts/renew-certificate.sh
```

Enter the following content into the script and save it. Remember to replace the DOMAIN placeholder with your actual domain name, and the EMAIL-ADDRESS placeholder with your email address.

**For NGINX**:

```bash
#!/bin/bash

$ sudo /opt/bitnami/ctlscript.sh stop nginx
$ sudo /opt/bitnami/letsencrypt/lego --tls --email="EMAIL-ADDRESS" --domains="DOMAIN" --path="/opt/bitnami/letsencrypt" renew --days 90
$ sudo /opt/bitnami/ctlscript.sh start nginx
```

Make the script executable:

```bash
$ sudo chmod +x /opt/bitnami/letsencrypt/scripts/renew-certificate.sh
```

Execute the following command to open the crontab editor:

```bash
$ sudo crontab -e
```

Add the following lines to the crontab file and save it:

`0 0 1 * * /opt/bitnami/letsencrypt/scripts/renew-certificate.sh 2> /dev/null`

NOTE: If renewing multiple domains, remember to update the /opt/bitnami/letsencrypt/renew-certificate.sh script to include the additional domain name(s) in the lego command.

If Something fails :
```bash
$ rm -rf /opt/bitnami/letsencrypt
```
and do the process of creating symlinks :

```bash
$ sudo /opt/bitnami/ctlscript.sh restart
```

If you created a cron job for certificate renewal, remove it by opening the crontab editor using the command below and removing the line added for the certificate renewal script:

```bash
$ sudo crontab -e
```

Remove the cron jobs in the root and bitnami user’s cron table. Run the following commands and remove any lines/commands related to certificate renewal:

```bash
$ sudo crontab -e
$ sudo crontab -e -u bitnami
```

Modify the Web server configuration file to use the original (dummy) server.crt and server.key certificates.

I had to change this for bitnami.conf:

```
//opt/bitnami/nginx/conf/bitnami$ cat bitnami.conf

    # HTTP server

    server {
        listen       80;
        server_name  localhost;

        #include "/opt/bitnami/nginx/conf/bitnami/phpfastcgi.conf";

        include "/opt/bitnami/nginx/conf/bitnami/bitnami-apps-prefix.conf";
    }

    # HTTPS server

    server {
       listen       443 ssl;
       server_name  localhost;

        ssl_certificate  sujeetkiranastore.com.crt;
        ssl_certificate_key     sujeetkiranastore.com.key;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       #include "/opt/bitnami/nginx/conf/bitnami/phpfastcgi.conf";

       include "/opt/bitnami/nginx/conf/bitnami/bitnami-apps-prefix.conf";
    }


    include "/opt/bitnami/nginx/conf/bitnami/bitnami-apps-vhosts.conf";
```

Restart the server:

```bash
sudo /opt/bitnami/ctlscript.sh restart
```

So then to redirect http to https. I have to give access to really simple ssl (plugin) to wp-config

### Changing wordpress permissions:

I highly recommend you to do a server backup before running any command on your server so you can restore it to a known state in case you find any issue. You can have more information about how to backup your server using our guide at https://docs.bitnami.com/aws/faq/administration/backup-restore-server/115

Regarding the plugin installation, you have to temporary set write permissions to both the wp-config file and the wp-config in order to install it, but we recommend you to set back the current permissions for security purposes. Follow the next steps to that.

### Give write permissions

```bash
$ sudo chmod 660 /opt/bitnami/apps/wordpress/htdocs/wp-config.php
$ sudo chmod 777 /opt/bitnami/apps/wordpress/htdocs/wp-content
```

Install the plugin , then restore original permissions

Copy this:

```bash
$ sudo chmod 640 /opt/bitnami/apps/wordpress/htdocs/wp-config.php
$ sudo chmod 775 /opt/bitnami/apps/wordpress/htdocs/wp-content
```
`
Start all Bitnami services:

```bash
$ sudo /opt/bitnami/ctlscript.sh start
```

Some useful commands :

#### Stop Bitnami services

```bash
$ sudo /opt/bitnami/ctlscript.sh stop
```

#### Backup dummy SSL certificates
```bash
sudo mv /opt/bitnami/nginx/conf/server.crt{,.bck}
sudo mv /opt/bitnami/nginx/conf/server.key{,.bck}
sudo mv /opt/bitnami/nginx/conf/server.csr{,.bck}
```
#### Start Bitnami services

```bash
$ sudo /opt/bitnami/ctlscript.sh start
```

#### Restart Bitnami services

```bash
$ sudo /opt/bitnami/ctlscript.sh restart
```