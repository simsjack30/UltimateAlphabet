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

<div class="flex justify-center mt-8 mx-2 gap-4">
	<button class="variant-filled-tertiary btn rounded-md"><a href="/">Play Again</a></button>
	<button class="btn variant-filled-secondary rounded-md shadow-xl">
		<a href="http://www.mike-wilks.com/index.htm" target="_blank" rel="noreferrer">
			<strong>M</strong>ike <strong>W</strong>ilks
		</a>
	</button>
	<button class="btn variant-filled-error shadow-xl rounded-md">
		<a href="https://jacksims.dev/" target="_blank" rel="noreferrer">jacksims.dev</a>
	</button>
</div>
<div class="m-2 lg:m-4">
	<table class="mx-auto text-left">
		<thead>
			<tr class="">
				<th class="px-2 lg:px-4 py-2">Players Correct (%)</th>
				<th class="px-2 lg:px-4 py-2">Word/Definition</th>
				<th class="px-2 lg:px-4 py-2">Times Guessed</th>
			</tr>
		</thead>
		<tbody>
			{#each allItems as item}
				<tr
					class={guessedItems.find((guessed) => guessed.id === item.id)
						? 'variant-ghost-success'
						: 'variant-soft'}
				>
					<td class="border px-2 lg:px-4 py-1 text-center"
						><strong>{((item.guessed / numberOfPlays) * 100).toFixed(0)}</strong>%</td
					>
					<td class="border px-2 lg:px-4 py-1">
						<span><strong>{item.item}</strong></span>
						<span class="hidden lg:inline">- {item.note}</span>
					</td>
					<td class="border px-2 lg:px-4 py-1 text-center">
						<strong>{item.guessed}</strong>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
