'use strict';

const utils = window.FORMSAFE.utils;

document.addEventListener('DOMContentLoaded', () => {
	utils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});
});
