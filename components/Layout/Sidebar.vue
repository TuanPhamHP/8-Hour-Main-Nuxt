<template>
  <v-card class="no-box-shadow app_bg">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      class="bg-transparent"
    >
      <v-list dense class="sidebar_tab_navigator pt-0">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          class="each-tab-in-navigator"
          :class="
            item.pathNameMatch.includes(currentPathActive)
              ? 'primary sidebar_ico_active_color--text'
              : 'neutral--text sidebar_ico_active_color'
          "
          @click="item.action"
        >
          <!-- "" -->
          <v-list-item-icon>
            <v-icon
              :color="
                item.pathNameMatch.includes(currentPathActive)
                  ? 'sidebar_ico_active_color'
                  : 'secondary_text'
              "
              >{{ item.icon }}</v-icon
            >
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="navigator-title">
              <span
                :class="
                  item.pathNameMatch.includes(currentPathActive)
                    ? 'sidebar_ico_active_color--text'
                    : 'neutral--text'
                "
              >
                <!-- "" -->
                {{ sysLanguage.sidebar[item.title] }}</span
              >
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  name: 'SidebarApp',
  data() {
    return {
      drawer: true,
      items: [
        {
          title: 'news',
          icon: 'mdi-home-variant-outline',
          path: '/',
          pathNameMatch: ['index', 'news', 'news/id'],
          action: () => {
            this.forceReloadNews();
          }
        }

        // {
        //   title: "schedules",
        //   icon: "mdi-calendar-weekend-outline",
        //   path: "/schedules",
        //   pathNameMatch: ["schedules"],
        // },
      ]
    };
  },
  computed: {
    ...mapState({
      mini: (state) => state.sideBarAppMini
    }),
    ...mapGetters({
      sysLanguage: 'sysLanguage'
    }),
    currentPathActive() {
      return this.$route.name;
    }
  },
  methods: {
    forceReloadNews() {
      if (['index', 'news'].includes(this.currentPathActive)) {
        this.$store.commit('news/setListNews', []);
        this.$store.commit('news/setForceToReload');
      } else {
        this.$router.push('/news');
      }
    }
  }
};
</script>

<style lang="scss">
.v-navigation-drawer__border {
  display: none;
}
.sidebar_tab_navigator {
  * {
    text-decoration: none !important;
  }
  padding-left: 8px !important;
  padding-right: 8px !important;
}
.v-navigation-drawer--mini-variant {
  min-width: 64px !important;
}
.each-tab-in-navigator {
  box-shadow: 0px 1px 3px 0px #0000000a, 0px 1px 1px 0px #00000014,
    0px 2px 1px -1px #0000001f, 0px 4px 1px -1px #0000001f !important;

  border-radius: 8px;
  min-height: 48px !important;
  margin-bottom: 12px !important;
  overflow: hidden;
  .v-list-item__icon {
    margin-top: auto !important;
    margin-bottom: auto !important;
    margin-right: 20px !important;
  }
}
.navigator-title {
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
  }
}
</style>
