# Script to generate blank zip files (for testing purposes)
# Created by Max Smith on 20210317
import os

PATH_TO_PROJECT = "C:\\Users\\smith\\Desktop\\ECE458\\ECE458_Project"
WINDOWS_PATH = f"{PATH_TO_PROJECT}\\backup\\test"

DESIRED_DATES = [
  "20210310",
  "20210311",
  "20210312",
  "20210313",
  "20210314",
  "20210315",
  "20210316",
  "20210317",
  "20210318",
  "20210319",
  "20210320",
  "20210321"
]

def generateFilename(date):
  return f"{WINDOWS_PATH}\\backup_{date}.zip"

def createFiles():
  for date in DESIRED_DATES:
    filename = generateFilename(date=date)
    print(filename)
    with open(filename, 'w'):
      pass

def main():
  createFiles()

if __name__ == "__main__":
    # execute only if run as a script
    main()