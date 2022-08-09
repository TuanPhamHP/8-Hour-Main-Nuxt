<template>
  <div class="news-comments-group pt-0">
    <div
      v-if="isShowComment && ableToLoadmore && !loadingComment"
      class="load-more-cmts mb-2 pointer neutral--text font-weight-semibold"
      @click="loadMoreCmts"
    >
      Xem thêm {{ this.totalComments - this.listComments.length }} phản hồi...
      <!-- {{ sysLanguage.news.loadMoreChildComment }}  -->
      <div
        v-if="loadingLoadmore && fLoadTotal"
        class="ml-1"
        style="width: fit-content"
      >
        <v-progress-circular
          indeterminate
          :width="2"
          :size="15"
          color="neutral"
        ></v-progress-circular>
      </div>
    </div>
    <div
      v-for="comment in listCommentsComputed"
      :key="comment.id"
      class="each-news-comment"
    >
      <RegularAvatarVue
        :size="36"
        :abbr-name="comment.creator.name"
        :imageUrl="comment.creator.avatar ? comment.creator.avatar.url : ''"
      />
      <div
        class="comment-block"
        :class="[
          comment.is_fake ? 'pending-cmt' : '',
          comment.id === selectedCmt.id ? 'on-edit-comment' : ''
        ]"
      >
        <div
          class="comment-block-text app_bg"
          :class="[comment.id === selectedCmt.id ? 'w-100' : '']"
        >
          <div class="menu-stack">
            <v-menu
              transition="slide-y-transition"
              bottom
              left
              offset-y
              min-width="180px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on" color="primary">
                  <v-icon>mdi-dots-horizontal</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-btn
                  v-if="!isMe(comment.creator)"
                  text
                  color="neutral"
                  class="v-btn-normalize w-100 py-2 v-btn-text-left"
                  @click="setCommentRep(comment)"
                >
                  Trả lời
                </v-btn>
                <v-btn
                  v-if="!isMe(comment.creator)"
                  text
                  color="neutral"
                  class="v-btn-normalize w-100 py-2 v-btn-text-left semantic_warning--text"
                  @click="reportComment(comment)"
                >
                  Báo cáo
                </v-btn>
                <v-btn
                  v-if="isMe(comment.creator)"
                  text
                  color="neutral"
                  class="v-btn-normalize w-100 py-2 v-btn-text-left"
                  @click="selectedCmt = comment"
                >
                  Chỉnh sửa
                </v-btn>
                <v-btn
                  v-if="isMe(comment.creator)"
                  text
                  color="semantic_error"
                  class="v-btn-normalize w-100 py-2 v-btn-text-left"
                  @click="removeComment(comment)"
                >
                  Xóa
                </v-btn>
              </v-list>
            </v-menu>
          </div>
          <p class="creator-name font-weight-bold neutral--text">
            {{ comment.creator ? comment.creator.name : 'Unknow' }}
          </p>
          <div>
            <pre
              v-show="comment.id !== selectedCmt.id"
              class="comment-block-text-part font-weight-regular neutral--text"
              :class="showAllIds.includes(comment.id) ? 'show-all' : ''"
              v-html="comment.content ? parseCommentText(comment.content) : ''"
            ></pre>
            <span
              v-if="comment.over9"
              class="primary--text font-weight-bold expand-text-btn pointer"
              @click="triggerShowAll(comment)"
              >{{
                showAllIds.includes(comment.id)
                  ? sysLanguage.news.textColapse
                  : sysLanguage.news.textExpand
              }}</span
            >
            <CmtTypeArea
              v-if="comment.id === selectedCmt.id"
              :data="comment"
              :comment-rep-from-parent="commentRepFromParent"
              :clear-selected-data="clearSelectedCmt"
              :resolve-edit-local="resolveEditLocal"
            />
          </div>
          <p
            v-show="comment.total_likes"
            class="mb-0 total-like-cmt pointer ml-auto neutral--text box-shadow--mod-lighter app_bg"
            @click="getListLikesCmt(comment)"
          >
            <img
              src="@/assets/images/comment-likes-counter.svg"
              alt="thumb-up"
              height="16px"
            />
            {{ comment.total_likes }}
          </p>
        </div>
        <div v-if="comment.file" class="comment-block-img my-1 pointer">
          <img
            :src="comment.file"
            class="block-img"
            alt=""
            loading="lazy"
            @click="previewImg([{ url: comment.file }], 0)"
            @error="replaceByDefault"
          />
        </div>
        <!-- CMT EDIT -->
        <div v-show="comment.id === selectedCmt.id" class="comment-actions">
          <p class="mb-0 edit-desc neutral--text pointer">
            Nhấn esc để
            <span class="semantic_error--text pointer" @click="clearSelectedCmt"
              >Hủy</span
            >
          </p>
        </div>
        <!--  -->
        <div
          v-show="comment.id !== selectedCmt.id"
          class="comment-actions"
          :class="comment.is_fake ? 'comment-actions__fk' : ''"
        >
          <p
            class="mb-0 like-cmt pointer"
            :class="comment.is_liked ? 'semantic_info--text' : 'neutral--text'"
            @click="likeClick(comment)"
          >
            {{ sysLanguage.news.likeBtn }}
          </p>
          <p
            class="mb-0 rep-cmt neutral--text pointer"
            @click="setCommentRep(comment)"
          >
            {{ sysLanguage.news.replyBtn }}
          </p>
          <p class="mb-0 time-cmt neutral_color_sub1--text">
            {{
              comment.is_fake
                ? 'Đang gửi...'
                : convertTimeRv(comment.created_at)
            }}
          </p>
        </div>
      </div>
    </div>
    <div
      v-if="loadingComment && fLoadTotal"
      class="mx-auto"
      style="width: fit-content"
    >
      <v-progress-circular
        indeterminate
        :width="2"
        :size="24"
        color="neutral"
      ></v-progress-circular>
    </div>
    <!-- TYPE BLOCK -->
    <ChildTypeArea
      :news-id="postId"
      :parent-id="parentId"
      :local-submit="localSubmit"
      :sv-submit="svSubmit"
      :comment-rep-from-parent="commentRepFromParent"
      :list-comments-computed-ids="listCommentsComputedIds"
      :set-comment-rep="setCommentRep"
    />

    <DialogConfirm
      :is-visible="showConfirmRemoveComment"
      :cancel-action="cancelRemove"
      :confirm-action="confirmRemove"
      :cancel-btn-text="sysLanguage.confirmDialog.cancelBtnTextNormal"
      :cancel-btn-color="'neutral_color_sub4'"
      :confirm-btn-text="sysLanguage.confirmDialog.confirmBtnTextNormal"
      :title="sysLanguage.confirmDialog.removeCommentTitle"
      :message="sysLanguage.confirmDialog.removeCommentMsg"
      :loading-confirm-btn="loadingRemove"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RegularAvatarVue from '../User/RegularAvatar.vue';
