# Culling script to perform staggered retention on database backups
# Created by Max Smith on 20210317

# TODO: Ask Bletsch about implementation on 7.2
# On day 8, 7th daily "falls off" and becomes first weekly
# On day 31, 4th weekly "falls off" and becomes first monthly
# On day 366, 12th monthly "falls off" and is removed

from os import name
import glob

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

def main():
  filePath = getPath()
  allFiles = getFilesInPath(path=filePath)
  for f in allFiles:
    print(f)

if __name__ == "__main__":
    # execute only if run as a script
    main()
