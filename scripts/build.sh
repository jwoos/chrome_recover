#!/usr/bin/env bash

if ! type vulcanize > /dev/null; then
	echo "MISSING VULCANIZE - install with 'npm install -g vulcanize'"
	exit 1
elif ! type crisper > /dev/null; then
	echo "MISSING CRISPER - install with 'npm install -g crisper'"
	exit 1
fi

tobuild=""
env=""
from="src"
env=""

if [[ $1 == "popup" ]]; then
	tobuild=("popup")
elif [[ $1 == "options" ]]; then
	tobuild=("options")
elif [[ $1 == "" ]] || [[ $1 == "all" ]]; then
	tobuild=("popup" "options")
fi

if [[ $# -lt 2 ]] || [[ $2 == "srv" ]]; then
	env="srv"
elif [[ $2 == "dist" ]]; then
	env="dist"
fi

# try to create path
mkdir -p build/${env}/scripts/

for file in "${tobuild[@]}"; do
	vulcanize --inline-scripts --strip-comments --exclude "src/scripts/" "${from}/${file}.html" |\
		crisper --html "build/${env}/${file}.html" --js "build/${env}/scripts/${file}.csp.js" --only-split

	temp=("${PIPESTATUS[@]}")
	if [ ${temp[0]} -ne 0 ]; then
		echo "VULCANIZE FAILED WITH STATUS ${temp[0]}"
		exit 1
	elif [ ${temp[1]} -ne 0 ]; then
		echo "CRISPER FAILED WITH STATUS ${temp[0]}"
		exit 1
	fi
done

