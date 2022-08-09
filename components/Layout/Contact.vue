<template>
  <v-navigation-drawer
    :mini-variant.sync="mini"
    absolute
    permanent
    right
    width="100%"
    :height="routeName === 'news' ? 'calc(100vh - 80px)' : 'calc(100vh - 80px)'"
    class="contact-drawer box-shadow--mod-lighter"
  >
    <template v-slot:prepend>
      <div class="pt-3 pb-2">
        <p
          class="font-weight-medium text-center mb-0 w-100 neutral--text"
          style="font-size: 20px"
        >
          {{ sysLanguage.contact.title }}
        </p>
      </div>
      <div style="width: calc(100% - 32px); margin: auto">
        <v-tabs
          active-class="primary--text"
          v-model="tab"
          background-color="transparent"
          color="primary"
        >
          <v-tab class="v-tab-normalize">
            {{ sysLanguage.contact.userTabTitle }}
          </v-tab>
          <v-tab class="v-tab-normalize">
            {{ sysLanguage.contact.groupUserTabTitle }}
          </v-tab>
        </v-tabs>
      </div>
    </template>

    <v-divider></v-divider>

    <v-tabs-items v-model="tab" class="mt-3 px-0">
      <v-tab-item>
        <!-- Filter -->
        <div class="filter-wr px-2">
          <div
            class="filter-input"
            :class="contactSearchQuery ? 'border-prim' : ''"
          >
            <input
              v-model="contactSearchQuery"
              type="text"
              :placeholder="sysLanguage.placeholder.textSearch"
              class="input-no-focus font-size-14"
            />
            <v-icon v-if="!contactSearchQuery" color="neutral" size="20"
              >mdi-magnify</v-icon
            >
            <v-icon
              v-if="contactSearchQuery"
              color="semantic_error"
              size="20"
              class="pointer"
              @click="contactSearchQuery = ''"
              >mdi-close</v-icon
            >
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="handleShowAdvanceFilter"
              >
                <v-icon
                  :color="panel && panel.length ? 'primary' : 'neutral'"
                  size="24"
                  >mdi-filter-variant</v-icon
                >
              </v-btn>
            </template>
            <span>{{ sysLanguage.tooltip.advanceFilter }}</span>
          </v-tooltip>
        </div>
        <!--  -->
        <v-expansion-panels
          v-model="panel"
          multiple
          class="no-box-shadow panel-filter-contact mb-2"
          :class="panel.includes(0) ? '' : 'no-btm-border'"
        >
          <v-expansion-panel
            class="no-before"
            :class="panel.includes(0) ? 'mt-1 mb-0' : ''"
          >
            <v-expansion-panel-content>
              <!-- COMPANY FILTER -->
              <v-autocomplete
                v-model="filterCompany"
                clearable
                dense
                solo
                :hide-details="true"
                flat
                placeholder="Công ty"
                :items="companies"
                item-text="name"
                item-value="id"
                class="no-box-shadow v-autocomplete-form__mod my-2"
              ></v-autocomplete>
              <!-- DEPARTMENT FILTER -->
              <v-autocomplete
                v-model="filterDepartment"
                clearable
                :loading="loadingDepartment"
                dense
                solo
                :hide-details="true"
                flat
                placeholder="Phòng ban"
                :items="departmentsComputed"
                item-text="name"
                item-value="id"
                class="no-box-shadow v-autocomplete-form__mod my-2"
              ></v-autocomplete>
              <!-- POSITION FILTER -->
              <v-autocomplete
                v-model="filterPosition"
                clearable
                :loading="loadingPosition"
                dense
                solo
                :hide-details="true"
                flat
                placeholder="Chức vụ"
                :items="positionsComputed"
                item-text="name"
                item-value="id"
                class="no-box-shadow v-autocomplete-form__mod my-2"
              ></v-autocomplete>

              <!-- <div class="btn-group">
                <v-btn
                  :color="'neutral_color_sub4 neutral_color_sub2--text'"
                  class="rounded-lg v-btn-confirm"
                  depressed
                >
                  {{ sysLanguage.button.reset }}
                </v-btn>
                <v-btn
                  :color="'primary'"
                  class="rounded-lg v-btn-confirm"
                  depressed
                >
                  {{ sysLanguage.button.filter }}
                </v-btn>
              </div> -->
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <!-- List -->
        <v-list v-if="!mini" dense class="px-0 pt-4">
          <v-list-item
            v-for="user in listContactsComputed"
            :key="user.id"
            class="px-0 list-contact__wr"
          >
            <UserCard :user="user" />
          </v-list-item>
          <v-list-item
            v-if="!listContactsComputed || !listContactsComputed.length"
            class="no-user-filter_wr"
          >
            <img
              src="@/assets/images/no-user-filter.svg"
              alt="no-user-filter"
              style="max-width: 90%"
            />
            <p class="no-user__text neutral_color_sub2--text">
              Không có kết quả nào phù hợp
            </p>
          </v-list-item>
        </v-list>
      </v-tab-item>
      <v-tab-item>
        <!-- Filter -->
        <div class="filter-wr px-2">
          <div
            class="filter-input font-size-14"
            :class="groupSearchQuery ? 'border-prim' : ''"
          >
            <input
              v-model="groupSearchQuery"
              type="text"
              placeholder="Tìm kiếm"
              class="input-no-focus"
            />
            <v-icon v-if="!groupSearchQuery" color="neutral" size="20"
              >mdi-magnify</v-icon
            >
            <v-icon
              v-if="groupSearchQuery"
              color="semantic_error"
              size="20"
              class="pointer"
              @click="groupSearchQuery = ''"
              >mdi-close</v-icon
            >
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                v-bind="attrs"
                v-on="on"
                class="fk-btn-prim pointer"
                @click="createNewGroupContact"
              >
                <v-icon color="primary" size="24">mdi-plus</v-icon>
              </div>
            </template>
            <span>{{ sysLanguage.tooltip.addNew }}</span>
          </v-tooltip>
        </div>
        <!-- List -->
        <v-list v-if="!mini" dense class="px-0 pt-4">
          <v-list-item
            v-for="group in userGroupsComputed"
            :key="group.id"
            class="px-0"
          >
            <UserGroup :group="group" />
          </v-list-item>
          <v-list-item
            v-if="!listUserGroup || !listUserGroup.length"
            class="no-user-filter_wr"
          >
            <img
              src="@/assets/images/no-user-group.svg"
              alt="no-user-filter"
              style="max-width: 90%"
            />
            <p class="no-user__text neutral_color_sub2--text">
              Hiện bạn chưa có nhóm người dùng nào
            </p>
            <v-btn
              color="primary"
              text
              class="primary_light primary_light-opacity btn-add-group"
              @click="createNewGroupContact"
            >
              Tạo nhóm mới
            </v-btn>
          </v-list-item>
          <v-list-item
            v-if="
              listUserGroup.length &&
              (!userGroupsComputed || !userGroupsComputed.length)
            "
            class="no-user-filter_wr"
          >
            <img
              src="@/assets/images/no-user-filter.svg"
              alt="no-user-filter"
              style="max-width: 90%"
            />
            <p class="no-user__text neutral_color_sub2--text">
              Không có kết quả nào phù hợp
            </p>
          </v-list-item>
        </v-list>
      </v-tab-item>
    </v-tabs-items>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex"
