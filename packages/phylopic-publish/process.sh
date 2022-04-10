#!/bin/zsh
./preprocess.sh
./process_vector.sh &
./process_raster.sh
wait
./postprocess.sh
