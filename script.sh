#!/bin/bash

# This tell me if my script worked
echo "This shit works"

# Copy this directory for back up
mkdir /Users/light/Documents/backup

cp -r $1 /Users/light/Documents/backup/_temp
node index.js $1