#!/bin/zsh

echo "[VECTOR] Processing vector source files..."

cd .scratch/vector

echo "[VECTOR] Cropping vector source files..."
for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
    for file in $(ls $prefix*.source.svg); do
        dest=$(echo $file |
            sed 's/\.source\./.vector./')
        inkscape \
            $file \
            --batch-process \
            --export-area-drawing \
            --export-background-opacity=0 \
            --export-filename=$dest \
            --export-plain-svg \
            --export-type=svg
    done &
done
wait

echo "[VECTOR] Cropped vector source files. Rasterizing vector files..."
for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
    for file in $(ls $prefix*.vector.svg); do
        width=$(inkscape --query-width $file)
        height=$(inkscape --query-height $file)
        dest=$(echo $file |
            sed 's/\.vector\.svg$/.raster.png/')
        if [[ $width -ge $height ]]; then
            inkscape \
                $file \
                --batch-process \
                --export-background-opacity=0 \
                --export-filename=$dest \
                --export-type=png \
                --export-width=1536
        else
            inkscape \
                $file \
                --batch-process \
                --export-background-opacity=0 \
                --export-filename=$dest \
                --export-height=1536 \
                --export-type=png
        fi
    done &
done
wait

echo "[VECTOR] Rasterized vector files. Cleaning raster files..."
for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
    magick mogrify \
        -strip \
        -colorspace sRGB \
        -background white \
        -alpha remove \
        -negate \
        -normalize \
        -alpha on \
        -color-matrix "5x5: 0,0,0,0,0 0,0,0,0,0 0,0,0,0,0 0,0,0,0,0 0.2126,0.7152,0.0722,0,0" \
        -define png:compression-level=0 \
        $prefix'*.raster.png'
done

echo "[VECTOR] Cleaned raster files. Creating raster variants..."
for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -background white \
        -alpha remove \
        '%[filename:basename].bmp'
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -define png:compression-level=9 \
        '%[filename:basename].1536.png' &
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -resize 66.666667% \
        -define png:compression-level=9 \
        '%[filename:basename].1024.png' &
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -resize 33.333333% \
        -define png:compression-level=9 \
        '%[filename:basename].512.png' &
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -gravity South \
        -resize 192x192 \
        -background none \
        -extent 192x192 \
        -define png:compression-level=9 \
        '%[filename:basename].thumbnail.192.png' &
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -gravity South \
        -resize 128x128 \
        -background none \
        -extent 128x128 \
        -define png:compression-level=9 \
        '%[filename:basename].thumbnail.128.png' &
    magick convert \
        $prefix'*.raster.png' \
        -set filename:basename '%[basename]' \
        -gravity South \
        -resize 64x64 \
        -background none \
        -extent 64x64 \
        -define png:compression-level=9 \
        '%[filename:basename].thumbnail.64.png' &
    {
        magick convert \
            $prefix'*.raster.png' \
            -set filename:basename '%[basename]' \
            -gravity Center \
            -resize 36.979167% \
            -background none \
            -extent 568x568 \
            -define png:compression-level=0 \
            '%[filename:basename].overlay.png'
        for file in *.overlay.png; do
            dest=$(echo $file |
                sed 's/\.overlay\./.social./')
            magick composite \
                -geometry +562+30 \
                -define png:compression-level=9 \
                $file \
                ../../graphics/social-media-base.png \
                $dest
        done
        rm *.overlay.png
    } &
    wait
done

echo "[VECTOR] Created raster variants. Sanitizing vector files..."
for file in *.raster.bmp; do
    dest=$(echo $file |
        sed 's/\.raster\.bmp$/.vector.svg/')
    potrace \
        $file \
        --svg \
        --output $dest
done

echo "[VECTOR] Sanitized vector files. Cleaning up raster bases..."
rm *.raster.bmp
rm *.raster.png
cd ../..

echo "[VECTOR] Cleaned up raster bases. Making S3 mirror folders..."
for file in .scratch/vector/*.source.svg; do
    dir=$(echo $file |
        sed 's/^\.scratch\/vector\//.s3\/images.phylopic.org\/images\//' |
        sed 's/\.source\.svg$//')
    {
        if [ -d $dir ]; then
            rm -rf $dir
        fi
        mkdir $dir
        mkdir $dir/raster
        mkdir $dir/social
        mkdir $dir/thumbnail
    } &
done
wait

echo "[VECTOR] Made S3 mirror folders. Moving files to S3 mirror..."
for file in .scratch/vector/*.source.svg; do
    dest=$(echo $file |
        sed 's/^\.scratch\/vector\//.s3\/images.phylopic.org\/images\//' |
        sed 's/\.source\.svg$/\/source.svg/')
    mv $file $dest
done &
for file in .scratch/vector/*.vector.svg; do
    dest=$(echo $file |
        sed 's/^\.scratch\/vector\//.s3\/images.phylopic.org\/images\//' |
        sed 's/\.vector\.svg$/\/vector.svg/')
    mv $file $dest
done &
for file in .scratch/vector/*.png; do
    size=$(magick identify -format "%[fx:w]x%[fx:h]" $file)
    dest=$(echo $file |
        sed 's/^\.scratch\/vector\//.s3\/images.phylopic.org\/images\//' |
        sed 's/\.raster\.[0-9][0-9]*\.png$/\/raster\/'$size'.png/' |
        sed 's/\.raster\.thumbnail\.[0-9][0-9]*\.png$/\/thumbnail\/'$size'.png/' |
        sed 's/\.raster\.social\.png$/\/social\/'$size'.png/')
    mv $file $dest
done &
wait

echo "[VECTOR] Moved files to S3 mirror."

echo "[VECTOR] Processed vector source files."
