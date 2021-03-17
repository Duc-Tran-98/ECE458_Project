# Culling script to perform staggered retention on database backups
# Created by Max Smith on 20210317

from os import listdir, name
from os.path import isfile, join
import glob

# File paths on both systems (note to other developers, change windows path)
PATH_TO_PROJECT="C:\\Users\\smith\\Desktop\\ECE458\\ECE458_Project"
WINDOWS_PATH=f"{PATH_TO_PROJECT}\\backup\\test"
LINUX_PATH="/home/vcm/db_backup"

def getOperatingSystem():
  return name

def getPath():
  operatingSystem = getOperatingSystem()
  print(f"operatingSystem: {operatingSystem}")
  return WINDOWS_PATH if operatingSystem == "nt" else LINUX_PATH

def getFilesInPath(path):
  return glob.glob(f"{path}/backup_*.zip")
  # return [f for f in listdir(path) if isfile(join(path, f))]

def main():
  filePath = getPath()
  allFiles = getFilesInPath(path=filePath)
  for f in allFiles:
    print(f)

if __name__ == "__main__":
    # execute only if run as a script
    main()
