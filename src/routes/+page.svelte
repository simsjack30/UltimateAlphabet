<script lang="ts">
	import PocketBase from 'pocketbase';
	import { guessedItemsStore } from './store.js';
	import { get } from 'svelte/store';

	import { Check, SearchX, SearchCheck, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { goto } from '$app/navigation';

	import { RangeSlider } from '@skeletonlabs/skeleton';

	const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');
	export let data;

	let records = [...data.records];
	let searchTerm = '';
	let guessedItems = [];
	let game = true;

	$: guessedItemsStore.set(guessedItems);

	function normalizeString(str: any) {
		return str.toLowerCase().replace(/[^a-z0-9]/gi, '');
	}

	function handleGuess() {
		const normalizedSearchTerm = normalizeString(searchTerm);
		const matchedRecords = records.filter(
			(record) => normalizeString(record.item) === normalizedSearchTerm
		);
		if (matchedRecords.length > 0) {
			if (game) {
				game = false;
				updateGame();
				startTimer();
			}
			for (let record of matchedRecords) {
				updateGuess(record);
			}
			guessedItems = [...guessedItems, ...matchedRecords];
			records = records.filter((record) => !matchedRecords.includes(record));
			searchTerm = '';
		}
	}

	async function updateGame() {
		const plays = await getPlays();
		await pb.collection('Plays').update('ckzbth2g0egxm4u', { count: plays + 1 });
	}

	async function getPlays() {
		const plays = await pb.collection('Plays').getOne('ckzbth2g0egxm4u');
		return plays.count;
	}

	async function updateGuess(record: any) {
		await pb.collection('Items').update(record.id, { guessed: record.guessed + 1 });
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
		if (magnifierY + magnifier.offsetHeight > height) magnifierY = height - magnifier.offsetHeight;

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

	function handleGlobalMouseMove(event: any) {
		handleMouseMove(event);
	}

	function handleClick() {
		mag = !mag;
		if (mag) {
			magnifier.style.display = 'block';
		}
	}

	let timerInterval: any;

	onMount(() => {
		guessedItemsStore.set([]);
		guessedItems = get(guessedItemsStore);
		timeRemaining = 5 * 60; // 5 * 60
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		if (mag) {
			const img = document.querySelector('.image-container img');
			if (img) {
				const { left, top, width, height } = img.getBoundingClientRect();

				const fakeEvent = {
					clientX: left + width / 2,
					clientY: top + height / 2
				};

				handleMouseMove(fakeEvent);
			}
		}
	});

	let value = 500;

	let timeRemaining: any = 5 * 60;
	let minutes = Math.floor(timeRemaining / 60);
	let seconds = timeRemaining % 60;

	function startTimer() {
		timerInterval = setInterval(() => {
			timeRemaining--;
			minutes = Math.floor(timeRemaining / 60);
			seconds = timeRemaining % 60;

			if (timeRemaining <= 0) {
				clearInterval(timerInterval);
				goto('/results');
			}
		}, 1000);
	}

	let showModal = false;

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function goToResults() {
		if (timerInterval) {
			clearInterval(timerInterval);
		}
		goto('/results');
	}

	let minValue = 300;
	let maxValue = 1200;
	let stepValue = 5;

	function handleWheel(event) {
		event.preventDefault();

		if (event.deltaY < 0) {
			value = Math.min(value + 10 * stepValue, maxValue);
		} else {
			value = Math.max(value - 10 * stepValue, minValue);
		}
	}
</script>

<svelte:window on:wheel={handleWheel} />

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

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="p-2 md:p-4 h-auto md:h-full" on:click={handleClick}>
		<div class="md:h-full max-h-full image-container">
			<img
				src="wilks2.jpg"
				alt=""
				class="rounded-lg max-h-full w-auto object-top object-contain shadow-lg {mag
					? 'cursor-none'
					: 'cursor-zoom-in'}"
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
				class="icon btn {mag ? 'variant-ghost' : 'variant-filled-secondary'} rounded-md shadow-xl"
				on:click={handleClick}
			>
				{#if mag}
					<SearchX />
				{:else}
					<SearchCheck />
				{/if}
			</button>
			<div>
				{#if mag}
					<div transition:fade>
						<RangeSlider bind:value min={minValue} max={maxValue} step={stepValue} class="w-64" />
					</div>
				{/if}
			</div>
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
				<span>
					Find as many words in the picture that start with
					<span />
					<span class="text-error-300"> The Letter J </span>
					<span>
						. Type your answers in the box and submit by pressing Enter or the checkmark button.
					</span>
				</span>
			</h5>
			<h5 class="w-5/6 h5 md:w-1/2 lg:w-96">
				You can choose to end the game early or continue guessing until the time runs out.
			</h5>
		{:else}
			<div class="flex flex-row gap-2 md:gap-4">
				<button class="btn variant-filled-error rounded-md shadow-xl" on:click={openModal}
					>DONE</button
				>
				<h2 class="h2">{minutes}:{seconds < 10 ? '0' : ''}{seconds}</h2>
			</div>
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

{#if showModal}
	<div class="fixed top-0 left-0 bg-black opacity-80 w-screen h-screen z-[500]"></div>
	<div
		class="w-screen h-screen z-[999] fixed top-0 left-0 flex flex-col justify-center items-center gap-4"
	>
		<h2 class="h2">Submit and proceed to the results?</h2>
		<div class="flex flex-row gap-4">
			<button on:click={closeModal} class="btn variant-filled rounded-md btn-lg"
				><strong>Close</strong></button
			>
			<button on:click={goToResults} class="btn variant-filled-error rounded-md btn-lg"
				><strong>Results</strong></button
			>
		</div>
	</div>
{/if}

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
