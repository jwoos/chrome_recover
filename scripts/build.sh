#!/usr/bin/env bash

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
	vulcanize --inline-css --inline-scripts --strip-comments "${from}/${file}.html" | \
		crisper --html "${to}/${file}.html" --js "${to}/${file}.js"
done

