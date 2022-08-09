<template>
  <v-menu
    id="scroll-target"
    @scroll="onScroll"
    transition="slide-y-transition"
    bottom
    offset-y
    content-class="scroll-y-mod_big"
    max-height="90vh"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="mx-3" v-bind="attrs" v-on="on" @click="onReceived">
        <v-badge
          :content="messagesComputed"
          :value="messagesComputed"
          color="semantic_error"
          overlap
        >
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list width="400px">
      <v-list-item v-for="item in listData" :key="item.id" class="px-0">
        <div
          class="noti-card d-flex"
          :class="item.read_at ? '' : 'unread-noti'"
          @click="onRead(item)"
        >
          <div class="noti-avatar">
            <RegularAvatarVue
              :size="48"
              :abbrName="item.data ? item.data.target : 'U K'"
              :imageUrl="''"
            />
          </div>
          <p class="mb-0 noti-content-text">
            <!-- <span class="noti-title">{{
              item.data ? item.data.title : ""
            }}</span> -->
            <span class="noti-body neutral--text limit-line-3">
              {{ item.data.body }}
            </span>
            <span class="time-body neutral_color_sub2--text d-block">
              {{ item.created_at ? convertTimeRv(item.created_at) : "-" }}
            </span>
          </p>
        </div>
      </v-list-item>
      <v-skeleton-loader
        v-if="ableToLoadmore"
        type="list-item-avatar-three-line"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="ableToLoadmore"
        type="list-item-avatar-three-line"
      ></v-skeleton-loader>
      <v-skeleton-loader
        v-if="ableToLoadmore"
        type="list-item-avatar-three-line"
      ></v-skeleton-loader>
    </v-list>
  </v-menu>
</template>

<script>
import api from "@/services"
import RegularAvatarVue from "../User/RegularAvatar.vue"
import { convertTimeRv } from "@/helpers/dateFormater.js"
export default {
  components: { RegularAvatarVue },
  data() {
    return {
      listData: [],
      messages: 0,
      maxCount: 100,
      currentCount: 20,
      stepCount: 5,
      refNoti: 0,
    }
  },
  computed: {
    ableToLoadmore() {
      return this.currentCount < this.maxCount
    },
    messagesComputed() {
      return this.messages > 9 ? "9+" : this.messages
    },
  },
  watch: {
    currentCount() {
      this.getListData()
    },
  },
  mounted() {
    this.getListData()
  },
  methods: {
    convertTimeRv(_date) {
      return convertTimeRv(_date)
    },
    onScroll(e) {
      if (this.refNoti) {
        clearTimeout(this.refNoti)
      }
      this.refNoti = setTimeout(() => {
        if (this.currentCount >= this.maxCount) {
          return
        }
        const scrH = e.target.scrollHeight
        const scrT = e.target.scrollTop
        const eH = e.target.clientHeight
        const gap = scrH - scrT - eH
        if (gap < 300) {
          this.currentCount += this.stepCount
        }
      }, 240)
    },
    onRead(data) {
      data.read_at = true
      this.navigateNoti(data)
      api.noti.updateRead(data.id)
    },
    navigateNoti(_data) {
      console.log(_data)
      if (!_data.data) {
        return
      }
      // ANNOUNCEMENT REPORT
      const dataObj = _data.data
      if (dataObj.event === "announcement.comment.reported" && dataObj.id) {
        this.$router.push(`/news/${dataObj.id}`)
      }
      if (dataObj.event === "announcement.commented" && dataObj.id) {
        this.$router.push(`/news/${dataObj.id}`)
      }
      if (dataObj.event === "announcement.published" && dataObj.id) {
        this.$router.push(`/news/${dataObj.id}`)
      }
      if (dataObj.event === "announcement.liked" && dataObj.id) {
        this.$router.push(`/news/${dataObj.id}`)
      }
      if (dataObj.event === "announcement.comment.replied" && dataObj.id) {
        this.$router.push(`/news/${dataObj.id}`)
      }
    },
    onReceived() {
      api.noti.updateReceived()
      this.messages = 0
    },
    async getListData() {
      this.loadingSearch = true
      const payload = {
        size: this.currentCount,
      }
      const res = await api.noti.getListData(payload)
      this.isFirstLoading = false
      this.loadingSearch = false
      this.firstSync = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getNewsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          console.log(res)
          return
        }
        const dataObj = res.data.data
        this.listData = dataObj.notifications
        this.maxCount = dataObj.meta.pagination.total
        this.messages = dataObj.meta.total_unreceived
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.noti-card {
  cursor: pointer;
  padding: 4px 16px 12px;
  gap: 12px;
  width: 100%;
  &:hover {
    background-color: #f2f8fa;
  }
  .noti-content-text {
    /* min-height: 90px; */
    display: flex;
    flex-flow: column;
    .noti-body {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.0025em;
    }
    .time-body {
      margin-top: auto;
      font-size: 13px;
      line-height: 20px;
      letter-spacing: 0.0025em;
      padding: 3px 0;
    }
  }
  &.unread-noti {
    position: relative;
    &::after {
      content: "";
      position: absolute;
      right: 2px;
      top: 50%;
      transform: translateY(-50%);
      width: 10px;
      height: 10px;
      border-radius: 100%;
      background-color: #3389ad;
      opacity: 0.8;
    }
  }
}
/* .v-list-notif {
  max-height: calc(100vh - 72px);
} */
</style>
