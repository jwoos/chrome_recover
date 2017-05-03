# FormSafe

Form recovery extension

### How it works
1. On page load, the content script will run and add an event listener to all *visible* inputs.
	- Further investigation is needed into MutationObserver and see if the performance is good enough to use to get around this.
2. On a change, a debounced function will attempt to save 0.75 seconds after you stopped typing.
	- The exact value and how it works has to be tweaked.
	- Keyed at the root level by hostname and by index in which it is added for children - again this needs tweaking.
		- Ideally a hash generated from attributes.
		- Having the hostname be the top level is nice for working with the data per site but it requires a storage retrieval and then a write of the whole object. There must be a better way to do this.

### Data
```json
{
	"www.google.com": {
		"form-0": "I am some text!"
	}
}
```
