<template>
  <v-row class="m-0 p-0 pt-1 news-feed-row">
    <!-- No data -->

    <div class="mx-auto w-100">
      <NewsTextFilter
        :on-search="onSearch"
        :loading-search="loadingSearch"
        :first-load-data="isFirstLoading"
        :total-news="totalNews"
      />
      <div
        v-if="!isFirstLoading && !listDataComputed.length"
        class="no-data-div_wr white box-shadow--mod-lighter"
      >
        <img
          v-if="routeName === 'news' && !$route.query.q"
          src="@/assets/images/newsfeed-empty-bg.svg"
          alt="newsfeed background"
          class="container-empty-background mx-auto"
          style="max-width: 400px"
        />
        <img
          v-if="routeName === 'news' && $route.query.q"
          src="@/assets/images/news-nodata.svg"
          alt="newsfeed background"
          class="container-empty-background mx-auto"
          style="max-width: 400px"
        />
      </div>
      <v-btn
        v-if="isFirstLoading || forcedLoading"
        class="mx-auto my-5 d-block box-shadow--mod white"
        fab
        light
        small
        loading
      >
        <v-icon dark> mdi-minus </v-icon>
      </v-btn>

      <div
        v-for="(post, idx) in listDataComputed"
        v-show="!loadingSearch || !isFirstLoading"
        :key="post.id"
        :class="idx === 0 ? 'mt-4' : ''"
      >
        <NewsCard
          v-if="!isFirstLoading"
          :data="post"
          :post-like-click="postLikeClick"
        />
      </div>
      <span v-if="ableToLoadMore" v-intersect="onIntersect"></span>
      <NewsLoader v-if="showSkeletonPost" />
    </div>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/services';