// eslint-disable-next-line no-unused-vars
import { tStr } from "validation_t/src"
import UserCard from "@/components/ContactSidebar/UserCard.vue"
import UserGroup from "@/components/ContactSidebar/UserGroup.vue"
import api from "@/services"
export default {
  components: { UserCard, UserGroup },
  data() {
    return {
      tab: null,
      mini: false,
      panel: [],

      contactSearchQuery: "",
      groupSearchQuery: "",
      refGetListPositions: 0,
      listDepartments: [],
      listPositions: [],
      filterCompany: null,
      filterDepartment: null,
      filterPosition: null,

      advanceFilter: true,
      loadingDepartment: false,
      loadingPosition: false,
    }
  },
  computed: {
    ...mapState({
      currentRightSideTab: (state) => state.currentRightSideTab,
      sideBarContactMini: (state) => state.sideBarContactMini,
      listContacts: (state) => state.users.listContacts,
      listUsers: (state) => state.users.listUsers,
      listUserGroup: (state) => state.users.listUserGroup,
      companies: (state) => state.users.companies,
      departments: (state) => state.users.departments,
      positions: (state) => state.users.positions,
    }),

    ...mapGetters({
      userFromAuth: "userFromAuth",
    }),
    userGroupsComputed() {
      const _textQuery = String(this.groupSearchQuery).trim()
      if (!_textQuery) {
        return this.listUserGroup
      } else {
        return this.listUserGroup
          .filter((o) => {
            return this.matchTextNoAscent(this.groupSearchQuery, o.name)
          })
          .map((o) => ({
            ...o,
            hlName: this.highlightMatchTextNoAscent(
              this.groupSearchQuery,
              o.name,
            ),
          }))
      }
    },
    departmentsComputed() {
      return this.departments.filter((o) => o.company_id === this.filterCompany)
    },
    listContactsComputed() {
      const _textQuery = String(this.contactSearchQuery).trim()

      if (!this.advanceFilter) {
        if (!_textQuery) {
          return this.listContacts
        } else {
          return this.listContacts
            .filter((o) => {
              return (
                o.id !== this.userFromAuth.id &&
                this.matchTextNoAscent(this.contactSearchQuery, o.name)
              )
            })
            .map((o) => ({
              ...o,
              hlName: this.highlightMatchTextNoAscent(
                this.contactSearchQuery,
                o.name,
              ),
            }))
        }
      } else {
        let rslt = this.listContacts
          .filter((o) => {
            return this.matchTextNoAscent(this.contactSearchQuery, o.name)
          })
          .map((o) => ({
            ...o,
            hlName: this.highlightMatchTextNoAscent(
              this.contactSearchQuery,
              o.name,
            ),
          }))
        if (this.filterCompany) {
          rslt = rslt.filter((o) => +o.company_id === +this.filterCompany)
        }
        if (this.filterDepartment) {
          rslt = rslt.filter(
            (o) =>
              o.position &&
              +o.position.department_id === +this.filterDepartment,
          )
        }
        if (this.filterPosition) {
          rslt = rslt.filter((o) => +o.position_id === +this.filterPosition)
        }
        return rslt.filter((o) => o.id !== this.userFromAuth.id)
      }
    },
    positionsComputed() {
      const arr = this.positions.map((o) => ({
        ...o,
        company_id:
          o.department && o.department.company_id
            ? o.department.company_id
            : -1,
      }))
      return arr.filter(
        (o) =>
          o.company_id === this.filterCompany &&
          (this.filterDepartment
            ? o.department_id === this.filterDepartment
            : true),
      )
    },
  },
  watch: {
    sideBarContactMini() {
      this.mini = this.sideBarContactMini
    },
    userFromAuth: {
      deep: true,
      handler() {
        if (this.userFromAuth && this.userFromAuth.id) {
          this.initFilterState()
        }
      },
    },
    filterDepartment: {
      deep: true,
      handler() {
        this.filterPosition = null
      },
    },
    currentRightSideTab: {
      deep: true,
      handler() {
        this.tab = this.currentRightSideTab
      },
    },
    filterCompany: {
      deep: true,
      handler(newData, oldData) {
        if (oldData) {
          this.filterPosition = null
          this.filterDepartment = null
        }
      },
    },
  },
  mounted() {
    if (this.userFromAuth && this.userFromAuth.id) {
      this.initFilterState()
    }
    this.tab = this.currentRightSideTab
  },
  methods: {
    //
    filterUChanges() {
      const params = {
        pagination: false,
      }
      if (this.filterCompany) {
        params.company_id = this.filterCompany
      }
      if (this.filterDepartment) {
        params.department_id = this.filterDepartment
      }
      this.dbGetListPositions(params)
    },
    dbGetListPositions(params) {
      if (this.refGetListPositions) {
        clearTimeout(this.refGetListPositions)
      }
      this.refGetListPositions = setTimeout(() => {
        this.getListPositions(params)
      }, 100)
    },
    async getListPositions(params) {
      this.loadingPosition = true
      const res = await api.users.getListPositions(params)
      this.loadingPosition = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getPositionsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.listPositions = [...res.data.data.positions]
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    async getListDepartments(params) {
      this.loadingDepartment = true
      const res = await api.users.getListDepartments(params)
      this.loadingDepartment = false
      if (!res) {
        this.$store.commit(
          "toast/getError",
          this.sysLanguage.snackbar.getDepartmentsFail,
        )
        return
      }
      try {
        if (res.status && res.status >= 400) {
          this.$store.commit("toast/getError", res.data.message)
          return
        }
        this.listDepartments = [...res.data.data.departments]
      } catch (error) {
        this.$store.commit("toast/getError", `${error}`)
      }
    },
    handleShowAdvanceFilter() {
      if (this.panel && this.panel.length) {
        this.panel = []
        return
      }
      this.panel = [0]
    },
    initFilterState() {
      this.filterCompany = this.userFromAuth.company
        ? this.userFromAuth.company.id
        : null
      this.filterDepartment = this.userFromAuth.position
        ? this.userFromAuth.position.department
          ? this.userFromAuth.position.department.id
          : null
        : null
    },
    createNewGroupContact() {
      this.$store.commit("setCurrentRightSideActive", 4)
    },
  },
}
</script>

<style lang="scss" scoped>
.contact-list {
  width: 100%;
}

.filter-wr {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
<style lang="scss">
.font-size-14 {
  font-size: 14px !important;
}
.contact-drawer {
  border-radius: 8px;
}
.filter-input {
  display: flex;
  align-items: center;
  border: 1px solid #f2f2f2;
  border-radius: 8px;
  padding: 9px 12px;
  width: 100%;
  input,
  textarea {
    width: 100%;
    resize: none;
  }
}
.btn-group {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  .v-btn__content {
    font-size: 14px !important;
    letter-spacing: 0.0125em;
  }
}
.panel-filter-contact:not(.no-btm-border) {
  border-bottom: 1px solid #f2f2f2;
}
.v-list-item.no-user-filter_wr {
  display: flex;
  flex-flow: column;
  padding-top: 75px;
  p {
    text-align: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.005em;
    margin-top: 16px;
  }
}
.fk-btn-prim {
  border-radius: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 42px;
  min-height: 42px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0.8)
    ),
    #006c99;
}
.btn-add-group {
  span {
    font-weight: 600;
    font-size: 14px;
    letter-spacing: 0.0125em;
  }
}
</style>
<style lang="scss">
.panel-filter-contact {
  .v-expansion-panel-content__wrap {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}
.primary_light-opacity {
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.8)
  );
}
.contact-drawer {
  .v-slide-group__content.v-tabs-bar__content {
    justify-content: center;
    /* margin: auto; */
  }
}
.contact-drawer {
  .v-navigation-drawer__content {
    &::-webkit-scrollbar {
      width: 8px;
      border-radius: 4px;
    }

    /* Track */
    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0);
    }

    /* Handle */
    &::-webkit-scrollbar-thumb {
      background: rgba(136, 136, 136, 0);
      border-radius: 4px;
    }
    &:hover {
      /* Handle on hover */
      &::-webkit-scrollbar-thumb {
        background: rgba(136, 136, 136, 0.693);
      }
    }
  }
}
</style>
