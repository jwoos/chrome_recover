document.addEventListener('DOMContentLoaded', () => {
	console.log(window.formsafe);
	window.formsafe.utils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});
});
