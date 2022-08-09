<template>
  <div class="each-news-card news_bg box-shadow--mod">
    <p class="news-header neutral--text pointer" @click="storeDetail">
      {{ title }}
    </p>
    <p class="news-publish-date neutral_color_sub1--text">
      {{ published_at ? formatDateDMYH(published_at) : '' }}
    </p>
    <div
      class="news-text neutral--text"
      :class="textOver9 ? 'news-text-over-lines' : ''"
    >
      <pre
        :ref="`pre-ref-${postId}`"
        style="line-height: 18px"
        :class="!isColapseText ? 'show-all' : ''"
        @click="isColapseText = false"
        >{{ content }}
      </pre>
      <span
        v-if="textOver9"
        class="primary--text font-weight-bold expand-text-btn pointer"
        @click="isColapseText = !isColapseText"
        >{{
          isColapseText
            ? sysLanguage.news.textExpand
            : sysLanguage.news.textColapse
        }}</span
      >
    </div>
    <!-- LINKS BLOCK -->
    <div
      v-if="links && links.length"
      class="news-links-block px-2 news_block_bg mb-2"
    >
      <div
        v-for="(link, i) in links.slice(0, this.linksShow)"
        :key="i"
        class="each-link-in-news"
      >
        <img
          src="@/assets/images/file-icon-link.svg"
          height="28px"
          :alt="link.title"
        />
        <a
          :href="link.url"
          class="semantic_info--text"
          target="_blank"
          download=""
          :title="link.title"
        >
          {{ link.title ? formatFileName(link.title) : '' }}
        </a>
      </div>
      <div
        v-if="links.length > 3 && linksShow < links.length"
        class="rest-links-counter semantic_info--text font-weight-bold pointer"
        @click="onExpandLinks"
      >
        + {{ links.length - 3 }} {{ sysLanguage.news.otherLinks }}...
      </div>
      <div
        v-if="links.length > 3 && linksShow >= links.length"
        class="rest-links-counter semantic_info--text font-weight-bold pointer"
        @click="onColapseLinks"
      >
        {{ sysLanguage.news.colapse }}
      </div>
    </div>
    <!-- FILES BLOCK -->
    <div
      v-if="attachments && attachments.length"
      class="news-files-block px-2 news_block_bg mb-2"
    >
      <div
        v-for="(file, i) in attachments.slice(0, this.attachmentsShow)"
        :key="i"
        class="each-file-in-news"
      >
        <img
          :src="file.extension ? getFileIcon(file.extension) : ''"
          height="28px"
          :alt="file.name"
        />
        <a
          :href="file.url"
          class="semantic_info--text"
          target="_blank"
          :title="file.original_name"
          download=""
        >
          {{ file.original_name ? formatFileName(file.original_name) : '' }}
        </a>
      </div>
      <div
        v-if="attachments.length > 3 && attachmentsShow < attachments.length"
        class="rest-files-counter semantic_info--text font-weight-bold pointer"
        @click="onExpandAttachments"
      >
        + {{ attachments.length - 3 }} {{ sysLanguage.news.otherFiles }}...
      </div>
      <div
        v-if="attachments.length > 3 && attachmentsShow > attachments.length"
        class="rest-files-counter semantic_info--text font-weight-bold pointer"
        @click="onColapseAttachments"
      >
        {{ sysLanguage.news.colapse }}
      </div>
    </div>
    <!-- IMAGES BLOCK -->
    <div
      v-if="photos && photos.length"
      class="news-images-block"
      :class="[layoutImage]"
    >
      <v-img
        v-for="(img, i) in photos.slice(0, 5)"
        :key="img.url"
        eager
        :src="img.url"
        lazy-src="/v.png"
        :class="['news-image', `news-image-${i}`]"
        @click="previewImg(photosComputed, i)"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
      <span
        v-if="photos.length > 5"
        class="rest-img-counter"
        @click="previewImg(photosComputed, 4)"
        >+{{ photos.length - 4 }}</span
      >
    </div>

    <div class="news-statistical">
      <p
        v-if="data.total_like"
        class="like-counter neutral--text font-weight-regular pointer"
        @click="showListReaction"
      >
        <img src="@/assets/images/thumb-up.svg" alt="" />
        {{ data.total_like }} {{ sysLanguage.news.like }}
      </p>
      <p
        v-if="!isDetail && data.total_comment"
        class="comment-counter neutral--text font-weight-regular pointer"
        @click="viewDetail"
      >
        {{ data.total_comment }} {{ sysLanguage.news.comment }}
      </p>
      <p
        v-if="data.total_comment && isDetail"
        class="comment-counter neutral--text font-weight-regular"
        :to="viewDetail"
      >
        {{ data.total_comment }} {{ sysLanguage.news.comment }}
      </p>
    </div>

    <!-- ACTION -->
    <NewsCardAction
      :comment-click="onShowComment"
      :like-click="mpostLikeClick"
      :data="data"
    />
    <!-- TYPE BLOCK -->
    <NewsCardTypeArea
      v-if="isShowComment"
      :localSubmit="localSubmit"
      :svSubmit="svSubmit"
      :news-id="data.id"
    />
    <!-- COMMENTS -->
    <NewsCardComments
      v-if="isShowComment"
      :list-comments="listComments"
      :total-comments="totalComments"
      :loading-comment="loadingComment"
      :like-click="likeClick"
      :resolve-submit-local="resolveSubmitLocal"
      :resolve-edit-local="resolveEditLocal"
      :remove-data-local="removeDataLocal"
      :report-comment="reportComment"
      :postId="postId"
    />
    <div
      v-if="isShowComment && ableToLoadmore && !loadingComment"
      class="load-more-cmts my-2 pointer neutral--text font-weight-semibold"
      @click="loadMoreCmts"
    >
      {{ sysLanguage.news.loadMoreComment }}
      <div v-if="loadingLoadmore" class="ml-1" style="width: fit-content">
        <v-progress-circular
          indeterminate
          :width="2"
          :size="15"
          color="neutral"
        ></v-progress-circular>
      </div>
    </div>
    <DialogReportComment
      :isVisible="showConfirmReport"
      :cancelAction="cancelReport"
      :confirmAction="confirmReport"
      :cancelBtnText="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancelBtnColor="'neutral_color_sub4'"
      :confirmBtnText="sysLanguage.confirmDialog.confirmReportBtnText"
      :title="sysLanguage.confirmDialog.reportComment"
      :message="reportMsg"
      :loadingConfirmBtn="loadingReport"
    />
    <div
      v-if="isShowComment && listComments && listComments.length > 7"
      class="load-more-cmts my-2 pointer neutral--text font-weight-bold"
      @click="scrollToTypeArea"
    >
      {{ sysLanguage.news.newComment }}
    </div>
  </div>
