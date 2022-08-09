import IndexedDB from '../indexedDB';

export default (ctx, inject) => {
  const indexedDB = new IndexedDB('xuan_cuong_customer', 1);
  localStorage.setItem('idb_lastest_version', 1);
  inject('indexedDB', indexedDB);
};
