<template>
  <div
    class="w-100 page-search-block app_bg"
    :class="panel ? '' : ''"
    v-click-outside="collapsePanel"
  >
    <v-btn
      v-if="isSearchRoute && !panel"
      icon
      class="mb-2"
      color="neutral"
      @click="fallBack"
    >
      <v-icon> mdi-arrow-left </v-icon>
    </v-btn>
    <div
      class="filter-input contact-filter w-100 box-shadow--mod-lighter white"
      :class="[
        ableShowCachedQuery ? 'expanded-text-filter' : '',
        isSearchRoute ? 'mb-2' : 'mb-0'
      ]"
      tabindex="-1"
    >
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="sysLanguage.placeholder.newsTextSearch"
        class="input-no-focus"
        @focus="panel = true"
        @keyup.prevent.exact.esc="panel = false"
        @keyup.exact.enter="handleSearch"
      />
      <v-btn
        icon
        depressed
        @click="handleSearch"
        class=""
        :loading="loadingSearch"
      >
        <v-icon
          :color="panel ? 'primary' : 'neutral'"
          size="20"
          style="cursor-pointer"
          >mdi-magnify</v-icon
        >
      </v-btn>
      <span
        v-if="isSearchRoute"
        class="result-counter neutral_color_sub1--text"
      >
        <span v-if="loadingSearch"> Đang tìm kiếm ...</span>
        <span v-else>
          {{ totalNews + ' ' }}{{ sysLanguage.search.newsResult }}
        </span>
      </span>
      <div
        v-show="ableShowCachedQuery"
        class="absolute-cached-filter white scroll-y-mod_big"
      >
        <span
          style="
            cursor: pointer;
            font-size: 12px;
            display: block;
            text-align: right;
            padding-right: 24px;
          "
          @click.stop="clearCachedQuery"
          ><em>Xóa lịch sử tìm kiếm</em></span
        >
        <div
          v-for="(item, i) in listCachedSearchComputed"
          :key="i"
          class="each-cate-filter limit-line-1"
          @click="appliedQuery(item)"
        >
          <v-icon class="mr-2">mdi-clock-outline</v-icon> {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// newsTextQuery
import { tStr } from 'validation_t/src';
import localSearchHistoryHandler from '@/mixins/localSearchHistoryHandler.js';
export default {
  mixins: [localSearchHistoryHandler],
  props: {
    onSearch: {
      type: Function,
      default() {}
    },
    loadingSearch: {
      type: Boolean,
      default: false
    },
    firstLoadData: {
      type: Boolean,
      default: false
    },
    totalNews: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchQuery: '',
      panel: null,
      listCachedSearch: [],
      searchName: 'newsTextQuery'
    };
  },
  computed: {
    listCachedSearchComputed() {
      if (!this.searchQuery.trim()) {
        return this.listCachedSearch;
      }
      const f = this.listCachedSearch.filter((o) => {
        const searchQuery = String(tStr.removeAscent(this.searchQuery))
          .toLowerCase()
          .trim();
        const item = String(tStr.removeAscent(o)).toLowerCase().trim();
        return item.includes(searchQuery);
      });

      return f;
    },
    isSearchRoute() {
      const query = this.$route.query;
      return ['news'].includes(this.$route.name) && query.q;
    },
    ableShowCachedQuery() {
      return (
        this.panel &&
        this.listCachedSearchComputed &&
        this.listCachedSearchComputed.length &&
        !this.firstLoadData
      );
    }
  },
  watch: {
    searchQuery() {
      if (this.firstLoadData) {
        return;
      }
      this.panel = true;
    },
    panel() {
      const arrSearch = this.getArrayCachedSearchWithName(this.searchName);
      this.listCachedSearch = [...arrSearch];
    },
    loadingSearch() {
      if (this.loadingSearch) {
        this.panel = false;
      }
    }
  },
  mounted() {
    const arrSearch = this.getArrayCachedSearchWithName(this.searchName);
    this.listCachedSearch = [...arrSearch];
    if (this.isSearchRoute) {
      const query = this.$route.query;
      if (query.q) {
        this.searchQuery = query.q;
      }
    }
  },
  methods: {
    fallBack() {
      this.searchQuery = '';
      this.onSearch('');
    },
    outBlur() {
      this.panel = false;
    },
    handleSearch() {
      if (this.searchQuery && this.searchQuery.trim()) {
        this.cacheSearchWithName(this.searchName, this.searchQuery);
      }
      if (this.loadingSearch) {
        return;
      }
      this.onSearch(this.searchQuery);
    },
    clearCachedQuery() {
      // console.log("hey")
      localStorage.removeItem(this.searchName);
      this.panel = false;
    },
    appliedQuery(_query) {
      this.searchQuery = _query;
      this.onSearch(this.searchQuery);
      this.$nextTick(() => {
        this.collapsePanel();
      });
    },
    collapsePanel() {
      if (this.panel) {
        this.panel = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contact-filter {
  border-radius: 8px;
  padding: 5px 16px;
  position: relative;
  z-index: 4;
  input {
    &::placeholder {
      font-size: 16px;
      font-weight: 400 !important;
    }
  }
}

body {
  .expanded-text-filter {
    border-radius: 8px 8px 0 0 !important;
    border-top: 1px solid #66a7c2 !important;
    border-left: 1px solid #66a7c2 !important;
    border-right: 1px solid #66a7c2 !important;
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: calc(100% - 34px);
      height: 2px;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      background-color: #66a6c27e;
      z-index: 3;
    }
    /* box-shadow: none !important; */
  }
  .absolute-cached-filter {
    position: absolute;
    top: 100%;
    left: -1px;
    width: calc(100% + 2px);
    border-radius: 0 0 8px 8px;
    margin-top: 0px;
    padding: 12px 0;
    border-left: 1px solid #66a7c2 !important;
    border-right: 1px solid #66a7c2 !important;
    border-bottom: 1px solid #66a7c2 !important;
    border-top: none !important;
    z-index: 3;
    max-height: 420px;
    overflow-y: scroll;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.12),
      0px 3px 1px rgba(0, 0, 0, 0.08), 0px 3px 3px rgba(0, 0, 0, 0.04),
      0px 24px 28px 8px rgba(0, 0, 0, 0.046);
    /*  */
    .each-cate-filter {
      cursor: pointer;
      padding: 8px 16px;
      &:hover {
        background-color: #d7d7d7a5;
      }
    }
  }
}
.page-search-block {
  position: sticky;
  z-index: 4;
  top: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    transform: translateY(-100%) scaleX(1.005);
    width: 100%;
    z-index: 4;
    background: #f5f6fa;
    height: 16px;
  }
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    transform: translateY(-5px) scaleX(1.005);
    width: 100%;
    z-index: 3;
    background: #f5f6fa;
    backdrop-filter: blur(10px);
    height: 15px;
  }
  &.no-after {
    &::after {
      display: none;
    }
  }
  /* top: 0; */
  /* padding: 16px 0; */
}
.result-counter {
  position: absolute;
  left: 0;
  bottom: -20px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.004em;
}
</style>
