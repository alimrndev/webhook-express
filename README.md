# webhook-express
Webhook using Express

Start with create Postgresql Docker
```
    docker compose up --build -d
```

If Already Docker Container
```
    docker ps
```
```
    docker exec -it <container-name> bash
```
```
    psql -U postgres
```
```
    CREATE DATABASE webhook;
```
```
    SELECT datname FROM pg_database;
```
```
    exit
```

Change the Environtment
```
    copy example.env and paste with name .env
```

Finally install and start the npm
```
    npm run install
```
```
    npm run start
```

