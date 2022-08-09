<template>
  <div
    v-if="onShow"
    ref="fpvw"
    class="full-page-show"
    tabindex="-1"
    @keydown="handleKeypressed"
  >
    <div class="full-page-header">
      <button
        class="btn bg-transparent btn-no-outline btn-close-preview-page d-block ml-auto text-white font-size-24 font-weight-bold position-relative"
        @click="closeView"
      >
        <!-- <span class="" style="font-size: 21px">X</span> -->
      </button>
    </div>
    <div class="body--t d-flex">
      <div class="prev-t nav--mod-t d-flex align-center justify-center">
        <img
          v-if="currentTye === 'image'"
          src="@/assets/images/prev-btn.svg"
          alt=""
          height="48px"
          class="pointer nav-icon-t"
          @click="prevImage"
        />
      </div>
      <div class="main-content-t w-100">
        <div class="full-features d-flex justify-end my-3">
          <img
            src="@/assets/images/downloadimage.svg"
            alt=""
            height="42px"
            class="pointer btn-close-img"
            @click="closeView"
          />
        </div>
        <div class="image-fullsize d-flex align-center justify-center">
          <img
            v-if="currentTye === 'image'"
            id="fz-img"
            :src="returnImagesURL(selectedImage) || ''"
            draggable="false"
            alt=""
            :class="returnNatural(selectedImage)"
          />
          <!-- VIDEO -->
          <video
            v-if="currentTye === 'video'"
            width="100%"
            controls="controls"
            class="video-preview pointer btn-no-outline"
            preload="none"
            autoplay
          >
            <source :src="selectedAttach[0].url + '#t=0.5'" type="video/mp4" />
          </video>
        </div>
        <div
          v-if="currentTye === 'image'"
          id="bottom-album"
          class="bottom-album pt-5"
        >
          <div
            id="wrapper-album"
            class="wrapper-album d-flex"
            :class="selectedAttach.length < 17 ? 'justify-center' : ''"
          >
            <span v-for="(src, idx) in selectedAttach" :key="idx + 'ss'">
              <img
                :src="src.url"
                alt=""
                :name="'imgIdx-' + idx"
                draggable="false"
                :class="selectedImage === src.url ? 'onselected-img' : ''"
                class="blr-img pointer"
                @click="setselectedImage(src.url)"
              />
            </span>
          </div>
        </div>
      </div>
      <div class="next-t nav--mod-t d-flex align-center justify-center">
        <img
          v-if="currentTye === 'image'"
          src="@/assets/images/next-btn.svg"
          alt=""
          height="48px"
          class="pointer nav-icon-t"
          @click="nextImage"
        />
      </div>
    </div>
    <canvas id="myCanvas" class="d-none"></canvas>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    onShow: {
      type: Boolean,
      default: false
    },
    currentTye: {
      type: String,
      default: 'image'
    }
  },

  data() {
    return {
      selectedImage: null
    };
  },
  computed: {
    ...mapState({
      selectedAttach: (state) => state.listImagePreview,
      selectedImgIndex: (state) => state.selectedImgIndex
    }),
    imageUrlArray() {
      return this.currentTye === 'image'
        ? this.selectedAttach.map((o) => o.url)
        : [];
    }
  },
  watch: {
    onShow() {
      if (this.onShow) {
        this.$nextTick(() => {
          this.$refs.fpvw.focus();
        });
        if (this.currentTye === 'image') {
          if (this.selectedImgIndex) {
            this.selectedImage = this.selectedAttach[this.selectedImgIndex].url;
          } else {
            this.selectedImage = this.selectedAttach[0].url;
          }
        }
      }
    }
  },
  methods: {
    returnNatural(_src) {
      const imgs = new Image();
      imgs.setAttribute('src', _src);

      return imgs.naturalHeight >= imgs.naturalWidth
        ? 'height-over-width'
        : 'height-under-width';
    },
    setselectedImage(img) {
      this.selectedImage = img;
    },
    returnImagesURL(_url) {
      return _url.includes('http') ? _url : _url;
    },
    nextImage() {
      this.imageUrlArray.indexOf(this.selectedImage) ===
      this.imageUrlArray.length - 1
        ? (() => {
            this.selectedImage = this.imageUrlArray[0];
            setTimeout(() => {
              document.querySelector('#wrapper-album').style.marginLeft = `0`;
            }, 10);
          })()
        : (this.selectedImage =
            this.imageUrlArray[
              this.imageUrlArray.indexOf(this.selectedImage) + 1
            ]);
      setTimeout(() => {
        if (
          document.querySelector('.onselected-img').offsetLeft >
          document.querySelector('#bottom-album').clientWidth / 2
        ) {
          const count = Math.floor(
            document.querySelector('#bottom-album').clientWidth / 132
          );
          document.querySelector('#wrapper-album').style.marginLeft = `-${
            (+document
              .querySelector('.onselected-img')
              .getAttribute('name')
              .replace('imgIdx-', '') -
              count) *
            64
          }px`;
        }
      }, 1);
    },
    prevImage() {
      this.imageUrlArray.indexOf(this.selectedImage) === 0
        ? (() => {
            this.selectedImage =
              this.imageUrlArray[this.imageUrlArray.length - 1];
            setTimeout(() => {
              if (
                document.querySelector('.onselected-img').offsetLeft >
                document.querySelector('#bottom-album').clientWidth / 2
              ) {
                const count = Math.floor(
                  document.querySelector('#bottom-album').clientWidth / 132
                );
                document.querySelector('#wrapper-album').style.marginLeft = `-${
                  (+document
                    .querySelector('.onselected-img')
                    .getAttribute('name')
                    .replace('imgIdx-', '') -
                    count) *
                  64
                }px`;
              }
            }, 1);
          })()
        : (this.selectedImage =
            this.imageUrlArray[
              this.imageUrlArray.indexOf(this.selectedImage) - 1
            ]);
      setTimeout(() => {
        if (document.querySelector('#wrapper-album').style.marginLeft) {
          const c = Math.floor(
            document
              .querySelector('#wrapper-album')
              .style.marginLeft.replace('px', '')
              .replace('-', '') / 66
          );
          document.querySelector('#wrapper-album').style.marginLeft = `-${
            c - 1 > 0 ? (c - 1) * 60 : 0
          }px`;
        }
      }, 10);
    },
    download(url, name) {
      if (!url) {
        throw new Error('Resource URL not provided! You need to provide one');
      }

      if (!url.includes('http')) {
        url = 'https' + url;
        const a = document.createElement('a');
        a.href = url;
        a.style = 'display: none';

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
        return;
      }
      fetch(url, {
        mode: 'no-cors'
      })
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobURL;
          a.style = 'display: none';
          a.target = '_blank';
          if (name && name.length) a.download = name;
          document.body.appendChild(a);
          a.click();
        })
        .catch((err) => console.log(err));
    },
    closeView() {
      this.$store.commit('setListImagePreview', []);
      this.$store.commit('setSelectedImgIndex', 0);
    },
    downloadImage() {
      // console.log(this.selectedImage);
      // var a = document.createElement('a');
      if (this.currentTye === 'image') {
        this.download(
          this.selectedImage,
          `${this.selectedImage.split('/').pop()}`
        );
        // a.href = this.selectedImage;
        // a.download = `${this.selectedImage.split('/').pop()}`;
      } else {
        this.download(
          this.selectedAttach[0].url || '',
          this.selectedAttach[0].url.split('/').pop()
        );
        // a.href = this.selectedAttach[0]
        //   ? this.selectedAttach[0].url
        //   : '';
        // a.download = this.selectedAttach[0]
        //   ? this.selectedAttach[0].url.split('/').pop()
        //   : '';
      }
      // a.setAttribute('download', 'download');
      // a.setAttribute('target', '_blank');
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    },
    handleKeypressed(ev) {
      if (ev.keyCode === 39) {
        this.nextImage();
      }
      if (ev.keyCode === 37) {
        this.prevImage();
      }
      if (ev.keyCode === 27) {
        this.closeView();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.full-page-show {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 11;
}
.btn-close-preview-page {
  width: 42px;
  height: 42px;
  line-height: 42px;
  padding: 0;
}
.full-page-header {
  background-color: rgba(0, 0, 0, 0.85);
}
.pd-040 {
  padding: 0 40px;
}
.nav--mod-t {
  width: 200px;
  min-width: 200px;
}
.main-content-t {
  height: calc(100vh - 42px);
}
.image-fullsize {
  height: calc(100% - 198px);
  .height-under-width {
    max-width: 100% !important;
    width: auto !important;
    height: auto !important;
    max-height: 100% !important;
  }
  .height-over-width {
    max-width: 100% !important;
    max-height: 100% !important;
    height: auto !important ;
    width: auto !important;
  }
  video {
    max-height: calc(100% - 0px);
  }
}
.nav-icon-t {
  transition: 0.2s ease;
  opacity: 0.8;
  &:hover {
    transform: scale(1.05);
    opacity: 1;
  }
}
.bottom-album {
  overflow: hidden;
  width: calc(100vw - 200px - 200px - 42px);
  margin: auto;
  .wrapper-album {
    transition: 0.2s ease;
    overflow-x: scroll;
    overflow-y: hidden;
    &::-webkit-scrollbar {
      width: 10px;
      height: 0;
    }
  }
  img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    margin: 2px 3px;
    filter: brightness(0.5);
  }
  .onselected-img {
    filter: brightness(1);
  }
  &::-webkit-scrollbar {
    width: 10px;
    height: 0;
  }
}
.btn-close-img {
  position: fixed;
  right: 76px;
  top: 30px;
  transition: 0.2s ease;
  opacity: 0.8;
  &:hover {
    transform: scale(1.05);
    opacity: 1;
  }
}
</style>