import NewsLoader from '@/components/Loader/NewsLoader';
import NewsTextFilter from '@/components/Filter/NewsTextFilter';
import NewsCard from '@/components/News/NewsCard';
export default {
  components: { NewsTextFilter, NewsLoader, NewsCard },
  data() {
    return {
      listData: [],
      loadingSearch: false,
      isFirstLoading: true,
      forcedLoading: false,
      initSize: 4,
      totalNews: 0,
      countNews: 0,
      loadingMore: false,
      refIntersect: 0
    };
  },
  computed: {
    ...mapState({
      listNews: (state) => state.news.listNews,
      prvScroll: (state) => state.news.prvScroll,
      forceToReload: (state) => state.news.forceToReload
    }),
    ableToLoadMore() {
      return this.totalNews > this.countNews && this.countNews !== 0;
    },
    showSkeletonPost() {
      return this.ableToLoadMore;
    },
    currentQuery() {
      const query = this.$route.query;
      if (this.routeName === 'news' && query.q) {
        return this.$route.query.q;
      }
      return '';
    },
    listDataComputed() {
      const query = this.$route.query;
      if (this.routeName === 'news' && query.q) {
        return this.listData;
      } else {
        return this.listData && this.listData.length
          ? this.listData
          : this.listNews;
      }
    }
  },
  watch: {
    forceToReload() {
      const target = document.querySelector('.p-maker');
      target.scrollTo(0, 0);
      this.isFirstLoading = true;
      this.loadingSearch = true;
      this.initSize = 4;
      this.listData = [];
      this.getListData();
    },
    $route: {
      deep: true,
      handler() {
        const query = this.$route.query;
        if (this.routeName === 'news' && query.q) {
          this.getListData(true);
        } else {
          this.getListData();
        }
      }
    },
    isFirstLoading() {
      this.autoScroll();
    }
  },
  created() {
    if (this.listNews && this.listNews.length) {
      this.isFirstLoading = false;
      this.initSize = Math.max(this.listNews.length, 4);
    }
  },

  mounted() {
    const query = this.$route.query;
    if (this.routeName === 'news' && query.q) {
      this.getListData(true);
    } else {
      this.getListData();
    }
  },
  methods: {
    autoScroll() {
      this.$nextTick(() => {
        setTimeout(() => {
          const target = document.querySelector('.p-maker');
          if (target && this.prvScroll) {
            target.scrollTo(0, this.prvScroll);
          }
        }, 30);
      });
    },
    onIntersect() {
      if (this.refIntersect) {
        clearTimeout(this.refIntersect);
      }
      if (
        this.loadingMore ||
        this.totalNews <= this.initSize ||
        this.isFirstLoading
      ) {
        return;
      }
      this.refIntersect = setTimeout(() => {
        const cAxis = document.getElementsByClassName('p-maker')[0].scrollTop;

        if (cAxis > 600) {
          this.onLoadmore();
        }
      }, 400);
    },
    onSearch(_textQuery) {
      if (_textQuery) {
        this.$router.replace({
          path: '/news',
          query: { q: _textQuery }
        });
      } else {
        this.loadingSearch = false;
        this.$router.push('/');
      }
    },
    onLoadmore() {
      if (this.loadingMore) {
        return;
      }
      this.loadingMore = true;
      this.initSize += 4;
      const query = this.$route.query;
      if (this.routeName === 'news' && query.q) {
        this.getListData(true);
      } else {
        this.getListData();
      }
    },
    async getListData(isSearch = false) {
      const payload = {};
      if (isSearch) {
        this.loadingSearch = true;
        payload.search = this.currentQuery;
      }
      this.loadingMore = true;
      payload.size = this.initSize;
      const res = await api.annoucement.getListData(payload);
      this.$nextTick(() => {
        this.loadingMore = false;
      });
      this.isFirstLoading = false;
      this.loadingSearch = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getNewsFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);

          return;
        }
        const dataObj = res.data.data;
        this.listData = dataObj.announcements;
        if (!isSearch) {
          this.$store.commit('news/setListNews', dataObj.announcements);
        }
        this.totalNews = dataObj.meta ? dataObj.meta.pagination.total : 0;
        this.countNews = dataObj.meta ? dataObj.meta.pagination.count : 0;
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
      setTimeout(() => {
        if (isSearch) {
          setTimeout(() => {
            const query = this.$route.query.q;
            const listTitle = document.querySelectorAll('.news-header');
            listTitle.forEach((o) => {
              const innerHTML = o.innerText;
              o.innerHTML = this.highlightMatchText(query, innerHTML);
            });
          }, 10);
        } else {
          setTimeout(() => {
            const listTitle = document.querySelectorAll('.news-header');
            listTitle.forEach((o) => {
              o.innerHTML = o.innerText;
            });
          }, 10);
        }
        this.isFirstLoading = false;
      }, 10);
    },
    resolveSubmitLocal(_post) {
      const index = this.listData.findIndex((o) => o.id === _post.id);
      if (index !== -1) {
        this.listData.splice(index, 1, _post);
      }
    },
    async postLikeClick(_post) {
      const target = document.querySelector(`#group-btn-news-${_post.id}`);
      if (target) {
        target.classList.add('disabled-btn');
      }
      // _post.is_like = !_post.is_like
      let res;
      if (!_post.is_like) {
        _post.total_like += 1;
        res = await api.annoucement.likePost(_post.id);
      } else {
        _post.total_like -= 1;
        res = await api.annoucement.unlikePost(_post.id);
      }
      if (target) {
        target.classList.remove('disabled-btn');
      }
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          _post.is_like = !_post.is_like;
          if (_post.is_liked) {
            _post.total_like -= 1;
          } else {
            _post.total_like += 1;
          }
          return;
        }
        const obj = { ..._post };
        const rsData = res.data.data.announcement;
        obj.is_like = rsData.is_like;
        obj.total_likes = rsData.total_likes;
        this.resolveSubmitLocal(obj);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }
};
</script>

<style>
.container-empty-background {
  display: block;
  /* margin: auto; */
  max-width: 95%;
}
</style>
<style lang="scss" scoped>
.news-feed-row {
  /* margin-right: 256px !important; */
  min-height: 80vh;
  /* max-height: calc(100vh - 56px - 16px - 1px);
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background: #ffffff00;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(136, 136, 136, 0);
  }
  .nf-mty-text {
    text-align: center;
    letter-spacing: 0.0025em;
    font-weight: 400;
    font-size: 24px;
    line-height: 40px;
  } */
}
.no-data-div_wr {
  height: calc(100vh - 138px);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
