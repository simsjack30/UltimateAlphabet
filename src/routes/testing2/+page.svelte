<script lang="ts">
	import { panzoom } from 'svelte-pan-zoom';

	// Load the image directly
	let image = new Image();
	image.src = 'wilks2.jpg';

	function render(ctx: CanvasRenderingContext2D, t: number) {
		ctx.drawImage(image, 0, 0);
	}

	const options = {
		render,
		friction: 0
	};
</script>

<div class="h-screen">
	<canvas use:panzoom={options} />
</div>

<style>
	canvas {
		box-sizing: border-box;
		width: 30%;
		height: 30%;
		user-select: none;
		background-color: aliceblue;
		touch-action: none;
		overscroll-behavior: none;
		-webkit-user-select: none; /* disable selection/Copy of UIWebView */
		-webkit-touch-callout: none; /* disable the IOS popup when long-press on a link */
	}
</style>
