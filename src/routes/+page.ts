import PocketBase from 'pocketbase';
const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');

export async function load() {
	const record = await pb.collection('Items').getFullList();
	return { records: record };
}
