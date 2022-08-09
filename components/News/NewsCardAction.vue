<template>
  <div>
    <div
      :id="`group-btn-news-${data.id}`"
      class="action-btn news-action-group-btn"
    >
      <div
        class="like-btn font-weight-regular pointer"
        :class="is_like ? 'semantic_info--text' : 'neutral--text'"
        @click="handleLikeClick"
      >
        <img
          v-show="!is_like"
          height="24px"
          src="@/assets/images/thumb-up-outline.svg"
          alt=""
        />
        <img
          v-show="is_like"
          height="24px"
          src="@/assets/images/thumb-up-outline-gradient.svg"
          alt=""
        />
        {{ sysLanguage.news.likeBtn }}
      </div>
      <div
        class="cmt-btn pointer font-weight-regular neutral--text"
        @click="commentClick"
      >
        <v-icon color="neutral_color_sub1"
          >mdi-message-processing-outline</v-icon
        >
        {{ sysLanguage.news.commentBtn }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    commentClick: {
      type: Function,
      default() {},
    },
    likeClick: {
      type: Function,
      default() {},
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      is_like: false,
    }
  },
  mounted() {
    this.is_like = this.data.is_like
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.is_like = this.data.is_like
      },
    },
  },
  methods: {
    handleLikeClick() {
      setTimeout(() => {
        this.is_like = !this.is_like
      }, 10)
      this.likeClick()
    },
  },
}
</script>

<style lang="scss" scoped>
.news-action-group-btn {
  display: flex;
  gap: 30px;
  padding: 16px 0;
}
.cmt-btn,
.like-btn {
  /* font-weight: 400; */
  font-size: 16px;
  /* line-height: 24px; */
  display: flex;
  gap: 12px;
  align-items: center;
  letter-spacing: 0.005em;
  width: 50%;
  justify-content: center;
}
</style>
