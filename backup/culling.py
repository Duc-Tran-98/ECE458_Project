# Culling script to perform staggered retention on database backups
# Created by Max Smith on 20210317

# TODO: Ask Bletsch about implementation on 7.2
# On day 8, 7th daily "falls off" and becomes first weekly
# On day 31, 4th weekly "falls off" and becomes first monthly
# On day 366, 12th monthly "falls off" and is removed

# Bletsch commented - any policy will do (rotation is best)
# Idea, just go through list 3x for each time scope and remove any extras

from os import name, path
import glob
from datetime import datetime as dt
import re

# Static strings for operating
PATH_TO_PROJECT = "C:\\Users\\smith\\Desktop\\ECE458\\ECE458_Project"
WINDOWS_PATH = f"{PATH_TO_PROJECT}\\backup\\test"
LINUX_PATH = "/home/vcm/db_backup"
WINDOWS_NAME = "nt"

def getOperatingSystem():
  return name

def getPath():
  operatingSystem = getOperatingSystem()
  print(f"operatingSystem: {operatingSystem}") # "nt" on Windows, "posix" on vcm
  return WINDOWS_PATH if operatingSystem == WINDOWS_NAME else LINUX_PATH

def getFilesInPath(path):
  return glob.glob(f"{path}/backup_*.zip")

def getAllWeekly(allFiles):
  # Helper to get all weekly files
  for f in allFiles:
    filePath, fileName = path.split(f)
    fileDate = re.search('\d{8}', fileName).group(0)
    dateObj = dt.strptime(fileDate, "%Y%m%d")
    print(f"fileName: {fileName}\tfileDate: {fileDate}\tdateObj: {dateObj}")



# def removeExtraWeekly(allFiles):
#   # Helper to remove extra weekly files
#   weekly = getAllWeekly(allFiles=allFiles)


def main():
  filePath = getPath()
  allFiles = getFilesInPath(path=filePath)
  getAllWeekly(allFiles=allFiles)

if __name__ == "__main__":
    # execute only if run as a script
    main()
