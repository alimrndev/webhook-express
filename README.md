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

Finally start the npm
```
    npm run start
```

