# FormSafe
Form recovery extension

### How it works
1. On page load, the content script will run and add an event listener to all *visible* inputs.
	- Further investigation is needed into MutationObserver and see if the performance is good enough to use to get around this.
2. On a change, a debounced function will attempt to save one second after you stopped typing.
	- The exact value and how it works has to be tweaked.
	- It is keyed on the index in which it is added - again this needs tweaking.
		- Ideally a hash generated from attributes. It should also be keyed at the root level with domains.
