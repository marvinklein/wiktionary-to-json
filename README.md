# wiktionary-to-json

Converts a Wiktionary dump into structured JSON data.

## Installation
```
$ git clone https://github.com/marvinklein/wiktionary-to-json.git
$ cd wiktionary-to-json
$ npm install
$ wget -P data/ https://dumps.wikimedia.org/enwiktionary/latest/enwiktionary-latest-pages-meta-current.xml.bz2
```

## Use
```$ node app.js```

Creates a JSON file at data/wiktionary.json with the entirety of wiktionary.


### Options
```
--help            Show help                                          
--version         Show version number                                
-n, --numEntries  The number of entries to process                    
-o, --outputFile  The output file 
-s, --startAt     An offset at which to start processing
-a, --buildAST    Build an AST for each section
-f, --find        Only process the entry matching the argument
-w, --wikitext    Write the original wikitext markup to the output
-p, --prune       A file with a list of sections to keep
```
