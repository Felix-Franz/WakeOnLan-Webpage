# WakeOnLan-Webpage
A webpage that should be displayed if a server (behind a reverse proxy) is powered off to start it remotly. It is also possible to start multiple instances of servers.


## Installation

> Installation instructions will be improved after development work is done

- install `sudo apt install wakeonlan`
- install nginx & php `sudo apt install nginx php7.1`
- clone this repo into webroot

> The webpage should be accessable using a encrypted connection only, because username and password is transfered base64 encoded and **not encrypted**! The easiest way would be advicing your webserver (e.g. nginx) to provide a https (ssl) connection only.

## Technology

- [Material Design Lite](https://getmdl.io/)
- [jQuery](https://jquery.com/)
