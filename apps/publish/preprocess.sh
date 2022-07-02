#!/bin/zsh

echo "Preprocessing image files..."

if [ ! -d .s3/source.phylopic.org/images ]; then
    echo "No source folder for images!" 1>&2
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
            if [ ! -d '.s3/source.phylopic.org/images/'$file ]; then
                rm -rf '.s3/images.phylopic.org/images/'$file
            fi
        done
    fi
}
wait

echo "Set up scratch and destination. Copying source files to scratch..."
for file in .s3/source.phylopic.org/images/**/source.svg; do
    dest=$(echo $file |
        sed 's/^\.s3\/source\.phylopic\.org\/images\//.scratch\/vector\//' |
        sed 's/\/source\.svg$/.source.svg/')
    comparison=$(echo $file |
        sed 's/^\.s3\/source\.phylopic\.org\//.s3\/images.phylopic.org\//')
    changed=$(cmp --silent $file $comparison && echo 0 || echo 1)
    if [[ $changed -eq 1 ]]
    then
        cp $file $dest
    fi
done &
for file in .s3/source.phylopic.org/images/**/source.(bmp|gif|jpeg|png); do
    dest=$(echo $file |
        sed 's/^\.s3\/source\.phylopic\.org\/images\//.scratch\/raster\//' |
        sed 's/\/source\./.source./')
    comparison=$(echo $file |
        sed 's/^\.s3\/source\.phylopic\.org\//.s3\/images.phylopic.org\//')
    changed=$(cmp --silent $file $comparison && echo 0 || echo 1)
    if [[ $changed -eq 1 ]]
    then
        cp $file $dest
    fi
done
wait

echo "Copied source files to scratch."

echo "Preprocessed image files."
