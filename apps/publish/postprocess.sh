#!/bin/zsh

echo "Postprocessing image files..."

echo "Writing derivative manifests and pruning unlisted derivatives..."
node --loader ts-node/esm ./src/process/finalizeDerivatives.ts || exit 1
echo "Finalized derivatives."

echo "Removing scratch..."
rm -r .scratch
echo "Removed scratch."

echo "Postprocessed image files."
echo "All done!"
