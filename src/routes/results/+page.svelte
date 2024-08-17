<script lang="ts">
	import { guessedItemsStore } from '../store';
	import { get } from 'svelte/store';
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';

	const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');

	let guessedItems = get(guessedItemsStore);

	let allItems = [];
	let numberOfPlays;

	async function loadItems() {
		// Fetch all items
		allItems = await pb.collection('Items').getFullList();

		// Sort items by the number of times guessed (descending order)
		allItems.sort((a, b) => b.guessed - a.guessed);

		const playsRecord = await pb.collection('Plays').getOne('ckzbth2g0egxm4u');
		numberOfPlays = playsRecord.count;
	}

	onMount(() => {
		loadItems();
	});
</script>

<div class="flex justify-center m-4">
	<button class="variant-filled-secondary btn rounded-md"><a href="/">Play Again</a></button>
</div>
{#each allItems as item}
	<div class="flex justify-center items-center w-full">
		<div
			class=" m-1 p-1 px-2 rounded-md w-11/12 lg:w-1/2 xl:w-1/3
			{guessedItems.find((guessed) => guessed.id === item.id)
				? 'variant-ghost-success'
				: 'variant-ghost'}"
		>
			<strong>{item.item}</strong> - {item.note} (Guessed: {item.guessed} times) - {(
				(item.guessed / numberOfPlays) *
				100
			).toFixed(2)}%
		</div>
	</div>
{/each}
