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


def modified_since(filename, since):
    statbuf = os.stat(filename)
    if (since < statbuf.st_mtime):
        return statbuf.st_mtime
    else:
        return False

script = [ "./docs/demo.js" ]
tailwind = "docs/makeitlit"
package_directories = [ "./src" ]
lastmodif = 0
lastmodif2 = 0
while (True):
    
    check1 = modified_since(tailwind+".css", lastmodif2)
    if (check1):
        lastmodif2 = check1
        os.system("npx tailwindcss build " +tailwind+ ".css -o " +tailwind+ ".tail.css")

    for directory in package_directories:
        for filename in ls_files(directory) + script:
            check = modified_since(filename, lastmodif)
            if check:
                lastmodif = check+10
                os.system("browserify docs/demo.js -t babelify --outfile docs/bundle.js")
                print("File " + filename + " was modifed!")
    time.sleep(1)
