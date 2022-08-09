export default ($axios, $indexedDB, $store) => ({
  getAll: async () => {
    const rooms = await $indexedDB.getAll('companies');
    return rooms;
  },
  add: (payload = {}, addToVuex = false) => {
    if (addToVuex) {
      $store.commit('companies/ADD_COMPANY', payload);
    }
    $indexedDB.add('companies', [payload]);
  },
  addArray: (payload = [], addToVuex = false) => {
    if (addToVuex) {
      $store.commit('rooms/addGroup', payload);
    }
    $indexedDB.add('companies', payload);
  },
  update: (group = {}) => {
    $indexedDB.updateByKey('companies', group._id, { value: group });
    $store.commit('rooms/updateGroup', group);
  },
  remove: (groupId) => {
    $indexedDB.remove('companies', groupId);
    $indexedDB.remove('members_group', groupId);
    $indexedDB.remove('clicked_rooms', groupId);
    $store.commit('rooms/removeGroup', groupId);
  }
});
