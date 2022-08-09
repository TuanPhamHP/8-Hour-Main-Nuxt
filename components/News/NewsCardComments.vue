<template>
  <div class="news-comments-group">
    <div
      v-for="comment in listCommentsComputed"
      :key="comment.id"
      class="each-news-comment"
    >
      <div class="cmt-p">
        <RegularAvatarVue
          :size="36"
          :abbr-name="comment.creator.name"
          :image-url="comment.creator.avatar ? comment.creator.avatar.url : ''"
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
                <template #activator="{ on, attrs }">
                  <v-btn color="primary" icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-horizontal</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-btn
                    v-if="!isMe(comment.creator)"
                    text
                    color="neutral"
                    class="v-btn-normalize w-100 py-2 v-btn-text-left"
                    @click="onRepChild(comment)"
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
                :ref="`pre-cmt-ref-${comment.id}`"
                style="line-height: 20px"
                class="comment-block-text-part font-weight-regular neutral--text"
                :class="showAllIds.includes(comment.id) ? 'show-all' : ''"
                >{{ comment.content }}</pre
              >
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
                :clear-selected-data="clearSelectedCmt"
                :resolve-edit-local="resolveEditLocal"
              />
            </div>
            <p
              v-show="comment.total_likes"
              class="mb-0 total-like-cmt ml-auto pointer neutral_color_sub2--text box-shadow--mod-lighter app_bg"
              :class="comment.file ? 'cmt-img-tl' : ''"
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
            <!-- <v-img
              :src="comment.file"
              lazy-src="@/assets/images/placeholder.png"
              width="auto"
              height="auto"
              max-width="480"
              max-height="224px"
              @click="previewImg([{ url: comment.file }], 0)"
            >
              <template v-slot:placeholder>
                <img
                  src="@/assets/images/failed-img.svg"
                  alt=""
                  width="100%"
                  height="100%"
                  class="neutral_color_sub4"
                />
              </template>
            </v-img> -->
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
              <span
                class="semantic_error--text pointer"
                @click="clearSelectedCmt"
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
              :class="
                comment.is_liked ? 'semantic_info--text' : 'neutral--text'
              "
              @click="likeClick(comment)"
            >
              {{ sysLanguage.news.likeBtn }}
            </p>
            <p
              class="mb-0 rep-cmt neutral--text pointer"
              @click="onRepChild(comment)"
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
      <div class="list-child">
        <p
          v-if="!showChild.includes(comment.id) && comment.total_children"
          class="child-count neutral--text"
          @click="onShowChild(comment.id)"
        >
          <v-icon color="neutral" size="15"
            >mdi-subdirectory-arrow-right</v-icon
          >
          {{ comment.total_children }} Câu trả lời
        </p>
        <ChildComment
          v-if="showChild.includes(comment.id)"
          :parent-id="comment.id"
          :post-id="postId"
          :f-load-total="comment.total_children"
          :comment-rep-from-parent="commentRep"
          :set-comment-rep="setCommentRep"
          :report-comment="reportComment"
        />
      </div>
    </div>
    <div v-if="loadingComment" class="mx-auto" style="width: fit-content">
      <v-progress-circular
        indeterminate
        :width="2"
        :size="24"
        color="neutral"
      ></v-progress-circular>
    </div>
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
import ChildComment from './ChildComment.vue';
import { convertTimeRv } from '@/helpers/dateFormater.js';
import DialogConfirm from '@/components/Dialog/DialogConfirm.vue';
import handleFiles from '@/mixins/handleFiles';
import api from '@/services';
export default {
  components: { RegularAvatarVue, CmtTypeArea, DialogConfirm, ChildComment },
  mixins: [handleFiles],
  props: {
    loadingComment: {
      type: Boolean,
      default: false
    },
    postId: {
      type: Number,
      default: -1
    },
    totalComments: {
      type: Number,
      default: 1
    },
    listComments: {
      type: Array,
      default() {
        return [];
      }
    },
    likeClick: {
      type: Function,
      default() {}
    },
    resolveSubmitLocal: {
      type: Function,
      default() {}
    },
    resolveEditLocal: {
      type: Function,
      default() {}
    },
    removeDataLocal: {
      type: Function,
      default() {}
    },
    reportComment: {
      type: Function,
      default() {}
    }
  },
  data() {
    return {
      selectedCmt: {},
      showConfirmRemoveComment: false,
      selectedCmtToRemove: {},
      commentRep: {},
      loadingRemove: false,
      showChild: [],
      showAllIds: [],
      isColapseText: true
    };
  },
  computed: {
    ...mapGetters({
      userFromAuth: 'userFromAuth'
    }),
    listCommentsComputed() {
      return this.listComments.map((o) => ({
        ...o,
        over9: this.getCmtLineCount(o),
        listChildComments: [...this.listComments]
      }));
    }
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
    toggleColapseText() {
      if (!this.textOver9) {
        return;
      }
      this.isColapseText = !this.isColapseText;
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
    getPostLineCount(comment) {
      setTimeout(() => {
        const el = this.$refs[`pre-cmt-ref-${comment.id}`][0];
        if (!el) {
          return;
        }
        const divHeight = el.offsetHeight;
        const lineHeight = parseInt(el.style.lineHeight);

        const lines = divHeight / lineHeight;
        comment.over9 = lines > 9;
      }, 10);
    },
    onRepChild(comment) {
      this.setCommentRep(comment);
      this.onShowChild(comment.id);
    },
    setCommentRep(comment) {
      this.commentRep = { ...comment };
    },
    onShowChild(_id) {
      const set = new Set([...this.showChild, _id]);

      this.showChild = [...set];
    },
    convertTimeRv(_date) {
      return convertTimeRv(_date);
    },
    isMe(_user) {
      if (!_user) {
        return false;
      }
      return _user.id === this.userFromAuth.id;
    },
    clearSelectedCmt() {
      this.selectedCmt = {};
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
    removeComment(_comment) {
      this.showConfirmRemoveComment = true;
      this.selectedCmtToRemove = { ..._comment };
    },
    cancelRemove() {
      this.showConfirmRemoveComment = false;
      this.selectedCmtToRemove = {};
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
    }
  }
};
</script>

<style lang="scss" scoped>
.news-comments-group {
  gap: 30px;
  padding: 10px 0;
  .each-news-comment {
    .cmt-p {
      display: flex;
      gap: 8px;
    }
  }
  .list-child {
    padding-left: 50px;
    .child-count {
      font-weight: 600;
      font-size: 12px;
      margin: 0px 0 8px;
      cursor: pointer;
      display: flex;
      align-items: baseline;
      &:hover {
        text-decoration: underline;
      }
    }
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
.total-like-cmt {
  font-weight: 400;
  font-size: 12px;
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
<style lang="scss">
.total-like-cmt {
  padding: 1px 3px;
  border-radius: 12px;

  position: absolute;
  bottom: -1px;
  right: 0;
  transform: translateX(100%);
}
</style>
