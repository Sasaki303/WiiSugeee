const DB_NAME = "wiislide";
const DB_VERSION = 1;
const STORE_NAME = "assets";

function openDb(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

export async function putAssetBlob(assetId: string, blob: Blob): Promise<void> {
	const db = await openDb();
	await new Promise<void>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readwrite");
		tx.oncomplete = () => {
			db.close();
			resolve();
		};
		tx.onerror = () => {
			db.close();
			reject(tx.error);
		};
		tx.objectStore(STORE_NAME).put(blob, assetId);
	});
}

export async function getAssetBlob(assetId: string): Promise<Blob | null> {
	const db = await openDb();
	return await new Promise<Blob | null>((resolve, reject) => {
		const tx = db.transaction(STORE_NAME, "readonly");
		tx.oncomplete = () => {
			db.close();
		};
		tx.onerror = () => {
			db.close();
			reject(tx.error);
		};
		const req = tx.objectStore(STORE_NAME).get(assetId);
		req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
		req.onerror = () => reject(req.error);
	});
}
