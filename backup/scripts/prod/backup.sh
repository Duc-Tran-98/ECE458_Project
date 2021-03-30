#!/bin/bash

# Script to generate backups of db and scp them to remote server
# Created by Max Smith on 20210316

# Variables we will need in the script
today=`date +%Y%m%d`
backup_dir_prod="/tmp"
backup_dir_store="/home/vcm/db_backup"
sql_backup=$backup_dir_prod/backup_$today.sql
zip_backup=$backup_dir_prod/backup_$today.zip
docker_volume_path="/usr/src/app/uploads"
container="backend"
local_volume_path="/tmp/uploads"
checksum_path="/home/vcm/backup/checksums"
db_pass="ECE458XX" # $DB_PASS # Cron has different env, just hardcode it

# Create backup from docker container
sudo docker exec mysql mysqldump -u root --password=ECE458XX --databases mydb > $sql_backup

# Create copy of contents in docker volumes
sudo docker cp $container:$docker_volume_path /tmp

# Zip up the file
zip -r $zip_backup $sql_backup $local_volume_path

# Generate checksum to test for validity later
md5sum $zip_backup > $checksum_path/checksum_$today.md5

# Scp file to remote server (no pass needed, setup ssh keys)
server="vcm@vcm-19409.vm.duke.edu"
scp $zip_backup $server:$backup_dir_store

# Clean up created files
rm $sql_backup $zip_backup
sudo rm -r $local_volume_path