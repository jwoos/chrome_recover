'use strict';

Polymer({
	is: 'poly-test',
	properties: {
		prop1: {
			type: String,
			value: 'poly-test',
		},
	},
	ready: function() {
		console.log(this);
	}
});
