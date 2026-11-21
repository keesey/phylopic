#!/bin/zsh

# Return dimensions only when the PNG contains at least one nontransparent pixel.
inspect_png() {
    local inspection
    # Reuse the dimensions lookup: one decode, with a native alpha-range reduction.
    # -alpha set treats images without alpha as opaque and also handles PNG tRNS.
    if ! inspection=$(LC_ALL=C magick identify -regard-warnings -alpha set -channel A -format '%wx%h %[max]\n' "$1"); then
        print -ru2 -- "Could not inspect PNG: $1"
        return 1
    fi

    local -a values
    values=(${=inspection})
    if (( ${#values} != 2 )) ||
        [[ ! $values[1] =~ '^[1-9][0-9]*x[1-9][0-9]*$' ]] ||
        [[ ! $values[2] =~ '^[0-9]+([.][0-9]+)?([eE][+-]?[0-9]+)?$' ]]; then
        print -ru2 -- "Invalid PNG inspection result: $1"
        return 1
    fi
    if (( values[2] == 0 )); then
        print -ru2 -- "Fully transparent PNG: $1"
        return 1
    fi
    print -r -- "$values[1]"
}
