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
to=""

if [[ $1 == "popup" ]]; then
	tobuild=("popup")
elif [[ $1 == "options" ]]; then
	tobuild=("options")
elif [[ $1 == "" ]] || [[ $1 == "all" ]]; then
	tobuild=("popup" "options")
fi

if [[ $# -lt 2 ]] || [[ $2 == "srv" ]]; then
	env="srv"
	to="tmp"
elif [[ $2 == "dist" ]]; then
	env="dist"
	to="dist"
fi

for file in "${tobuild[@]}"; do
	vulcanize --inline-scripts --strip-comments --exclude "src/scripts/" "${from}/${file}.html" |\
		crisper --html "${to}/${file}.html" --js "${to}/${file}.js"

	temp=("${PIPESTATUS[@]}")
	if [ ${temp[0]} -ne 0 ]; then
		echo "VULCANIZE FAILED WITH STATUS ${temp[0]}"
		exit 1
	elif [ ${temp[1]} -ne 0 ]; then
		echo "CRISPER FAILED WITH STATUS ${temp[0]}"
		exit 1
	fi
done

