# LTO Chain Cache
This node.js project caches the LTO network chain and stores it into a [knex.js]('https://knexjs.org) supported database.

## Requirements
- Node.js v8+
- [knex.js](http://knexjs.org) supported database (pg, sqlite3, mysql, mysql2, oracle, mssql)
- [LTO Chain Cache API](https://github.com/fexra/lto-chain-cache-api)
## .env example

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASS=pass
DB_NAME=db

RABBITMQ_HOST=localhost
RABBITMQ_USER=user
RABBITMQ_PASS=pass

NODE_NAME=my_node
NODE_ADDRESS=localhost
NODE_IP=0.0.0.0
NODE_PORT=6869

COLLECT_BLOCKS=10000
TIMEOUT=10000
```