#!/bin/bash

# Script to restore backups of db
# Created by Max Smith on 20210316

# Validate if an input file was sent in
if [ "$1" = "" ]
then
        echo "Please pass in an input parameter that is a file"
        exit
fi

# Set file as $1
file=$1
no_color='\033[0m'

# Validate file with checksums
checksum_dir="/home/vcm/backup/checksums"
date=`echo $file | awk -F '[_.]' '{print $2}'`
# echo $date
checksum_file=$checksum_dir/checksum_$date.md5
# echo $checksum_file

# Temporaily move file to tmp dir then checksum
cp $file /tmp
md5sum -c $checksum_file

if [ $? != 0 ]; then
        echo -e '\033[0;31mChecksum is INVALID, aborting restore procedure'
        rm /tmp/$file
        exit 1
fi

rm /tmp/$file
echo -e '\033[0;32mChecksum is VALID, performing restore procedure'
echo -e $no_color

# Unzip file and perform restore
restore_dir="/home/vcm/backup/db_restore"
unzip_folder="$restore_dir/tmp"
volumes_folder="uploads"
volumes_path="/usr/src/app/"
unzip $file -d $restore_dir

# set -x
# Grab sql file (can validate this)
sql_file=`find $restore_dir -name \*.sql`
# echo "Found sql_file: $sql_file"

# Grab docker volumes folder
docker_volumes=`find $unzip_folder -type d -name $volumes_folder`
# echo "Found docker_volumes: $docker_volumes"

# Restore mysql contents to previous value
cat $sql_file | sudo docker exec -i mysql /usr/bin/mysql -u root --password=ECE458XX mydb

# Restore docker volumes to previous value
sudo docker cp $docker_volumes backend:/$volumes_path

# Remove tmp directory from zip
sudo rm -r $unzip_folder