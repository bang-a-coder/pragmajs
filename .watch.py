import os
import time

def ls_files(dir):
    files = list()
    for item in os.listdir(dir):
        abspath = os.path.join(dir, item)
        try:
            if os.path.isdir(abspath):
                files = files + ls_files(abspath)
            else:
                files.append(abspath)
        except FileNotFoundError as err:
            print('invalid directory\n', 'Error: ', err)
    return files


script = [ "./docs/demo.js" ]
package_directories = [ "./src" ]
lastmodif = 0
while (True):
    for directory in package_directories:
        for filename in ls_files(directory) + script:
            statbuf = os.stat(filename)
            if lastmodif < statbuf.st_mtime:
                lastmodif = statbuf.st_mtime
                os.system("browserify docs/demo.js -t babelify --outfile docs/bundle.js")
                print("File " + filename + " was modifed!")
    time.sleep(1)
