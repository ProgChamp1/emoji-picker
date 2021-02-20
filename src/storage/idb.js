const FALLBACK_LOCAL_STORAGE_KEY = "___idbfallback";

const fallbackGet = (k) => {
  const item = localStorage.getItem(FALLBACK_LOCAL_STORAGE_KEY);
  return item ? JSON.parse(item)[k] : void 0;
};
const fallbackSet = (key, value) => {
  const item = localStorage.getItem(FALLBACK_LOCAL_STORAGE_KEY);
  const js = item ? JSON.parse(item) : {};
  js[key] = value;
  localStorage.setItem(FALLBACK_LOCAL_STORAGE_KEY, JSON.stringify(js));
};
export class WebStore {
  constructor(dbName = "keyval-store", storeName = "keyval") {
    this.storeName = storeName;
    this._dbp = new Promise((resolve, reject) => {
      const openreq = indexedDB.open(dbName, 1);
      openreq.onerror = () => reject(openreq.error);
      openreq.onsuccess = () => resolve(openreq.result);
      openreq.onupgradeneeded = () =>
        void openreq.result.createObjectStore(storeName);
    });
  }
  __IDBAct__(type, callback) {
    return this._dbp.then(
      (db) =>
        new Promise((resolve, reject) => {
          const transaction = db.transaction(this.storeName, type);
          transaction.oncomplete = () => resolve();
          transaction.onabort = transaction.onerror = () =>
            reject(transaction.error);
          callback(transaction.objectStore(this.storeName));
        })
    );
  }
}
let store;
function getDefaultStore() {
  if (!store) store = new WebStore();
  return store;
}
export function get(key, store = getDefaultStore()) {
  let req;
  return store
    .__IDBAct__("readonly", (store) => {
      req = store.get(key);
    })
    .then(() => req.result)
    .catch((e) => {
      _logFallback(e);
      return fallbackGet(key);
    });
}
export function set(key, value, store = getDefaultStore()) {
  return store
    .__IDBAct__("readwrite", (store) => {
      store.put(value, key);
    })
    .catch((e) => {
      _logFallback(e);
      return fallbackSet(key, value);
    });
}
export function del(key, store = getDefaultStore()) {
  return store
    .__IDBAct__("readwrite", (store) => {
      store.delete(key);
    })
    .catch((e) => {
      _logFallback(e);
      return fallbackSet(key, undefined);
    });
}
export function clear(store = getDefaultStore()) {
  return store
    .__IDBAct__("readwrite", (store) => {
      store.clear();
    })
    .catch((e) => {
      _logFallback(e);
      return localStorage.removeItem(FALLBACK_LOCAL_STORAGE_KEY);
    });
}
const _logFallback = (arg) =>
  console.log(String(arg) || "using localstorage fallback");
