<!-- <script lang="ts">
	import PocketBase from 'pocketbase';
	import { onMount } from 'svelte';
	const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');

	async function loadWords() {
		const response = await fetch('src/routes/words2.txt');
		const text = await response.text();
		const items = text
			.split('\n')
			.map((line) => {
				const firstCommaIndex = line.indexOf(',');
				let item = line;
				let note = '';

				if (firstCommaIndex !== -1) {
					item = line.slice(0, firstCommaIndex).trim();
					note = line.slice(firstCommaIndex + 1).trim();
				}

				return { item, note };
			})
			.filter((entry) => entry.item !== '');

		return items;
	}

	async function initDatabase(items) {
		for (const { item, note } of items) {
			const record = {
				item: item,
				note: note,
				guessed: 0
			};
			await pb.collection('Items2').create(record);
		}
	}

	onMount(async () => {
		const items = await loadWords();
		await initDatabase(items);
	});
</script> -->