</template>

<script>
import NewsCardAction from './NewsCardAction.vue';
import NewsCardComments from './NewsCardComments.vue';
import NewsCardTypeArea from './NewsCardTypeArea.vue';
import DialogReportComment from '@/components/Dialog/DialogReportComment.vue';
import handleFiles from '@/mixins/handleFiles.js';
import { formatDateDMYH } from '@/helpers/dateFormater.js';
import api from '@/services';
export default {
  components: {
    NewsCardAction,
    NewsCardComments,
    NewsCardTypeArea,
    DialogReportComment
  },
  mixins: [handleFiles],
  props: {
    isDetail: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {}
    },
    postLikeClick: {
      type: Function,
      default() {}
    }
  },
  data() {
    return {
      isColapseText: true,
      textOver9: false,

      // cmts state
      showConfirmReport: false,
      loadingReport: false,
      loadingComment: false,
      loadingLoadmore: false,
      isShowComment: false,
      listComments: [],
      totalComments: 1,
      initStepComment: 3,
      commentStepCounter: 10,
      attachmentsShow: 3,
      linksShow: 3,
      commentToReport: {}
    };
  },
  computed: {
    reportMsg() {
      return `<span>Bạn muốn báo cáo bình luận của <b>${
        this.commentToReport.creator ? this.commentToReport.creator.name : ''
      }</b>? Vui lòng ghi rõ lý do:</span>`;
    },
    postId() {
      return this.data && this.data.id ? this.data.id : -1;
    },
    layoutImage() {
      const imgLength = this.photos.length;
      if (imgLength < 6) {
        return `layout-image-${imgLength}`;
      }
      return 'layout-image-ow';
    },
    ableToLoadmore() {
      try {
        return this.totalComments > this.listComments.length;
      } catch (error) {
        return false;
      }
    },
    content() {
      return this.data.content;
    },
    title() {
      return this.data.title;
    },
    published_at() {
      return this.data.published_at;
    },
    created_at() {
      return this.data.created_at;
    },
    links() {
      return this.data.links || [];
    },
    photos() {
      return this.data.photos || [];
    },
    photosComputed() {
      return this.photos.map((o) => ({ url: o.url }));
    },
    attachments() {
      return this.data.attachments || [];
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getPostLineCount();
    });
    if (this.isDetail) {
      this.onShowComment();
    }
  },
  methods: {
    reportComment(_comment) {
      this.showConfirmReport = true;
      this.commentToReport = { ..._comment };
    },
    cancelReport() {
      this.showConfirmReport = false;
      this.commentToReport = {};
    },
    confirmReport(_txt) {
      if (!_txt || String(_txt).trim().length < 7) {
        this.$store.commit('toast/getError', 'Lý do cần tối thiểu 7 ký tự');
        return;
      }
      const body = {
        reason: _txt
      };
      this.svReport(this.commentToReport.id, body);
    },
    onColapseLinks() {
      this.linksShow = 3;
    },
    onExpandLinks() {
      this.linksShow = this.links.length + 1;
    },
    onColapseAttachments() {
      this.attachmentsShow = 3;
    },
    onExpandAttachments() {
      this.attachmentsShow = this.attachments.length + 1;
    },
    // Annoucement actions
    async read(_id) {
      const res = await api.annoucement.read(_id);
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          // this.orderCreate('error');
          console.log(res);
          return;
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async getLikes(_id) {
      const res = await api.annoucement.getListLikes(_id);
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getNewsLikesFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          return;
        }
        if (res.data.data.likes && res.data.data.likes.length) {
          const arr = res.data.data.likes.map((o) => o.creator);
          this.$store.commit('SET_LISTUSER_READONLY_POPUP', [...arr]);
        }
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
        console.error(error);
      }
    },
    viewDetail() {
      this.read(this.data.id);
      this.$router.push(`/news/${this.data.id}`);
    },
    //
    scrollToTypeArea() {
      if (document.querySelector(`#type-area-for-${this.data.id}`)) {
        document.querySelector(`#type-area-for-${this.data.id}`).focus();
      }
    },
    formatDateDMYH(_d) {
      return formatDateDMYH(_d);
    },
    async loadMoreCmts() {
      this.loadingLoadmore = true;
      const nextCount = this.listComments.length + this.commentStepCounter;
      const payload = { size: nextCount };
      const res = await api.annoucement.getListComments(this.data.id, payload);
      this.loadingLoadmore = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getNewsCommentsFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          return;
        }
        const dataObj = res.data.data;
        this.listComments = dataObj.announcement_comments;
        this.totalComments = dataObj.meta ? dataObj.meta.pagination.total : 0;
      } catch (error) {
        this.$store.commit('toast/getError', String(error));
      }
    },
    async onShowComment() {
      this.scrollToTypeArea();
      // First load only
      if (this.isShowComment) {
        return;
      }
      const payload = { size: this.initStepComment };
      this.isShowComment = true;
      this.loadingComment = true;
      const res = await api.annoucement.getListComments(this.data.id, payload);

      this.loadingComment = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.getNewsCommentsFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          return;
        }
        const dataObj = res.data.data;
        this.listComments = dataObj.announcement_comments;
        this.totalComments = dataObj.meta ? dataObj.meta.pagination.total : 0;
      } catch (error) {
        this.$store.commit('toast/getError', String(error));
      }
    },
    localSubmit(_cmt) {
      // this.listComments.push(_cmt)
      this.listComments.splice(0, 0, _cmt);
    },
    async svSubmit(_formData, _fkId) {
      const res = await api.annoucement.createComment(this.data.id, _formData);
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          // this.orderCreate('error');
          console.log(res);
          return;
        }
        this.resolveSubmit(_fkId, res.data.data.announcement_comment);
        this.totalComments += 1;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    async svReport(_cmtId, _formData) {
      this.loadingReport = true;
      const res = await api.annoucement.reportComment(
        this.data.id,
        _cmtId,
        _formData
      );
      this.loadingReport = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.reportCommentFail
        );
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit('toast/getError', res.data.message);
          return;
        }
        this.$store.commit(
          'toast/getSuccess',
          this.sysLanguage.snackbar.reportCommentSuccess
        );
        this.cancelReport();
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    async svEdit(_cmtId, _formData) {
      const res = await api.annoucement.updateComment(
        this.data.id,
        _cmtId,
        _formData
      );
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          // this.orderCreate('error');
          console.log(res);
          return;
        }
        this.resolveSubmitLocal(res.data.data.announcement_comment);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    resolveSubmit(_fkId, _cmt) {
      const index = this.listComments.findIndex(
        (o) => o.is_fake && o.id === _fkId
      );
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt);
      }
    },
    removeDataLocal(_cmt) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id);
      if (index !== -1) {
        this.listComments.splice(index, 1);
      }
    },
    resolveSubmitLocal(_cmt) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id);
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt);
      }
    },
    resolveEditLocal(_cmt, _formData) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id);
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt);
      }
      this.svEdit(_cmt.id, _formData);
    },
    async likeClick(_comment) {
      _comment.is_liked = !_comment.is_liked;
      let res;
      if (_comment.is_liked) {
        _comment.total_likes += 1;
        res = await api.annoucement.likeComment(this.data.id, _comment.id);
      } else {
        _comment.total_likes -= 1;
        res = await api.annoucement.unlikeComment(this.data.id, _comment.id);
      }

      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          _comment.is_liked = !_comment.is_liked;
          if (_comment.is_liked) {
            _comment.total_likes -= 1;
          } else {
            _comment.total_likes += 1;
          }
          return;
        }
        const obj = { ..._comment };
        const rsData = res.data.data.announcement_comment;
        obj.is_liked = rsData.is_liked;
        obj.total_likes = rsData.total_likes;
        this.resolveSubmitLocal(obj);
        console.log(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    mpostLikeClick() {
      this.postLikeClick(this.data);
    },
    showListReaction() {
      this.read(this.data.id);
      this.getLikes(this.data.id);
      // this.$store.commit("SET_LISTUSER_READONLY_POPUP", [
      //   {
      //     id: 1,
      //     name: "Ngô Minh Phương",
      //     avatar:
      //       "https://gamek.mediacdn.vn/133514250583805952/2021/12/20/photo-1-16399961716501673764871.png",
      //   },
      //   {
      //     id: 2,
      //     name: "Vũ Thu Phương",
      //     avatar:
      //       "https://tiengdong.com/wp-content/uploads/www_tiengdong_com-meme-gau-truc-hoi-cham.jpg",
      //   },
      //   {
      //     id: 3,
      //     name: "Vũ Thu Phương",
      //     avatar:
      //       "https://tiengdong.com/wp-content/uploads/www_tiengdong_com-meme-gau-truc-hoi-cham.jpg",
      //   },
      //   {
      //     id: 4,
      //     name: "Vũ Thu Phương",
      //     avatar:
      //       "https://tiengdong.com/wp-content/uploads/www_tiengdong_com-meme-gau-truc-hoi-cham.jpg",
      //   },
      //   {
      //     id: 5,
      //     name: "Vũ Thu Phương",
      //     avatar:
      //       "https://tiengdong.com/wp-content/uploads/www_tiengdong_com-meme-gau-truc-hoi-cham.jpg",
      //   },
      // ])
    },
    toggleColapseText() {
      if (!this.textOver9) {
        return;
      }
      this.isColapseText = !this.isColapseText;
    },
    storeDetail() {
      if (this.isDetail) {
        return;
      }
      this.$store.commit('news/setDetailNews', this.data);
      this.$router.push(`/news/${this.data.id}`);
    },
    getPostLineCount() {
      setTimeout(() => {
        const el = this.$refs[`pre-ref-${this.postId}`];
        if (!el) {
          return;
        }
        const divHeight = el.offsetHeight;
        const lineHeight = parseInt(el.style.lineHeight);

        const lines = divHeight / lineHeight;
        if (lines > 9) {
          this.textOver9 = true;
        }
      }, 10);
    }
  }
};
</script>
<style lang="scss" scoped>
.each-news-card {
  padding: 16px 16px 8px;
  margin-bottom: 16px;
  border-radius: 8px;
}

