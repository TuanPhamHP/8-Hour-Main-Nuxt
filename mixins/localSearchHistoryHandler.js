import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      splitMark: (state) => state.splitMark
    })
  },
  methods: {
    getStringCachedSearchWithName(_name) {
      if (!_name) {
        return '';
      }
      return localStorage.getItem(_name) || '';
    },
    cacheSearchWithName(_name, query) {
      if (!_name) {
        console.error(
          'Failed when try to cache unsupported query name, name try to save:' +
            `'${_name}'`
        );
        return;
      }
      if (!query || !query.trim()) {
        console.error(
          'Failed when try to cache unsupported query, query try to save:' +
            `'${query}'`
        );
        return;
      }
      let pvCached = this.getStringCachedSearchWithName(_name);
      const pvCachedArr = this.getArrayCachedSearchWithName(_name);
      if (
        pvCachedArr.some((o) => {
          return String(o).toLowerCase() === String(query).toLowerCase();
        })
      ) {
        return;
      }
      if (!pvCached) {
        pvCached = query;
      } else {
        pvCached = query + this.splitMark + pvCached;
      }
      localStorage.setItem(_name, pvCached);
    },
    getArrayCachedSearchWithName(_name) {
      if (!_name) {
        return;
      }
      const pvCached = this.getStringCachedSearchWithName(_name);
      return pvCached.split(this.splitMark).filter((o) => o);
    },
    clearCachedQuery(_name) {
      if (!_name) {
        return;
      }
      localStorage.removeItem(_name);
    }
  }
};
