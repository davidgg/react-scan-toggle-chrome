#!/bin/bash

SOURCE_FILE="node_modules/react-scan/dist/auto.global.js"
OUTPUT_FILE="dist/react-scan.js"
VERSION=$(node -p "require('./node_modules/react-scan/package.json').version")

# Create dist directory if it doesn't exist
mkdir -p dist

# Add license and version comment
cat > "$OUTPUT_FILE" << EOL
/*
React Scan version: ${VERSION}

This extension includes React Scan:
Copyright 2024 Aiden Bai, Million Software, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

EOL

# Append the React Scan code
cat "$SOURCE_FILE" >> "$OUTPUT_FILE" && echo "React Scan script updated successfully!" || echo "Error: Failed to copy React Scan script" 