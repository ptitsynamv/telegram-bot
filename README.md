# Telegram Bot
Bot name - http://t.me/ptitsyna_bot
MongoDB - https://www.mongodb.com/cloud/atlas

## Develop
1. Run `npm install`.
2. Run `npm start`.

## Bugs
"Unhandled rejection Error: spawn phantomjs ENOENT"
cd /usr/local/share
sudo wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
sudo tar xjf phantomjs-2.1.1-linux-x86_64.tar.bz2
sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs
sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs
sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs

rm -r node_modules

sudo apt-get install libfreetype6
sudo apt-get install libfontconfig


## How to run on server
New session `screen -S name`

Connect to the session you created earlier: `screen -x name`

Show all active sessions: `screen -list`

In current case: `screen -x telegram-bot`

Disconnect from the session but leave it in the background:
hold down ctrl without releasing ctrl press A, then D
