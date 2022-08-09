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
        <!-- <div
        @keyup="showContent"
        contentEditable="true"
        :data-text="sysLanguage.placeholder.newsComments"
        style="user-select: text; width: 100%"
        class="type-edit"
      ></div> -->
        <v-textarea
          :id="`type-area-for-${newsId}`"
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
        ></v-textarea>
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
              <label for="type-photo" style="height: 24px">
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
        id="type-photo"
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
    localSubmit: {
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
    })
  },
  methods: {
    showContent(e) {
      console.log(e.target);
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
        document.getElementById('type-photo').value = null;
      } catch (error) {
        console.log(error);
      }
    },
    clearImage() {
      this.fileClipBoard = null;
      try {
        document.getElementById('type-photo').value = null;
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
