<script lang="ts">
	import PocketBase from 'pocketbase';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { Check } from 'lucide-svelte';

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

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};
</script>

<div
	class="flex flex-col lg:justify-between items-center lg:items-start w-full h-screen lg:flex-row-reverse"
>
	<div class="lg:hidden flex flex-row gap-4 pt-2 md:pt-4 items-center">
		<button class="btn variant-filled-secondary rounded-md shadow-xl">
			<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer"
				><strong>M</strong>ike <strong>W</strong>ilks</a
			>
		</button>
		<h3 class="h3 whitespace-nowrap">Ultimate Alphabet</h3>
	</div>
	<div class="p-2 md:p-4 lg:h-full max-h-full">
		<img
			src="wilks2.jpg"
			alt=""
			class="rounded-lg max-h-full w-auto object-top object-contain shadow-lg"
		/>
	</div>
	<div
		class="flex flex-col m-2 md:m-4 w-full lg:w-auto lg:items-start lg:justify-start items-center gap-4"
	>
		<div class="hidden lg:flex flex-row gap-4 items-center">
			<button class="btn variant-filled-secondary shadow-xl rounded-md">
				<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer"
					><strong>M</strong>ike <strong>W</strong>ilks</a
				>
			</button>
			<h3 class="h3 whitespace-nowrap">Ultimate Alphabet</h3>
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
	}

	.magnifier {
		display: none;
		position: absolute;
		width: 150px;
		height: 150px;
		border-radius: 50%;
		border: 3px solid rgba(0, 0, 0, 0.5);
		background-repeat: no-repeat;
		background-size: 200%; /* This controls the zoom level */
		pointer-events: none; /* Prevent it from interfering with other events */
		z-index: 100;
	}
</style>
