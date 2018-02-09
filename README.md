# WakeOnLan-Webpage
A webpage that should be displayed if a server (behind a reverse proxy) is powered off to start it remotly. It is also possible to start multiple instances of servers.


## Installation nginx

- update list of available packages `apt update`
- install required package `apt install wakeonlan git`
- install webserver nginx and php7.1 `apt install nginx php7.1-fpm`
- Configure WakeOnLan-Webpage [to run as normal webpage](#configure-wakeonlan-webpage-to-run-as-normal-webpage) **OR** [to run only if reverse proxy is down](#configure-wakeonlan-webpage-to-run-only-if-reverse-proxy-is-down)
- [Add Config](#add-config)
- Visit IP of the configured server using a browser

> The webpage should be accessable using a encrypted connection only, because username and password is transfered base64 encoded and **not encrypted**! The easiest way would be advicing your webserver (e.g. nginx) to provide a https (ssl) connection only.

### Configure WakeOnLan-Webpage to run as normal webpage
- open nginx default website configuration `nano /etc/nginx/sites-enabled/default`
- go to php configuration part of this file 
```
        # pass PHP scripts to FastCGI server
        #
        #location ~ \.php$ {
        #       include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
        #       fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        #}
```
- unccomment the 4 lines:
```
        # pass PHP scripts to FastCGI server
        #
        location ~ \.php$ {
               include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
               fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        }
```
- save and exit configuration file using `F3` and `F2`
- reload nginx `service nginx reload`
- delete nginx demo files `rm /var/www/html/*`
- download WakeOnLan-Webpage `git clone https://github.com/Felix-Franz/WakeOnLan-Webpage.git /var/www/html/`
- open WakeOnLan-Webpage directory `cd /var/www/html/`

### Configure WakeOnLan-Webpage to run only if reverse proxy is down
- create new directory `mkdir /var/www/html/wol`
- open nginx default website configuration `nano /etc/nginx/sites-enabled/default`
- go to php configuration part of this file 
```
        # pass PHP scripts to FastCGI server
        #
        #location ~ \.php$ {
        #       include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
        #       fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        #}
```
- unccomment the 4 lines:
```
        # pass PHP scripts to FastCGI server
        #
        location ~ \.php$ {
               include snippets/fastcgi-php.conf;
        #
        #       # With php-fpm (or other unix sockets):
               fastcgi_pass unix:/var/run/php/php7.1-fpm.sock;
        #       # With php-cgi (or other tcp sockets):
        #       fastcgi_pass 127.0.0.1:9000;
        }
```
- insert reverse proxy (`between server_name _;` and `location / {`) 
> currently not working :(
```
        server_name _;

        location /proxy{
                proxy_set_header X-Real-IP  $remote_addr;
                proxy_set_header X-Forwarded-For $remote_addr;
                proxy_set_header Host $host;

                proxy_pass http://enter_your_address/;
                error_page 502 =200 /wol;
                break;
        }

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
```
- save and exit configuration file using `F3` and `F2`
- reload nginx `service nginx reload`
- download WakeOnLan-Webpage `git clone https://github.com/Felix-Franz/WakeOnLan-Webpage.git /var/www/html/wol/`
- open WakeOnLan-Webpage directory `cd /var/www/html/`

### Add Config

- generate a demo config file `cp api/config.php.sample api/config.php`
- edit config `nano api/config.php`
- you can add users in the user array (just like user1 an user2)
- if you set the option hashAlgorithm to anything else than false, you need to enter passwordhash using the hash Algorithm that you have set in this option
- to add other devices use the devices section (enter all credentials like provided in testdevice1 and testdevice2)
- save and exit configuration file using `F3` and `F2`

## Install on other Webservers

If you use another webserver the installation procress is nearly the same, but you need to make sure that the webserver  doesn't hide the Autorization header from the php engine (e.g. [apache configuration](https://www.geekality.net/2015/11/18/php-authorization-header-missing-on-apache/))


## Technology

- [Material Design Lite](https://getmdl.io/)
- [jQuery](https://jquery.com/)
