# Telegram Bot

## Develop
1. Run `npm install`.
2. Run `npm start`.

## Bugs
"Unhandled rejection Error: spawn phantomjs ENOENT":

1. `cd /usr/local/share`
2. `sudo wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2`
3. `sudo tar xjf phantomjs-2.1.1-linux-x86_64.tar.bz2`
4. `sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/share/phantomjs`
5. `sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/local/bin/phantomjs`
6. `sudo ln -s /usr/local/share/phantomjs-2.1.1-linux-x86_64/bin/phantomjs /usr/bin/phantomjs`

7. `rm -r node_modules`

8. `sudo apt-get install libfreetype6`
9. `sudo apt-get install libfontconfig`
10.`npm install`


## How to run on server
1. New session `screen -S name`
In current case: `screen -S telegram-bot`.
   
2. Connect to the session you created earlier: `screen -x name`
In current case: `screen -x telegram-bot`.

3.Show all active sessions: `screen -list`

4. Disconnect from the session but leave it in the background:
hold down ctrl without releasing ctrl press A, then D
   
5. Kill session `screen -X -S name quit`
   In current case: `screen -X -S telegram-bot quit`
