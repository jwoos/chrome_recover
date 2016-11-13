document.addEventListener('DOMContentLoaded', () => {
	getCurrentTabUrl().then((url) => {
		document.querySelector('div').textContent = url;
	})
});
