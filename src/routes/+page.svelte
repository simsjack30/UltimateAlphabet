<script lang="ts">
	import PocketBase from 'pocketbase';
	import { Check, SearchX, SearchCheck, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { RangeSlider } from '@skeletonlabs/skeleton';

	const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');
	export let data;

	let records = [...data.records]; // Create a copy of data.records
	let searchTerm = '';
	let guessedItems: any = [];

	function normalizeString(str: any) {
		return str.toLowerCase().replace(/[^a-z0-9]/gi, '');
	}

	function handleGuess() {
		const normalizedSearchTerm = normalizeString(searchTerm);
		const matchedRecords = records.filter(
			(record) => normalizeString(record.item) === normalizedSearchTerm
		);

		if (matchedRecords.length > 0) {
			guessedItems = [...guessedItems, ...matchedRecords];
			records = records.filter((record) => !matchedRecords.includes(record));
			searchTerm = '';
		}
	}

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			handleGuess();
		}
	}

	let magnifier: any;
	let isInsideImage = false;
	let mag = true;

	function handleMouseEnter() {
		if (mag) {
			isInsideImage = true;
			magnifier.style.display = 'block';
		}
	}

	function handleMouseMove(event: any) {
		if (mag) {
			const img = document.querySelector('.image-container img');
			const { top, left, width, height } = img.getBoundingClientRect();
			let x = event.clientX - left;
			let y = event.clientY - top;

			let xPercent = (x / width) * 100;
			let yPercent = (y / height) * 100;

			let magnifierX = x - magnifier.offsetWidth / 2;
			let magnifierY = y - magnifier.offsetHeight / 2;

			if (magnifierX < 0) magnifierX = 0;
			if (magnifierX + magnifier.offsetWidth > width) magnifierX = width - magnifier.offsetWidth;
			if (magnifierY < 0) magnifierY = 0;
			if (magnifierY + magnifier.offsetHeight > height)
				magnifierY = height - magnifier.offsetHeight;

			if (x < 0 || x > width) {
				xPercent = x < 0 ? 0 : 100;
			}
			if (y < 0 || y > height) {
				yPercent = y < 0 ? 0 : 100;
			}

			magnifier.style.left = `${magnifierX}px`;
			magnifier.style.top = `${magnifierY}px`;

			magnifier.style.backgroundImage = `url('${img.src}')`;
			magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
		}
	}

	function handleGlobalMouseMove(event: any) {
		handleMouseMove(event);
	}

	function handleClick() {
		mag = !mag;
		if (mag) {
			magnifier.style.display = 'block';
		}
	}

	onMount(() => {
		if (mag) {
			const img = document.querySelector('.image-container img');
			if (img) {
				const { left, top, width, height } = img.getBoundingClientRect();

				// Simulate a mouse movement to the center of the image
				const fakeEvent = {
					clientX: left + width / 2,
					clientY: top + height / 2
				};

				handleMouseMove(fakeEvent); // Call the existing function with synthetic values
			}
		}
	});

	let value = 500;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="flex flex-col lg:justify-between xl:justify-evenly items-center lg:items-start w-full h-screen lg:flex-row-reverse"
	on:mousemove={handleGlobalMouseMove}
	on:mouseenter={handleMouseEnter}
>
	<div class="lg:hidden flex flex-row gap-4 pt-2 md:pt-4 items-center">
		<button class="btn variant-filled-secondary rounded-md shadow-xl">
			<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer">
				<strong>M</strong>ike <strong>W</strong>ilks
			</a>
		</button>
		<h3 class="h3 whitespace-nowrap">Ultimate Alphabet</h3>
	</div>

	<div class="p-2 md:p-4 h-auto md:h-full">
		<div class="md:h-full max-h-full image-container">
			<img
				src="wilks2.jpg"
				alt=""
				class="rounded-lg max-h-full w-auto object-top object-contain shadow-lg {mag
					? 'cursor-none'
					: 'cursor-auto'}"
			/>
			<div class="hidden lg:flex">
				<div class={mag ? 'flex' : 'hidden'}>
					<div
						style="background-size:{value}%"
						bind:this={magnifier}
						class="magnifier rounded-lg"
					></div>
				</div>
			</div>
		</div>
	</div>

	<div
		class="flex flex-col m-2 md:m-4 w-full lg:w-[30rem] lg:items-start lg:justify-start items-center gap-4"
	>
		<div class="hidden lg:flex flex-row gap-4 items-center">
			<button class="btn variant-filled-secondary shadow-xl rounded-md">
				<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer"
					><strong>M</strong>ike <strong>W</strong>ilks</a
				>
			</button>
			<h3 class="h3 whitespace-nowrap">Ultimate Alphabet</h3>
		</div>

		<div class="lg:flex hidden flex-row items-center gap-4">
			<button
				class="icon btn {mag ? 'variant-ghost' : 'variant-filled-secondary'} rounded-md"
				on:click={handleClick}
			>
				{#if mag}
					<SearchX />
				{:else}
					<SearchCheck />
				{/if}
			</button>
			<RangeSlider bind:value min={400} max={1000} step={5} class="w-64 {mag ? '' : 'hidden'} "
			></RangeSlider>
		</div>

		<div class="flex flex-row gap-2 md:gap-4">
			<input
				class="flex input rounded-lg w-64 variant-filled shadow-xl"
				type="text"
				bind:value={searchTerm}
				placeholder="Enter Guess Here"
				on:keydown={handleKeyDown}
			/>
			<button on:click={handleGuess} class="btn-icon variant-filled-tertiary shadow-xl rounded-md"
				><Check /></button
			>
		</div>
		{#if guessedItems.length === 0}
			<h5 class="w-5/6 h5 md:w-1/2 lg:w-96">
				Find as many words in the picture that start with the letter J. Type your answers in the box
				and submit by pressing Enter or the submit button.
			</h5>
			<!-- Time starts when you make your first
				successful guess. -->
		{/if}
		<div class="flex justify-start items-start">
			<ul
				class="px-2 pb-2 md:p-4 lg:m-auto lg:p-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-x-2 md:gap-x-4 lg:gap-x-6 gap-y-2"
			>
				{#each guessedItems.slice().reverse() as guessed}
					<li class="px-2 py-1 rounded variant-ghost">
						<strong>{guessed.item}</strong> - {guessed.note}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	.image-container {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.magnifier {
		position: absolute;
		width: 300px;
		height: 300px;
		border: 4px solid rgba(0, 0, 0, 0.5);
		background-repeat: no-repeat;
		pointer-events: none;
		z-index: 100;
	}
</style>
