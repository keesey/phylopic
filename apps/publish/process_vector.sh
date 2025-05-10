#!/bin/zsh

echo "[VECTOR] Processing vector source files..."

cd .scratch/vector

echo "[VECTOR] Cropping vector source files..."
for prefix in "00" "01" "02" "03" "04" "05" "06" "07" "08" "09" "0a" "0b" "0c" "0d" "0e" "0f" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "1a" "1b" "1c" "1d" "1e" "1f" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "2a" "2b" "2c" "2d" "2e" "2f" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "3a" "3b" "3c" "3d" "3e" "3f" "40" "41" "42" "43" "44" "45" "46" "47" "48" "49" "4a" "4b" "4c" "4d" "4e" "4f" "50" "51" "52" "53" "54" "55" "56" "57" "58" "59" "5a" "5b" "5c" "5d" "5e" "5f" "60" "61" "62" "63" "64" "65" "66" "67" "68" "69" "6a" "6b" "6c" "6d" "6e" "6f" "70" "71" "72" "73" "74" "75" "76" "77" "78" "79" "7a" "7b" "7c" "7d" "7e" "7f" "80" "81" "82" "83" "84" "85" "86" "87" "88" "89" "8a" "8b" "8c" "8d" "8e" "8f" "90" "91" "92" "93" "94" "95" "96" "97" "98" "99" "9a" "9b" "9c" "9d" "9e" "9f" "a0" "a1" "a2" "a3" "a4" "a5" "a6" "a7" "a8" "a9" "aa" "ab" "ac" "ad" "ae" "af" "b0" "b1" "b2" "b3" "b4" "b5" "b6" "b7" "b8" "b9" "ba" "bb" "bc" "bd" "be" "bf" "c0" "c1" "c2" "c3" "c4" "c5" "c6" "c7" "c8" "c9" "ca" "cb" "cc" "cd" "ce" "cf" "d0" "d1" "d2" "d3" "d4" "d5" "d6" "d7" "d8" "d9" "da" "db" "dc" "dd" "de" "df" "e0" "e1" "e2" "e3" "e4" "e5" "e6" "e7" "e8" "e9" "ea" "eb" "ec" "ed" "ee" "ef" "f0" "f1" "f2" "f3" "f4" "f5" "f6" "f7" "f8" "f9" "fa" "fb" "fc" "fd" "fe" "ff"; do
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
for prefix in "00" "01" "02" "03" "04" "05" "06" "07" "08" "09" "0a" "0b" "0c" "0d" "0e" "0f" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "1a" "1b" "1c" "1d" "1e" "1f" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "2a" "2b" "2c" "2d" "2e" "2f" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "3a" "3b" "3c" "3d" "3e" "3f" "40" "41" "42" "43" "44" "45" "46" "47" "48" "49" "4a" "4b" "4c" "4d" "4e" "4f" "50" "51" "52" "53" "54" "55" "56" "57" "58" "59" "5a" "5b" "5c" "5d" "5e" "5f" "60" "61" "62" "63" "64" "65" "66" "67" "68" "69" "6a" "6b" "6c" "6d" "6e" "6f" "70" "71" "72" "73" "74" "75" "76" "77" "78" "79" "7a" "7b" "7c" "7d" "7e" "7f" "80" "81" "82" "83" "84" "85" "86" "87" "88" "89" "8a" "8b" "8c" "8d" "8e" "8f" "90" "91" "92" "93" "94" "95" "96" "97" "98" "99" "9a" "9b" "9c" "9d" "9e" "9f" "a0" "a1" "a2" "a3" "a4" "a5" "a6" "a7" "a8" "a9" "aa" "ab" "ac" "ad" "ae" "af" "b0" "b1" "b2" "b3" "b4" "b5" "b6" "b7" "b8" "b9" "ba" "bb" "bc" "bd" "be" "bf" "c0" "c1" "c2" "c3" "c4" "c5" "c6" "c7" "c8" "c9" "ca" "cb" "cc" "cd" "ce" "cf" "d0" "d1" "d2" "d3" "d4" "d5" "d6" "d7" "d8" "d9" "da" "db" "dc" "dd" "de" "df" "e0" "e1" "e2" "e3" "e4" "e5" "e6" "e7" "e8" "e9" "ea" "eb" "ec" "ed" "ee" "ef" "f0" "f1" "f2" "f3" "f4" "f5" "f6" "f7" "f8" "f9" "fa" "fb" "fc" "fd" "fe" "ff"; do
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
for prefix in "00" "01" "02" "03" "04" "05" "06" "07" "08" "09" "0a" "0b" "0c" "0d" "0e" "0f" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "1a" "1b" "1c" "1d" "1e" "1f" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "2a" "2b" "2c" "2d" "2e" "2f" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "3a" "3b" "3c" "3d" "3e" "3f" "40" "41" "42" "43" "44" "45" "46" "47" "48" "49" "4a" "4b" "4c" "4d" "4e" "4f" "50" "51" "52" "53" "54" "55" "56" "57" "58" "59" "5a" "5b" "5c" "5d" "5e" "5f" "60" "61" "62" "63" "64" "65" "66" "67" "68" "69" "6a" "6b" "6c" "6d" "6e" "6f" "70" "71" "72" "73" "74" "75" "76" "77" "78" "79" "7a" "7b" "7c" "7d" "7e" "7f" "80" "81" "82" "83" "84" "85" "86" "87" "88" "89" "8a" "8b" "8c" "8d" "8e" "8f" "90" "91" "92" "93" "94" "95" "96" "97" "98" "99" "9a" "9b" "9c" "9d" "9e" "9f" "a0" "a1" "a2" "a3" "a4" "a5" "a6" "a7" "a8" "a9" "aa" "ab" "ac" "ad" "ae" "af" "b0" "b1" "b2" "b3" "b4" "b5" "b6" "b7" "b8" "b9" "ba" "bb" "bc" "bd" "be" "bf" "c0" "c1" "c2" "c3" "c4" "c5" "c6" "c7" "c8" "c9" "ca" "cb" "cc" "cd" "ce" "cf" "d0" "d1" "d2" "d3" "d4" "d5" "d6" "d7" "d8" "d9" "da" "db" "dc" "dd" "de" "df" "e0" "e1" "e2" "e3" "e4" "e5" "e6" "e7" "e8" "e9" "ea" "eb" "ec" "ed" "ee" "ef" "f0" "f1" "f2" "f3" "f4" "f5" "f6" "f7" "f8" "f9" "fa" "fb" "fc" "fd" "fe" "ff"; do
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
for prefix in "00" "01" "02" "03" "04" "05" "06" "07" "08" "09" "0a" "0b" "0c" "0d" "0e" "0f" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19" "1a" "1b" "1c" "1d" "1e" "1f" "20" "21" "22" "23" "24" "25" "26" "27" "28" "29" "2a" "2b" "2c" "2d" "2e" "2f" "30" "31" "32" "33" "34" "35" "36" "37" "38" "39" "3a" "3b" "3c" "3d" "3e" "3f" "40" "41" "42" "43" "44" "45" "46" "47" "48" "49" "4a" "4b" "4c" "4d" "4e" "4f" "50" "51" "52" "53" "54" "55" "56" "57" "58" "59" "5a" "5b" "5c" "5d" "5e" "5f" "60" "61" "62" "63" "64" "65" "66" "67" "68" "69" "6a" "6b" "6c" "6d" "6e" "6f" "70" "71" "72" "73" "74" "75" "76" "77" "78" "79" "7a" "7b" "7c" "7d" "7e" "7f" "80" "81" "82" "83" "84" "85" "86" "87" "88" "89" "8a" "8b" "8c" "8d" "8e" "8f" "90" "91" "92" "93" "94" "95" "96" "97" "98" "99" "9a" "9b" "9c" "9d" "9e" "9f" "a0" "a1" "a2" "a3" "a4" "a5" "a6" "a7" "a8" "a9" "aa" "ab" "ac" "ad" "ae" "af" "b0" "b1" "b2" "b3" "b4" "b5" "b6" "b7" "b8" "b9" "ba" "bb" "bc" "bd" "be" "bf" "c0" "c1" "c2" "c3" "c4" "c5" "c6" "c7" "c8" "c9" "ca" "cb" "cc" "cd" "ce" "cf" "d0" "d1" "d2" "d3" "d4" "d5" "d6" "d7" "d8" "d9" "da" "db" "dc" "dd" "de" "df" "e0" "e1" "e2" "e3" "e4" "e5" "e6" "e7" "e8" "e9" "ea" "eb" "ec" "ed" "ee" "ef" "f0" "f1" "f2" "f3" "f4" "f5" "f6" "f7" "f8" "f9" "fa" "fb" "fc" "fd" "fe" "ff"; do
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
