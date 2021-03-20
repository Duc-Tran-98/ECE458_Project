# Culling script to perform staggered retention on database backups
# Created by Max Smith on 20210317

from os import name, path, remove
import glob
from datetime import datetime, date, timedelta
import re

# Class for storing intervals
class Interval:
  def __init__(self, start, stop):
    self.start = start
    self.stop = stop

  def __str__(self):
    return f"Start: {self.start}\tStop: {self.stop}"

# Static strings for operating
PATH_TO_PROJECT = "C:\\Users\\smith\\Desktop\\ECE458\\ECE458_Project"
WINDOWS_PATH = f"{PATH_TO_PROJECT}\\backup\\test"
LINUX_PATH = "/home/vcm/db_backup"
WINDOWS_NAME = "nt"

def getOperatingSystem():
  return name

def getPath():
  operatingSystem = getOperatingSystem()
  # print(f"operatingSystem: {operatingSystem}") # "nt" on Windows, "posix" on vcm
  return WINDOWS_PATH if operatingSystem == WINDOWS_NAME else LINUX_PATH

def getFilesInPath(path):
  return glob.glob(f"{path}/backup_*.zip")

def printIntervalFiles(intervals, filesInsideIntervals):
  for index in range(len(intervals)):
    interval = intervals[index]
    print(interval)
    files = filesInsideIntervals[index]
    for f in files:
      print(f)

def createIntervals(weeks, days, totalIntervals, keepFirst):
  # Create tuple of start/stop intervals for culling
  intervals = []
  stop = date.today()
  delta = timedelta(weeks=weeks, days=days)
  for _ in range(totalIntervals+1):
    start = stop - delta
    intervals.append(Interval(start=start, stop=stop))
    stop = start

  if not keepFirst:
    intervals.pop(0)

  return intervals

def getIntervalIndex(intervals, dateObj):
  # Using intervals find index of dateObj
  for index in range(len(intervals)):
    interval = intervals[index]
    start, stop = interval.start, interval.stop
    if start < dateObj <= stop:
      return index

  # No index found
  return -1

def removeExtraFiles(filesInsideIntervals, keepInRange):
  # Helper to delete any files that are duplicate inside interval
  for fileList in filesInsideIntervals:
    if (len(fileList) > keepInRange):
      for index in range(1, len(fileList)):
        removeFile = fileList[index]
        print(f"removing: {removeFile}")
        remove(removeFile)

def filterFiles(allFiles, weeks, days, totalIntervals, keepInRange):
  intervals = createIntervals(weeks=weeks, days=days, totalIntervals=totalIntervals, keepFirst=False)
  filesInsideIntervals = [[] for _ in range(totalIntervals)]

  for f in allFiles:
    filePath, fileName = path.split(f)
    fileDate = re.search('\d{8}', fileName).group(0)
    dateObj = datetime.strptime(fileDate, "%Y%m%d").date()
    # print(f"fileName: {fileName}\tfileDate: {fileDate}\tdateObj: {dateObj}")
    intervalIndex = getIntervalIndex(intervals=intervals, dateObj=dateObj)
    if intervalIndex >= 0:
      filesInsideIntervals[intervalIndex].append(f)

  # printIntervalFiles(intervals=intervals, filesInsideIntervals=filesInsideIntervals)
  removeExtraFiles(filesInsideIntervals=filesInsideIntervals, keepInRange=keepInRange)

def main():
  filePath = getPath()
  allFiles = getFilesInPath(path=filePath)
  filterFiles(allFiles=allFiles, weeks=1, days=0, totalIntervals=3, keepInRange=1)
  filterFiles(allFiles=allFiles, weeks=4, days=2, totalIntervals=12, keepInRange=1)

if __name__ == "__main__":
    # execute only if run as a script
    main()