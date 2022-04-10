#!/bin/zsh

echo "[RASTER] Processing raster source files..."

cd .scratch/raster

echo "[RASTER] Prepping raster files..."

for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
	magick convert \
		$prefix'*.source.*' \
		-set filename:basename '%[basename]' \
		-strip \
		-colorspace sRGB \
		-background white \
		-alpha remove \
		-negate \
		-normalize \
		-alpha on \
		-color-matrix "5x5: 0,0,0,0,0 0,0,0,0,0 0,0,0,0,0 0,0,0,0,0 0.2126,0.7152,0.0722,0,0" \
		-trim \
		-define png:compression-level=0 \
		'%[filename:basename].raster.png'
done

echo "[RASTER] Prepped raster files."
{
	echo "[RASTER] Prevectorizing..."
	for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
		magick convert \
			$prefix'*.source.raster.png' \
			-set filename:basename '%[basename]' \
			-background white \
			-alpha remove \
			'%[filename:basename].bmp'
	done
	echo "[RASTER] Prevectorized. Vectorizing..."
	for file in *.source.raster.bmp; do
		dest=$(echo $file |
			sed 's/\.source\.raster\.bmp$/.vector.svg/')
		potrace \
			$file \
			--svg \
			--output $dest
	done
	rm *.source.raster.bmp
	echo "[RASTER] Vectorized."
} &
{
	echo "[RASTER] Creating social media image overlays..."
	for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
		magick convert \
			$prefix'*.source.raster.png' \
			-set filename:basename '%[basename]' \
			-gravity Center \
			-resize 568x568 \
			-background none \
			-extent 568x568 \
			-define png:compression-level=0 \
			'%[filename:basename].overlay.png'
	done
	echo "[RASTER] Created social media image overlays. Creating social media images..."
	for file in *.source.raster.overlay.png; do
		dest=$(echo $file |
			sed 's/\.source\.raster\.overlay\.png$/.social.png/')
		magick composite \
			-geometry +562+30 \
			-define png:compression-level=9 \
			$file \
			../../graphics/social-media-base.png \
			$dest
	done
	rm *.source.raster.overlay.png
	echo "[RASTER] Created social media images."
} &
{
	echo "[RASTER] Creating thumbnail images..."
	for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
		magick convert \
			$prefix'*.source.raster.png' \
			-set filename:basename '%[basename]' \
			-gravity South \
			-resize 192x192 \
			-background none \
			-extent 192x192 \
			-define png:compression-level=9 \
			'%[filename:basename].thumbnail.192.png' &
		magick convert \
			$prefix'*.source.raster.png' \
			-set filename:basename '%[basename]' \
			-gravity South \
			-resize 128x128 \
			-background none \
			-extent 128x128 \
			-define png:compression-level=9 \
			'%[filename:basename].thumbnail.128.png' &
		magick convert \
			$prefix'*.source.raster.png' \
			-set filename:basename '%[basename]' \
			-gravity South \
			-resize 64x64 \
			-background none \
			-extent 64x64 \
			-define png:compression-level=9 \
			'%[filename:basename].thumbnail.64.png'
		wait
	done
	echo "[RASTER] Created thumbnail images."
} &
{
	echo "[RASTER] Preparing raster variants..."
	for file in *.source.raster.png; do
		width=$(magick identify -format "%[width]" $file)
		height=$(magick identify -format "%[height]" $file)
		size=$(($width > $height ? $width : $height))
		{
			dest=$(echo $file |
				sed 's/\.source\.raster\./.variant.original./')
			cp -f $file $dest
		} &
		if [[ $size -gt 1536 ]]; then
			dest=$(echo $file |
				sed 's/\.source\.raster\./.variant.1536./')
			cp -f $file $dest
		fi &
		if [[ $size -gt 1024 ]]; then
			dest=$(echo $file |
				sed 's/\.source\.raster\./.variant.1024./')
			cp -f $file $dest
		fi &
		if [[ $size -gt 512 ]]; then
			dest=$(echo $file |
				sed 's/\.source\.raster\./.variant.512./')
			cp -f $file $dest
		fi &
		wait
	done
	echo "[RASTER] Prepared raster variants. Mogrifying raster variants..."
	for prefix in 0 1 2 3 4 5 6 7 8 9 a b c d e f; do
		magick mogrify \
			-define png:compression-level=9 \
			$prefix'*.variant.original.png' &
		magick mogrify \
			-resize 1536x1536 \
			-define png:compression-level=9 \
			$prefix'*.variant.1536.png' &
		magick mogrify \
			-resize 1024x1024 \
			-define png:compression-level=9 \
			$prefix'*.variant.1024.png' &
		magick mogrify \
			-resize 512x512 \
			-define png:compression-level=9 \
			$prefix'*.variant.512.png'
		wait
	done	
	echo "[RASTER] Mogrified raster variants."
} &
wait

echo "[RASTER] Cleaning up raster bases..."
rm *.source.raster.png
cd ../..

echo "[RASTER] Cleaned up raster bases. Making S3 mirror folders..."
for file in .scratch/raster/*.source.(bmp|gif|jpg|png); do
	dir=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.source\..*$//')
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

echo "[RASTER] Made S3 mirror folders. Moving files to S3 mirror..."
for file in .scratch/raster/*.source.(bmp|gif|jpg|png); do
	dest=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.source\./\/source./')
	mv -f $file $dest
done &
for file in .scratch/raster/*.vector.svg; do
	dest=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.vector\.svg$/\/vector.svg/')
	mv -f $file $dest
done &
for file in .scratch/raster/*.source.raster.thumbnail.*.png; do
	size=$(magick identify -format "%[fx:w]x%[fx:h]" $file)
	dest=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.source\.raster\.thumbnail\..*\.png$/\/thumbnail\/'$size'.png/')
	mv -f $file $dest
done &
for file in .scratch/raster/*.variant.*.png; do
	size=$(magick identify -format "%[fx:w]x%[fx:h]" $file)
	dest=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.variant\..*\.png$/\/raster\/'$size'.png/')
	mv -f $file $dest
done &
for file in .scratch/raster/*.social.png; do
	size=$(magick identify -format "%[fx:w]x%[fx:h]" $file)
	dest=$(echo $file |
		sed 's/^\.scratch\/raster\//.s3\/images.phylopic.org\/images\//' |
		sed 's/\.social\.png$/\/social\/'$size'.png/')
	mv -f $file $dest
done &
wait

echo "[RASTER] Moved files to S3 mirror."

echo "[RASTER] Processed raster source files."
