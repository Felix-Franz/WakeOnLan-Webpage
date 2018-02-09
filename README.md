# WakeOnLan-Webpage
A webpage that should be displayed if a server (behind a reverse proxy) is powered off to start it remotly. It is also possible to start multiple instances of servers.


## Installation

> Installation instructions will be improved after development work is done

- install `sudo apt install wakeonlan`
- install nginx & php `sudo apt install nginx php7.1`
- clone this repo into webroot `git clone https://github.com/Felix-Franz/WakeOnLan-Webpage.git`

> The webpage should be accessable using a encrypted connection only, because username and password is transfered base64 encoded and **not encrypted**! The easiest way would be advicing your webserver (e.g. nginx) to provide a https (ssl) connection only.
### Using other Webservers

If you use another webserver make sure that it doesn't hide the Autorization header from the php engine (e.g. [apache configuration](https://www.geekality.net/2015/11/18/php-authorization-header-missing-on-apache/))


## Technology

- [Material Design Lite](https://getmdl.io/)
- [jQuery](https://jquery.com/)
