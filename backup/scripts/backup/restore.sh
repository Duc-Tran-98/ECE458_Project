# Script to scp db backups to original server
# Created by Max Smith on 20210316

# Validate if an input file was sent in
if [ "$1" = "" ]
then
        echo "Please pass in an input parameter that is a file"
        exit
fi

# Set file as $1
file=$1

# Validate that the input argument was a sql file
if [ ${file: -4} != ".zip" ]
then
        echo "Please pass in a .zip file"
        exit
fi

# Set server and path parameters
server=vcm@vcm-18554.vm.duke.edu
server_path="/home/vcm/backup/db_restore"

# Scp file to remote server (no pass needed, setup ssh keys)
scp $file $server:$server_path

# Send email with results
send_to="ms724@duke.edu"
# send_to="ms724@duke.edu angel.huizar@duke.edu duc.tran1@duke.edu natasha.von.seelen@duke.edu louis.jensen@duke.edu"
mail -s "Successful sent file $file to production server" $send_to < /home/vcm/messages/restore.txt