import CmtTypeArea from './CmtTypeArea.vue';
import ChildTypeArea from './ChildTypeArea.vue';
import handleFiles from '@/mixins/handleFiles';
import comments from '@/mixins/comments';
import api from '@/services';
import { convertTimeRv } from '@/helpers/dateFormater.js';
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue';
export default {
  components: { RegularAvatarVue, CmtTypeArea, ChildTypeArea, DialogConfirm },
  mixins: [handleFiles, comments],
  props: {
    parentId: {
      type: Number,
      default: -1
    },
    postId: {
      type: Number,
      default: -1
    },
    fLoadTotal: {
      type: Number,
      default: 1
    },
    setCommentRep: {
      type: Function,
      default() {}
    },
    reportComment: {
      type: Function,
      default() {}
    },
    commentRepFromParent: {
      type: Object,
      default() {}
    }
  },
  data() {
    return {
      selectedCmt: {},
      showConfirmRemoveComment: false,
      selectedCmtToRemove: {},
      loadingRemove: false,
      isShowComment: false,
      loadingComment: false,
      loadingLoadmore: false,
      listComments: [],
      totalComments: 1,
      initStepComment: 3,
      commentStepCounter: 10,

      showAllIds: [],
      isColapseText: true
    };
  },
  computed: {
    ...mapGetters({
      userFromAuth: 'userFromAuth'
    }),
    ableToLoadmore() {
      try {
        return this.totalComments > this.listComments.length;
      } catch (error) {
        return false;
      }
    },
    listCommentsComputed() {
      return this.listComments.map((o) => ({
        ...o,
        over9: this.getCmtLineCount(o)
      }));
    },
    listCommentsComputedIds() {
      return this.listComments.map((o) => o.id);
    }
  },
  mounted() {
    this.onShowComment();
  },

  methods: {
    triggerShowAll(comment) {
      if (!comment.over9) {
        return;
      }
      if (!this.showAllIds.includes(comment.id)) {
        this.showAllIds.push(comment.id);
      } else {
        this.showAllIds = this.showAllIds.filter((o) => o !== comment.id);
      }
    },
    async likeClick(_comment) {
      _comment.is_liked = !_comment.is_liked;
      let res;
      if (_comment.is_liked) {
        _comment.total_likes += 1;
        res = await api.annoucement.likeComment(this.postId, _comment.id);
      } else {
        _comment.total_likes -= 1;
        res = await api.annoucement.unlikeComment(this.postId, _comment.id);
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    getCmtLineCount(comment) {
      if (!comment.content) {
        return;
      }
      const enterCounter = comment.content.split('\n').length;
      const nsbpCounter = comment.content.split('&nbsp').length;
      return (
        comment.content &&
        (comment.content.length > 600 || enterCounter + nsbpCounter > 9)
      );
    },
    async loadMoreCmts() {
      this.loadingLoadmore = true;
      const nextCount = this.listComments.length + this.commentStepCounter;
      const payload = { size: nextCount };
      const res = await api.annoucement.getListCommentsL2(
        this.postId,
        this.parentId,
        payload
      );
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
      // First load only
      if (this.isShowComment) {
        return;
      }
      const payload = { size: this.initStepComment };
      this.isShowComment = true;
      this.loadingComment = true;
      const res = await api.annoucement.getListCommentsL2(
        this.postId,
        this.parentId,
        payload
      );

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
      this.listComments.push(_cmt);
      // this.listComments.splice(0, 0, _cmt)
    },
    async svSubmit(_formData, _fkId) {
      const res = await api.annoucement.createComment(this.postId, _formData);
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          // this.orderCreate('error');

          return;
        }
        this.resolveSubmit(_fkId, res.data.data.announcement_comment);
        this.totalComments += 1;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    convertTimeRv(_date) {
      return convertTimeRv(_date);
    },
    async getListLikesCmt(comment) {
      const _aId = this.postId;
      const _cId = comment.id;
      const res = await api.annoucement.getListLikesCmt(_aId, _cId);
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
    isMe(_user) {
      if (!_user || !_user.id) {
        return false;
      }
      return _user.id === this.userFromAuth.id;
    },
    clearSelectedCmt() {
      this.selectedCmt = {};
    },
    removeComment(_comment) {
      this.showConfirmRemoveComment = true;
      this.selectedCmtToRemove = { ..._comment };
    },
    cancelRemove() {
      this.showConfirmRemoveComment = false;
      this.selectedCmtToRemove = {};
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
    async confirmRemove() {
      this.loadingRemove = true;
      const res = await api.annoucement.deleteComment(
        this.postId,
        this.selectedCmtToRemove.id
      );
      this.loadingRemove = false;
      if (!res) {
        this.$store.commit(
          'toast/getError',
          this.sysLanguage.snackbar.removeCommentsFail
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
          this.sysLanguage.snackbar.removeCommentsSuccess
        );
        this.removeDataLocal(this.selectedCmtToRemove);
        this.cancelRemove();
      } catch (error) {
        this.$store.commit('toast/getError', `${error}`);
      }
    },
    resolveEditLocal(_cmt, _formData) {
      const index = this.listComments.findIndex((o) => o.id === _cmt.id);
      if (index !== -1) {
        this.listComments.splice(index, 1, _cmt);
      }
      this.svEdit(_cmt.id, _formData);
    },
    async svEdit(_cmtId, _formData) {
      const res = await api.annoucement.updateComment(
        this.postId,
        _cmtId,
        _formData
      );
      if (!res) {
        return;
      }
      try {
        if (res.status && res.status >= 400) {
          // this.orderCreate('error');

          return;
        }
        this.resolveSubmitLocal(res.data.data.announcement_comment);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.news-comments-group {
  gap: 30px;
  padding: 10px 0;
  .each-news-comment {
    display: flex;
    gap: 8px;
  }
  .comment-block {
    padding-right: 32px;
    &.on-edit-comment {
      width: 100% !important;
    }
    .comment-block-text {
      position: relative;
      padding: 8px;
      border-radius: 8px;
      width: fit-content;
      .menu-stack {
        opacity: 0;
        position: absolute;
        top: 0;
        right: 0;
        transform: translateX(100%);
      }
    }
    &:hover:not(.pending-cmt) {
      .comment-block-text {
        .menu-stack {
          opacity: 1;
        }
      }
    }
    .creator-name {
      letter-spacing: 0.0025em;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 8px;
    }
    .comment-block-text-part {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.0025em;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 9; /* number of lines to show */
      line-clamp: 9;
      -webkit-box-orient: vertical;
      &.show-all {
        -webkit-line-clamp: 9999999; /* number of lines to show */
        line-clamp: 9999999;
      }
    }
    .comment-block-img {
      .v-image {
        border-radius: 8px;
      }
    }
    .comment-actions {
      display: flex;
      gap: 12px;
      margin: 4px 0;
      &__fk {
        opacity: 0.7;
        pointer-events: none;
      }
      .like-cmt,
      .rep-cmt,
      .time-cmt {
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.0025em;
      }
      .edit-desc {
        font-weight: 500;
        font-size: 12px;
        letter-spacing: 0.0025em;
      }
      .like-cmt,
      .rep-cmt {
        font-weight: 600;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .block-img {
    object-fit: contain;
    max-width: 480px;
    max-height: 224px;
    border-radius: 8px;
    object-position: 'top left';
    width: auto;
    height: auto;
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
.total-like-cmt {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.0025em;
  display: flex;
  align-items: center;
  gap: 2px;
}
.expand-text-btn {
  font-size: 13px;
}
</style>
