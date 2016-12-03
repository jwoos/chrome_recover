#!/usr/bin/env bash

# clean
if [ -d dist/ ]; then
	rm -r dist/
fi

gulp dist
