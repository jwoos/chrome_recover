document.addEventListener('DOMContentLoaded', () => {
	window.formsafe.popupUtils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});
});
