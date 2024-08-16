<script lang="ts">
	let scale = 1;
	let originX = 0;
	let originY = 0;
	let startX = 0;
	let startY = 0;
	let isPanning = false;

	function handleWheel(event) {
		event.preventDefault();
		const zoomIntensity = 0.1;
		scale += event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
	}

	function handleMouseDown(event) {
		isPanning = true;
		startX = event.clientX - originX;
		startY = event.clientY - originY;
	}

	function handleMouseMove(event) {
		if (!isPanning) return;
		originX = event.clientX - startX;
		originY = event.clientY - startY;
	}

	function handleMouseUp() {
		isPanning = false;
	}
</script>

<div
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:mouseleave={handleMouseUp}
	on:wheel={handleWheel}
	style="overflow: hidden; width: 100vw; height: 100vh; cursor: grab;"
>
	<img
		src="wilks2.jpg"
		alt="Image"
		style="transform: scale({scale}) translate({originX}px, {originY}px); transform-origin: top left;"
	/>
</div>

<style>
	img {
		display: block;
		user-select: none;
	}
</style>
