#!/bin/zsh

echo "Preprocessing image files..."

if [ ! -d .s3/upload.phylopic.org/images ]; then
    echo "No folder for uploads!" 1>&2
    exit 1
fi

echo "Setting up scratch and destination..."
{
    if [ -d .scratch ]; then
        rm -rf .scratch
    fi
    mkdir .scratch
    mkdir .scratch/raster &
    mkdir .scratch/vector
    wait
} &
{
    if [ ! -d .s3/images.phylopic.org ]; then
        mkdir .s3/images.phylopic.org
    fi
    if [ ! -d .s3/images.phylopic.org/images ]; then
        mkdir .s3/images.phylopic.org/images
    else
        for file in .s3/images.phylopic.org/images; do
            if [ ! -d '.s3/upload.phylopic.org/images/'$file ]; then
                rm -rf '.s3/images.phylopic.org/images/'$file
            fi
        done
    fi
}
wait

echo "Set up scratch and destination. Copying uploads to scratch..."
for file in .s3/upload.phylopic.org/images/**/source; do
    type=$(file --mime-type --brief $file 2>&1)
    if [ "$type" = "image/svg+xml" ]; then
        comparison=$(echo $file |
            sed 's/^\.s3\/upload\.phylopic\.org\//.s3\/images.phylopic.org\//' |
            sed 's/source$/source.svg/')
        changed=$(cmp --silent $file $comparison && echo 0 || echo 1)
        if [[ $changed -eq 1 ]]; then
            dest=$(echo $file |
                sed 's/^\.s3\/upload\.phylopic\.org\/images\//.scratch\/vector\//' |
                sed 's/\/source$/.source.svg/')
            cp $file $dest
        fi
    else
        extension=$(echo $type |
            sed 's/^image\///')
        comparison=$(echo $file |
            sed 's/^\.s3\/upload\.phylopic\.org\//.s3\/images.phylopic.org\//' |
            sed 's/source$/source.'$extension'/')
        changed=$(cmp --silent $file $comparison && echo 0 || echo 1)
        if [[ $changed -eq 1 ]]; then
            dest=$(echo $file |
                sed 's/^\.s3\/upload\.phylopic\.org\/images\//.scratch\/raster\//' |
                sed 's/\/source$/.source.'$extension'/')
            cp $file $dest
        fi
    fi
done

echo "Copied uploads to scratch."

echo "Preprocessed image files."
