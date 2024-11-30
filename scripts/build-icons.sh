#!/bin/bash

# Check if rsvg-convert is installed
if ! command -v rsvg-convert &> /dev/null; then
    echo "Error: rsvg-convert is not installed"
    echo "Please install librsvg:"
    echo "  MacOS: brew install librsvg"
    echo "  Ubuntu: sudo apt-get install librsvg2-bin"
    exit 1
fi

# Ensure directories exist
mkdir -p dist/icons
mkdir -p chrome-store

# Convert SVGs to PNGs in different sizes
echo "Generating 16x16 icons..."  
rsvg-convert -w 16 -h 16 src/icons/icon.svg > dist/icons/icon16.png
rsvg-convert -w 16 -h 16 src/icons/icon-gray.svg > dist/icons/icon16-gray.png

echo "Generating 48x48 icons..."
rsvg-convert -w 48 -h 48 src/icons/icon.svg > dist/icons/icon48.png
rsvg-convert -w 48 -h 48 src/icons/icon-gray.svg > dist/icons/icon48-gray.png

echo "Generating 128x128 icons..."
rsvg-convert -w 128 -h 128 src/icons/icon.svg > dist/icons/icon128.png
rsvg-convert -w 128 -h 128 src/icons/icon-gray.svg > dist/icons/icon128-gray.png

echo "Generating store icon..."
rsvg-convert -w 128 -h 128 src/icons/store-icon.svg > chrome-store/store-icon.png

echo "Icons generated successfully!" 