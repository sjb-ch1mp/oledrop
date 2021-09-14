## oledrop

#### Attribution
The amazing [oletools](https://github.com/decalage2/oletools) was created and is maintained by [decalage](http://www.decalage.info). I have nothing to do with that project whatsoever. 

#### Purpose
oledrop is a simple nodejs web app that allows users to submit files to a remote server where they can be analyzed by Decalage's [olevba](https://github.com/decalage2/oletools/wiki/olevba). The results of the analysis and any macros in the document can then be returned and rendered client-side. 

This tool was created as not all SOCs are lucky enough to be able to install any old open source tool on their workstations (no matter how useful they may be). If, however, you have a linux server floating around in the environment, you can install this there so that analysts will be able to utilise olevba with relative ease. 

#### Installation
TODO
```
mkdir oledrop/
# copy oledrop-master.zip into oledrop/
cd oledrop/
unzip oledrop-master.zip
npm install
python -m venv ./oledrop-venv
source bin/activate
pip sudo python -m pip install --upgrade pip
pip install cryptography
pip install oletools
deactivate
# modify shebang
chmod -x oledrop.py 
# alter port
# configure host firewall
```
