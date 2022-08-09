<template>
  <v-row class="m-0 p-0 pt-1 news-feed-row flex-column">
    <div>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            class="mb-2"
            color="neutral"
            v-bind="attrs"
            v-on="on"
            @click="fallBack"
          >
            <v-icon> mdi-arrow-left </v-icon>
          </v-btn>
        </template>
        <span>Quay lại</span>
      </v-tooltip>
      <span class="fallback-header">Quay lại</span>
    </div>
    <div class="mx-auto w-100 content-wrap-relative">
      <v-btn
        v-if="isFirstLoading || forcedLoading"
        class="mx-auto my-5 d-block box-shadow--mod white btn-load-absolute"
        fab
        light
        small
        loading
      >
        <v-icon dark> mdi-minus </v-icon>
      </v-btn>
      <NewsLoader v-if="showSkeletonPost || forceHideNewsCard" />
      <div v-if="!showSkeletonPost && !forceHideNewsCard">
        <NewsCard
          :data="detailNewsComputed"
          :is-detail="true"
          :post-like-click="postLikeClick"
        />
      </div>
    </div>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';
import NewsLoader from '@/components/Loader/NewsLoader';
import NewsCard from '@/components/News/NewsCard';
import api from '@/services';
export default {
  components: { NewsLoader, NewsCard },
  data() {
    return {
      listData: [],
      loadingSearch: false,
      isFirstLoading: true,
      detailData: {},
      forcedLoading: false,
      forceHideNewsCard: false
    };
  },
  computed: {
    ...mapState({
      detailNews: (state) => state.news.detailNews
    }),
    showSkeletonPost() {
      return (
        this.isFirstLoading &&
        (!this.detailNewsComputed || !this.detailNewsComputed.id)
      );
    },
    currentQuery() {
      return this.$route.query.q;
    },
    detailNewsComputed() {
      if (this.detailData && this.detailData.id) {
        return this.detailData;
      }
      return this.detailNews;
    }
  },
  watch: {
    $route() {
      this.isFirstLoading = true;
      this.forceHideNewsCard = true;
      this.getDetailData();
    }
  },
  mounted() {
    this.getDetailData();
  },
  methods: {
    resolveSubmitLocal(_post) {
      this.detailData = { ..._post };
    },
    fallBack() {
      this.$router.push('/');
      // this.$router.go(-1)
    },
    onSearch(_textQuery) {
      if (_textQuery) {
        this.$router.replace({
          path: '/news',
          query: { q: _textQuery }
        });
      } else {
        this.loadingSearch = true;
        this.$router.push('/');
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
        // const obj = { ..._post }
        const rsData = res.data.data.announcement;
        // obj.is_like = rsData.is_like
        // obj.total_likes = rsData.total_likes
        this.resolveSubmitLocal(rsData);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async getDetailData(isSearch = false) {
      const payload = {};
      const id = this.$route.params.id;
      if (isSearch) {
        this.loadingSearch = true;
      }
      const res = await api.annoucement.getDetailData(id, payload);
      this.isFirstLoading = false;
      this.forceHideNewsCard = false;

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
          console.log(res);
          return;
        }
        const dataObj = res.data.data;
        this.detailData = dataObj.announcement;
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
.fallback-header {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.0125em;
  text-transform: uppercase;
}
</style>
