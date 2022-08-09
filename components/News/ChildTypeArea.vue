<template>
  <div class="type-area">
    <div class="type-area__top">
      <RegularAvatarVue
        :size="36"
        :abbr-name="userFromAuth.name"
        :imageUrl="userFromAuth.avatar ? userFromAuth.avatar.url : ''"
        :extClass="'mt-1'"
      />
      <div class="type-block app_bg">
        <div
          :id="`div-type-area-for--cmt-${parentId}`"
          data-lexical-editor="true"
          @keypress.exact.enter.prevent="showContent"
          contentEditable="true"
          :data-text="sysLanguage.placeholder.newsComments"
          style="user-select: text; width: 100%; line-height: 32px"
          class="type-edit neutral--text"
        ></div>
        <!-- <v-textarea
          :id="`type-area-for--cmt-${parentId}`"
          v-model="content"
          dense
          auto-grow
          hide-details
          class="v-texarea-normalize my-0"
          :class="
            commentRepFromParent && commentRepFromParent.creator
              ? 'v-textarea-hasmention'
              : ''
          "
          :rows="1"
          :placeholder="sysLanguage.placeholder.newsComments"
          @keyup.exact.enter.prevent="handleSubmitComment"
          @keypress.exact.enter.prevent
        >
          <template
            v-if="commentRepFromParent && commentRepFromParent.creator"
            v-slot:prepend-inner
          >
            <span class="area-mention semantic_info--text app_bg">
              {{ creatorName }}
            </span>
          </template></v-textarea
        > -->
        <p class="mb-0 icon-wr">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <label
                for=""
                style="height: 24px; position: relative"
                v-bind="attrs"
                v-on="on"
              >
                <Sticker>
                  <img
                    class="pointer"
                    src="@/assets/images/chat-sticker.svg"
                    alt="sticker"
                  />
                </Sticker>
              </label>
            </template>
            <span>{{ sysLanguage.tooltip.typingEmoji }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <label for="type-photo-child" style="height: 24px">
                <img
                  v-bind="attrs"
                  v-on="on"
                  class="pointer"
                  src="@/assets/images/chat-photo.svg"
                  alt="photo"
                />
              </label>
            </template>
            <span>{{ sysLanguage.tooltip.typingPhoto }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <label style="height: 24px">
                <img
                  v-bind="attrs"
                  v-on="on"
                  class="pointer"
                  src="@/assets/images/chat-send.svg"
                  alt="photo"
                  @click="handleSubmitComment"
                />
              </label>
            </template>
            <span>{{ sysLanguage.tooltip.typingSend }}</span>
          </v-tooltip>
        </p>
      </div>
      <input
        id="type-photo-child"
        class="d-none"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.svg"
        @change="onFileChangeImage"
      />
    </div>
    <div v-if="fileClipBoard && fileClipBoard.length" class="type-area__bottom">
      <img
        :src="fileClipBoard[0].src"
        class="comment-image"
        alt="preview-image"
      />

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <img
            v-bind="attrs"
            v-on="on"
            class="pointer pl-2"
            src="@/assets/images/close-x-icon.svg"
            alt="photo"
            @click="clearImage"
          />
        </template>
        <span>{{ sysLanguage.tooltip.remove }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RegularAvatarVue from '../User/RegularAvatar.vue';
import Sticker from '../DropMenu/Sticker.vue';
export default {
  props: {
    listCommentsComputedIds: {
      type: Array,
      default() {
        return [];
      }
    },
    commentRepFromParent: {
      type: Object,
      default() {}
    },
    setCommentRep: {
      type: Function,
      default() {}
    },
    localSubmit: {
      type: Function,
      default() {}
    },
    svSubmit: {
      type: Function,
      default() {}
    },
    parentId: {
      type: Number,
      default: 0
    },
    newsId: {
      type: Number,
      default: 0
    }
  },
  components: { RegularAvatarVue, Sticker },
  data() {
    return {
      content: '',
      fileClipBoard: null,
      sizeLimit: 100 * 1024 * 1024
    };
  },
  computed: {
    ...mapGetters({
      userFromAuth: 'userFromAuth'
    }),
    creatorName() {
      return this.commentRepFromParent && this.commentRepFromParent.creator
        ? '@' + this.commentRepFromParent.creator.name
        : '';
    },
    creatorId() {
      return this.commentRepFromParent && this.commentRepFromParent.creator
        ? +this.commentRepFromParent.creator.id
        : '';
    }
  },
  watch: {
    commentRepFromParent: {
      deep: true,
      handler() {
        // <mention userid="213" tagname="SonLeu"/>!

        if (!this.commentRepFromParent || !this.commentRepFromParent.creator) {
          this.content = '';
          this.$nextTick(() => {
            this.focusTextArea();
          });
          return;
        }
        if (
          ![this.parentId, ...this.listCommentsComputedIds].includes(
            this.commentRepFromParent.id
          )
        ) {
          return;
        }
        this.content = this.creatorName + '  ';
        const target = document.querySelector(
          `#div-type-area-for--cmt-${this.parentId}`
        );
        const p = document.createElement('p');
        p.innerHTML = `<span>&nbsp;</span><mention userid="" tagname="${this.creatorName}" class="highlight--text">${this.creatorName}</mention> <span>&nbsp;</span>`;

        target.innerHTML = p.innerHTML;

        this.$nextTick(() => {
          setTimeout(() => {
            this.focusTextArea();
          }, 10);
        });
      }
    },
    content() {
      this.debounceMention();
    }
  },
  mounted() {
    if (!this.commentRepFromParent || !this.commentRepFromParent.creator) {
      this.content = '';
      this.$nextTick(() => {
        this.focusTextArea();
      });
      return;
    }
    if (this.creatorName) {
      this.content = this.creatorName + '  ';
      const target = document.querySelector(
        `#div-type-area-for--cmt-${this.parentId}`
      );
      const p = document.createElement('p');
      p.innerHTML = `
      <span>&nbsp;</span><mention
        userid="${this.creatorId}"
        tagname="${this.creatorName}"
        class="highlight--text">${this.creatorName}
      </mention><span>&nbsp;</span>
      `;

      target.innerHTML = p.innerHTML;
    }

    this.$nextTick(() => {
      this.focusTextArea();
    });
  },

  methods: {
    setCaret(id) {
      try {
        const el = document.getElementById(id);
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(el.childNodes[el.childNodes.length - 1], 0);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
      } catch (error) {
        console.log(error);
      }
    },
    focusTextArea() {
      try {
        // document.querySelector(`#type-area-for--cmt-${this.parentId}`).focus()
        document
          .querySelector(`#div-type-area-for--cmt-${this.parentId}`)
          .focus();
        // setTimeout(() => {
        //   const lastSChild = [
        //     ...document.querySelector(
        //       `#div-type-area-for--cmt-${this.parentId}`,
        //     ).children,
        //   ].pop()
        //   lastSChild.setAttribute("tabindex", "1")
        //   lastSChild.focus()
        // }, 10)
        setTimeout(() => {
          this.setCaret(`div-type-area-for--cmt-${this.parentId}`);
        }, 10);
      } catch (error) {
        console.log(error);
      }
    },
    parseContent(_txt) {
      if (!_txt || !String(_txt).trim()) {
        return '';
      }

      return this.creatorName
        ? String(_txt).replaceAll(
            this.creatorName,
            `<mention userid="${
              this.creatorId
            }" tagname="${this.creatorName.replaceAll('@', '')}" />`
          )
        : _txt;
    },
    showContent(e) {
      const txt = e.target.innerText;
      e.target.innerHTML = '';
      this.content = this.parseContent(txt);
      this.handleSubmitComment();
    },
    debounceMention() {
      if (this.refMention) {
        clearInterval(this.refMention);
      }
      this.refMention = setTimeout(() => {
        if (
          this.content.slice(0, this.creatorName.length) !== this.creatorName
        ) {
          console.log(this.content.slice(0, this.creatorName.length));
          console.log(this.creatorName);
          this.setCommentRep({});
        }
      }, 100);
    },
    getPendingComment(_id, _content) {
      return {
        id: _id,
        is_fake: true,
        content: _content,
        parent_id: null,
        is_approved: true,
        total_likes: 0,
        total_children: 0,
        is_liked: false,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        file: null,
        creator: {
          ...this.userFromAuth
        }
      };
    },
    clearData() {
      this.content = '';
      this.fileClipBoard = null;
      try {
        document.getElementById('type-photo-child').value = null;
      } catch (error) {
        console.log(error);
      }
    },
    clearImage() {
      this.fileClipBoard = null;
      try {
        document.getElementById('type-photo-child').value = null;
      } catch (error) {
        console.log(error);
      }
    },
    handleSubmitComment() {
      if (
        (!this.content || !String(this.content).trim()) &&
        !this.fileClipBoard
      ) {
        return;
      }
      const content = this.content;
      const fileClipBoard = this.fileClipBoard ? [...this.fileClipBoard] : null;
      this.clearData();
      const formData = new FormData();
      formData.append('content', content);
      formData.append('parent_id', this.parentId);
      if (fileClipBoard && fileClipBoard.length) {
        formData.append('file', fileClipBoard[0].blob);
      }
      const fkId = new Date().getTime();
      const pendingComment = this.getPendingComment(fkId, content);

      this.localSubmit(pendingComment);
      this.svSubmit(formData, fkId);
    },

    onFileChangeImage(event) {
      const files = event.target.files;
      for (const file of files) {
        if (file.size > this.sizeLimit) {
          this.$store.commit(
            'toast/getError',
            this.sysLanguage.snackbar.fileOverSizeLimit
          );
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target.result;
          // const { width, height } = await getImageDimensions(img);
          const _id = `${new Date().getTime()}_${Math.random()}`;
          this.fileClipBoard = [
            {
              _id,
              name: file.name,
              src: event.target.result,
              type: 'image',
              blob: file,
              sizes: file.size,
              status: 'queue'
            }
          ];
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.type-area {
  padding: 8px 0 16px;
}
.type-area__top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.type-area__bottom {
  padding-left: 50px;
  padding-top: 4px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  img.comment-image {
    width: auto;
    height: auto;
    max-height: 160px;
    max-width: 160px;
    border-radius: 8px;
  }
}
.type-block {
  width: 100%;
  display: flex;
  padding: 8px 16px;
  border-radius: 32px;
  .icon-wr {
    align-self: flex-end;
    display: flex;
    gap: 8px;
    align-items: center;
    height: 32px;
  }

  .type-edit {
    &:focus {
      /* border: none !important; */
      outline: none !important;
    }
  }
}
</style>
<style lang="scss">
.area-mention {
  white-space: nowrap;
}
.v-textarea-hasmention {
  .v-input__slot {
    position: relative;
  }
  .v-input__prepend-inner {
    position: absolute;
    top: 6px;
    left: 0;
    z-index: 2;
    padding: 0 !important;
  }
}
</style>
