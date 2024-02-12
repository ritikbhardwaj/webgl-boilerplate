export function runUtils(canvasRef) {
	const div = document.createElement('div');
	const mousePosDiv = document.querySelector('#mousepos');
	mousePosDiv.innerHTML = '';
	const containerDiv = document.querySelector('#container');
	canvasRef.addEventListener('click', (e) => {
		const { clientX, clientY } = e;
		mousePosDiv.innerHTML = `<p>${clientX}, ${clientY}</p>`;
		mousePosDiv.style.top = `${clientY}px`;
		mousePosDiv.style.left = `${clientX}px`;
	});
	document.addEventListener('keypress', (e) => {
		if(e.key === 'c') {
			mousePosDiv.innerHTML = '';
		}
	});
}