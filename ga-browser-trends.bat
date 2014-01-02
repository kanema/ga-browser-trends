@echo Off
call npm install
start /max http://localhost:3000
call node app.js