.news-images-block {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  cursor: pointer;
  .rest-img-counter {
    display: none;
  }
  &.layout-image-1 {
    .news-image {
      flex-grow: 1;
      width: 100%;
      height: 470px;
    }
  }
  &.layout-image-2 {
    .news-image {
      flex-grow: 1;
      height: 470px;
    }
  }
  &.layout-image-3 {
    display: grid;
    grid-template-columns: 50%;
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 3;
      height: 406px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 3;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
  }
  &.layout-image-4 {
    .news-image {
      flex-grow: 1;
      width: calc(50% - 6px);
      max-width: calc(50% - 6px);
      height: 260px;
    }
  }
  &.layout-image-5 {
    display: grid;
    grid-template-columns: auto;
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 5;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 5;
      grid-column-end: 7;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-3 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .news-image-4 {
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
  }
  &.layout-image-ow {
    display: grid;
    grid-template-columns: calc(100% / 6);
    column-gap: 3px;
    row-gap: 6px;
    .news-image-0 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-1 {
      grid-column-start: 3;
      grid-column-end: 5;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-2 {
      grid-column-start: 5;
      grid-column-end: 7;
      grid-row-start: 1;
      grid-row-end: 2;
      height: 200px;
    }
    .news-image-3 {
      grid-column-start: 1;
      grid-column-end: 4;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .news-image-4 {
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
    }
    .rest-img-counter {
      display: flex;
      color: #fff;
      letter-spacing: 0.0025em;
      font-size: 34px;
      align-items: center;
      justify-content: center;
      grid-column-start: 4;
      grid-column-end: 7;
      grid-row-start: 2;
      grid-row-end: 3;
      height: 200px;
      background: #00000056;
      position: relative;
      z-index: 2;
    }
  }
}
.news-header {
  font-weight: 700;
  font-size: 24px;
  line-height: 32px;
  margin-bottom: 8px;
  display: block;
  text-decoration: none;
}
.news-publish-date {
  font-size: 12px;
  font-weight: 150%;
  text-align: left;
  letter-spacing: 0.004em;
  margin-bottom: 16px;
}
.news-text {
  font-weight: 400;
  font-size: 14px;
  line-height: 143%;
  letter-spacing: 0.0025em;
  margin-bottom: 8px;
  .expand-text-btn {
    display: none;
  }
}
.news-text-over-lines {
  &.news-text {
    pre {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 9; /* number of lines to show */
      line-clamp: 9;
      -webkit-box-orient: vertical;
    }
    pre.show-all {
      -webkit-line-clamp: 9999999; /* number of lines to show */
      line-clamp: 9999999;
    }
  }
  .expand-text-btn {
    display: block;
    width: fit-content;
    /* transform: translateY(-100%); */
    margin-left: auto;
    text-align: right;
    &:hover {
      text-decoration: underline;
    }
  }
}
.news-statistical {
  display: flex;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f2f2f2;
  gap: 20px;
  .like-counter {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.0025em;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .comment-counter {
    margin-bottom: 0;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.0025em;
    display: block;
    text-decoration: none;
  }
}
.news-files-block {
  padding: 16px 0;
  .each-file-in-news {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 4px 0;
    text-decoration: none;
    a {
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 143%;
      display: flex;
      align-items: center;
      letter-spacing: 0.0025em;
    }
  }
  .rest-files-counter {
    padding: 8px 0 4px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.news-links-block {
  padding: 16px 0;
  .each-link-in-news {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 4px 0;
    text-decoration: none;
    a {
      text-decoration: none;
      font-weight: 500;
      font-size: 14px;
      line-height: 143%;
      display: flex;
      align-items: center;
      letter-spacing: 0.0025em;
    }
  }
  .rest-links-counter {
    padding: 8px 0 4px;
    &:hover {
      text-decoration: underline;
    }
  }
}
.load-more-cmts {
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  &:hover {
    text-decoration: underline;
  }
}
</style>
<style lang="scss">
pre {
  white-space: pre-wrap;
}
</style>
