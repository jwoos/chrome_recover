# FormSafe
[![Build Status](https://travis-ci.org/jwoos/formsafe.svg?branch=master)](https://travis-ci.org/jwoos/formsafe)
[![Dependency Status](https://dependencyci.com/github/jwoos/formsafe/badge)](https://dependencyci.com/github/jwoos/formsafe)
[![Coverage Status](https://coveralls.io/repos/github/jwoos/formsafe/badge.svg?branch=master)](https://coveralls.io/github/jwoos/formsafe?branch=master)

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
