<template>
  <div class="type-area e-comment">
    <div class="type-area__top">
      <div class="type-block app_bg">
        <!-- <div
        @keyup="showContent"
        contentEditable="true"
        :data-text="sysLanguage.placeholder.newsComments"
        style="user-select: text; width: 100%"
        class="type-edit"
      ></div> -->
        <v-textarea
          v-model="content"
          autofocus
          dense
          auto-grow
          hide-details
          class="v-texarea-normalize my-0"
          :rows="1"
          :placeholder="sysLanguage.placeholder.newsComments"
          @keyup.exact.enter.prevent="handleSubmitComment"
          @keypress.exact.enter.prevent
          @keyup.exact.esc="clearSelectedData"
        >
        </v-textarea>
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
              <label for="etype-photo" style="height: 24px">
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
        id="etype-photo"
        class="d-none"
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.svg"
        @change="onFileChangeImage"
      />
    </div>
    <div
      v-if="fileClipBoard && fileClipBoard.length"
      class="type-area__bottom white"
    >
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
import Sticker from '../DropMenu/Sticker.vue';
import comments from '@/mixins/comments';
export default {
  components: { Sticker },
  mixins: [comments],
  props: {
    localSubmit: {
      type: Function,
      default() {}
    },
    clearSelectedData: {
      type: Function,
      default() {}
    },
    resolveEditLocal: {
      type: Function,
      default() {}
    },
    svSubmit: {
      type: Function,
      default() {}
    },
    newsId: {
      type: Number,
      default: 0
    },
    commentRepFromParent: {
      type: Object,
      default() {
        return {};
      }
    },
    data: {
      type: Object,
      default() {
        return {};
      }
    }
  },
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
    })
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.content = this.parseCommentTextIp(this.data.content);
      }
    }
  },
  mounted() {
    this.content = this.parseCommentTextIp(this.data.content);
  },
  methods: {
    showContent(e) {
      console.log(e.target);
    },
    getPendingComment(_content) {
      return {
        ...this.data,
        is_fake: true,
        content: _content
      };
    },
    clearData() {
      this.content = '';
      this.fileClipBoard = null;
      try {
        document.getElementById('etype-photo').value = null;
      } catch (error) {
        console.log(error);
      }
    },
    clearImage() {
      this.fileClipBoard = null;
      try {
        document.getElementById('etype-photo').value = null;
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
      if (fileClipBoard && fileClipBoard.length) {
        formData.append('file', fileClipBoard[0].blob);
      }
      const pendingComment = this.getPendingComment(content);

      this.resolveEditLocal(pendingComment, formData);
      this.clearSelectedData();
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
  padding: 0px;
}
.type-area__top {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px !important;
  textarea {
    font-size: 14px !important;
  }
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
  padding: 2px 0px;
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
.e-comment {
  .v-text-field__slot {
    textarea {
      font-size: 14px !important;
    }
  }
}
</style>
