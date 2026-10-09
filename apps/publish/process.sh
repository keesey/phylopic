#!/bin/zsh
./preprocess.sh || exit 1
./process_vector.sh &
vector_pid=$!
./process_raster.sh &
raster_pid=$!

# Wait for both workers, preserving failures before cleanup or publication.
processing_status=0
wait $vector_pid || processing_status=1
wait $raster_pid || processing_status=1
(( processing_status == 0 )) || exit $processing_status
./postprocess.sh
