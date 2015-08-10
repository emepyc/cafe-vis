Software to graphically display the results of a CAFE analysis (http://sites.bio.indiana.edu/~hahnlab/Programs/CAFE3.0/CAFE_3.0_Manual_Aug1Update.pdf)

Installation
-------------
To install from npm:
```
npm install cafe-vis
cd node_modules/cafe-vis
```

To install from github
```
git clone https://github.com/emepyc/cafe-vis
cd cafe-vis
npm install
gulp build-browser
```

Run
---
```
node src/cafe.js test/resultfile.cafe
```
Then open your browser and go to
```
http://127.0.0.1/9000
```
To view the tree of a given family:
```
http://127.0.0.1/9000/<ID>
```

Contact
-------
For any comment contact me at `emepyc@gmail.com`or `mp@ebi.ac.uk`
