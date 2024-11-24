#!/bin/sh

set -eu

BUILD="build"
CMD=${1:-}

if [ "$CMD" = "clean" ]; then
	rm -rf $BUILD
	exit 0
elif [ "$CMD" = "serve" ]; then
	find src/ | entr -rs "jelly -i src -o $BUILD && python3 -m http.server -d $BUILD 4000"
	exit 0
else
	echo "Invalid command '$CMD', Available commands are: clean/serve/release."
	exit 1
fi
