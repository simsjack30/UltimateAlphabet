<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation'; // Import navigation function from SvelteKit

	// Retrieve the modal store
	const modalStore = getModalStore();

	function openConfirmModal() {
		const modal: ModalSettings = {
			type: 'confirm',
			title: 'Please Confirm',
			body: 'Are you sure you wish to proceed to the results page?',
			response: (confirmed: boolean) => {
				if (confirmed) {
					// If confirmed, navigate to /results
					goto('/results');
				}
			}
		};

		// Trigger the confirm modal
		modalStore.trigger(modal);
	}
</script>

<!-- A simple button to trigger the modal -->
<button on:click={openConfirmModal} class="btn btn-primary">Open Confirm Modal</button>
