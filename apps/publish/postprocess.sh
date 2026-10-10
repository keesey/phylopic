#!/bin/zsh

echo "Postprocessing image files..."

echo "Writing process manifest..."
node --loader ts-node/esm ./src/process/writeProcessManifest.ts

echo "Removing scratch..."
rm -r .scratch

echo "Removed scratch."

echo "Postprocessed image files."
echo "All done!"
