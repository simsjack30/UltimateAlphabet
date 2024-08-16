<script lang="ts">
	let zoomedPanel;

	function handleMouseMove(event) {
		const { offsetX, offsetY, target } = event;
		const { width, height } = target.getBoundingClientRect();
		const xPercent = (offsetX / width) * 100;
		const yPercent = (offsetY / height) * 100;

		zoomedPanel.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
		zoomedPanel.style.left = `${event.pageX - 100}px`;
		zoomedPanel.style.top = `${event.pageY - 100}px`;
	}

	function handleMouseEnter() {
		zoomedPanel.style.display = 'block';
	}

	function handleMouseLeave() {
		zoomedPanel.style.display = 'none';
	}
</script>

<div class="image-container" on:mousemove={handleMouseMove} on:mouseenter={handleMouseEnter}>
	<img src="wilks2.jpg" alt="" class="fixed top-0 left-0 -z-10 h-screen" />

	<div id="zoomed-panel" bind:this={zoomedPanel} style="background-image: url('wilks2.jpg');"></div>
</div>

<style>
	.image-container {
		position: relative;
		display: inline-block;
		cursor: none;
	}

	#zoomed-panel {
		display: none;
		position: absolute;
		width: 400px;
		height: 400px;
		border: 4px solid #000;
		border-radius: 50%;
		overflow: hidden;
		background-repeat: no-repeat;
		background-size: 500%;
		pointer-events: none;
		z-index: 100;
	}
</style>
