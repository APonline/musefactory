# musefactory

## Important addresses

### Live Site

https://musefactory.app

### API

https://musefactory.app:4000/graphql

### Local access only DB

http://musefactory.apanemia.antsle.us/neo4j/

## Server

### PM2 Services

#### Github CI/CD

cd /var/www/deploy/
pm2 start run.sh --name GITHUB_Actions_CD

#### API

cd /var/www/deploy/deploy/musefactory/musefactory/server/
pm2 start index.js --name graphql --interpreter ./node_modules/.bin/babel-node
