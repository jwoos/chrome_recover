document.addEventListener('DOMContentLoaded', () => {
	window.popupUtils.getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	});
});
