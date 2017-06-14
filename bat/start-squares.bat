start mongod
timeout 3 > NUL

start start-auth-api

start start-squares-api
timeout 1  >NUL

start start-users-api
start start-squares-login
