# Telegram Bot

## Develop

1. Run `npm install`.
2. Run `npm start`.

## How to run nodejs project on server

1. New session `screen -S name`. In current case: `screen -S telegram-bot`.

2. Connect to the session you created earlier: `screen -x name`. In current case: `screen -x telegram-bot`. 
   
3. Show all active sessions: `screen -list`.

4. Disconnect from the session but leave it in the background: hold down ctrl without releasing ctrl press A, then D.

5. Kill session `screen -X -S name quit`. In current case: `screen -X -S telegram-bot quit`
