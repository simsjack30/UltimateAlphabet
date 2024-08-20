import PocketBase from 'pocketbase';
const pb = new PocketBase('https://pocketbase-production-c5bc.up.railway.app');

export async function load() {
	const record = await pb.collection('Items').getFullList();
	const record2 = await pb.collection('Items2').getFullList();
	return { records: record, records2: record2 };
}
