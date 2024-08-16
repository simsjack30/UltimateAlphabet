<script lang="ts">
	import PocketBase from 'pocketbase';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Check, SearchX, SearchCheck, Search } from 'lucide-svelte';

	const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');
	export let data;

	let records = [...data.records]; // Create a copy of data.records
	let searchTerm = '';
	let guessedItems = [];

	function normalizeString(str) {
		return str.toLowerCase().replace(/[^a-z0-9]/gi, '');
	}

	$: filteredRecords = records.filter((record) =>
		normalizeString(record.item).includes(normalizeString(searchTerm))
	);

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

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			handleGuess();
		}
	}

	let magnifier;
	let isInsideImage = false;
	let mag = true;

	function handleMouseEnter() {
		isInsideImage = true;
		magnifier.style.display = 'block';
	}

	function handleMouseMove(event) {
		if (mag) {
			const img = document.querySelector('.image-container img'); // Get the image element
			const { top, left, width, height } = img.getBoundingClientRect();
			let x = event.clientX - left;
			let y = event.clientY - top;

			// Update the background position percentages for the zoomed background
			let xPercent = (x / width) * 100;
			let yPercent = (y / height) * 100;

			// Constrain magnifier within the image for x-axis and y-axis
			let magnifierX = x - magnifier.offsetWidth / 2;
			let magnifierY = y - magnifier.offsetHeight / 2;

			if (magnifierX < 0) magnifierX = 0;
			if (magnifierX + magnifier.offsetWidth > width) magnifierX = width - magnifier.offsetWidth;
			if (magnifierY < 0) magnifierY = 0;
			if (magnifierY + magnifier.offsetHeight > height)
				magnifierY = height - magnifier.offsetHeight;

			// Ensure that the magnifier moves freely but the background image position stops when leaving the image
			if (x < 0 || x > width) {
				xPercent = x < 0 ? 0 : 100; // Lock the background to the edges horizontally
			}
			if (y < 0 || y > height) {
				yPercent = y < 0 ? 0 : 100; // Lock the background to the edges vertically
			}

			// Position the magnifier
			magnifier.style.left = `${magnifierX}px`;
			magnifier.style.top = `${magnifierY}px`;

			// Update the zoomed-in background image position, locking it when outside
			magnifier.style.backgroundImage = `url('${img.src}')`;
			magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
		}
	}

	function handleGlobalMouseMove(event) {
		handleMouseMove(event);
	}

	function handleClick() {
		mag = !mag;
		if (mag) {
			magnifier.style.display = 'block';
		}
	}
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

	<div class="p-2 md:p-4 h-full">
		<div class="lg:h-full max-h-full image-container">
			<img
				src="wilks2.jpg"
				alt=""
				class="rounded-lg max-h-full w-auto object-top object-contain shadow-lg {mag
					? 'cursor-none'
					: 'cursor-auto'}"
			/>
			<div class="hidden lg:flex">
				{#if mag}
					<div bind:this={magnifier} class="magnifier rounded-lg"></div>
				{/if}
			</div>
		</div>
	</div>

	<div
		class="flex flex-col m-2 md:m-4 w-full lg:w-[40rem] lg:items-start lg:justify-start items-center gap-4"
	>
		<div class="hidden lg:flex flex-row gap-4 items-center">
			<button class="btn variant-filled-secondary shadow-xl rounded-md">
				<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer"
					><strong>M</strong>ike <strong>W</strong>ilks</a
				>
			</button>
			<h3 class="h3 whitespace-nowrap">Ultimate Alphabet</h3>
		</div>

		<div class="lg:flex hidden">
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
				and submit by pressing Enter or the submit button. Time starts when you make your first
				successful guess.
			</h5>
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

<!-- // async function loadWords() {
	// 	const response = await fetch('src/routes/words.txt'); // Adjust the path as necessary
	// 	const text = await response.text();
	// 	const items = text
	// 		.split('\n')
	// 		.map((line) => {
	// 			const firstCommaIndex = line.indexOf(',');
	// 			let item = line;
	// 			let note = '';

	// 			if (firstCommaIndex !== -1) {
	// 				item = line.slice(0, firstCommaIndex).trim();
	// 				note = line.slice(firstCommaIndex + 1).trim();
	// 			}

	// 			return { item, note };
	// 		})
	// 		.filter((entry) => entry.item !== '');

	// 	return items;
	// }

	// async function initDatabase(items) {
	// 	for (const { item, note } of items) {
	// 		const record = {
	// 			item: item,
	// 			note: note,
	// 			guessed: 0
	// 		};
	// 		await pb.collection('Items').create(record);
	// 	}
	// }

	// onMount(async () => {
	// 	const items = await loadWords();
	// 	await initDatabase(items);
	// }); -->

<style>
	.image-container {
		position: relative;
		display: inline-block;
		overflow: hidden;
	}

	.magnifier {
		display: none;
		position: absolute;
		width: 300px;
		height: 300px;
		border: 4px solid rgba(0, 0, 0, 0.5);
		background-repeat: no-repeat;
		background-size: 500%;
		pointer-events: none;
		z-index: 100;
	}
</style>
