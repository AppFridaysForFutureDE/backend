#!/bin/sh
docker exec backend_mysql-db_1 /usr/bin/mysqldump -u root --password=root db > backup/backup.sql
cp -a -r -v 
