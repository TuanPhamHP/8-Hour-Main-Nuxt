<template>
  <v-dialog v-model="dialog" persistent max-width="820" class="rounded-lg">
    <v-card>
      <v-card-title class="small-title black--text px-3">
        {{ sysLanguage.title.addUserTitle }}
      </v-card-title>

      <!-- BODY -->

      <div>
        <div class="filter-wr px-2">
          <div class="filter-input">
            <input
              v-model="contactSearchQuery"
              type="text"
              :placeholder="sysLanguage.placeholder.textSearch"
              class="input-no-focus font-size-14"
            />
            <v-icon color="neutral" size="20">mdi-magnify</v-icon>
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                v-on="on"
                @click="handleShowAdvanceFilter"
                class="ml-auto d-block"
              >
                <v-icon
                  :color="panel && panel.length ? 'primary' : 'neutral'"
                  size="30"
                  >mdi-filter-variant</v-icon
                >
              </v-btn>
            </template>
            <span>{{ sysLanguage.tooltip.advanceFilter }}</span>
          </v-tooltip>
          <!-- <v-btn
            @click="handleShowAdvanceFilter"
            width="fit-content"
            :color="panel && panel.length ? 'primary' : 'neutral'"
            text
            tile
            class="ml-auto d-block v-btn-normalize text-right my-2"
          >
            Tìm kiếm nâng cao
          </v-btn> -->
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
        <div class="list-users">
          <v-list
            dense
            class="px-0 list-users-filtered"
            :class="
              listUserSelectedIds && listUserSelectedIds.length
                ? 'border-right'
                : ''
            "
          >
            <div
              class="select-all-btn-fk neutral_color_sub1--text pointer"
              @click="toggleSelectAll"
            >
              {{ sysLanguage.button.selectAll }}
              <span>
                <img
                  v-if="!isCheckAll"
                  src="@/assets/images/uncheck-users.svg"
                  alt=""
                />
                <img v-else src="@/assets/images/checked-users.svg" alt="" />
              </span>
            </div>
            <v-list-item
              v-for="user in listUsersComputed"
              :key="user.id"
              class="px-0 list-contact__wr"
            >
              <UserCardRadio
                :user="user"
                :userClick="toggleUser"
                :isCheck="listUserSelectedIds.includes(user.id)"
              />
            </v-list-item>
            <v-list-item
              v-if="!listUsersComputed || !listUsersComputed.length"
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
          <v-list
            v-if="listUserSelectedIds && listUserSelectedIds.length"
            dense
            class="px-2 py-2 list-users-selected primary_light_o1"
          >
            <v-list-item
              v-for="user in listUserSelectedComputed"
              :key="user.id"
              class="px-0 list-contact__wr"
            >
              <UserCardBin :user="user" :userClick="toggleUser" />
            </v-list-item>
          </v-list>
        </div>
      </div>
      <!-- ACTIONS -->
      <div class="news_block_bg py-2 px-3 group-btn-add-user mt-1">
        <v-btn
          :color="'neutral_color_sub4 neutral_color_sub2--text'"
          class="rounded-lg v-btn-confirm"
          @click="cancelAction"
          depressed
        >
          {{ sysLanguage.logout.cancelBtn }}
        </v-btn>
        <v-btn
          :color="'primary'"
          class="rounded-lg v-btn-confirm"
          depressed
          @click="confirmAction(listUserSelectedIds)"
        >
          {{ sysLanguage.logout.approveBtn }}
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import UserCardRadio from "@/components/ContactSidebar/UserCardRadio.vue"
import UserCardBin from "@/components/ContactSidebar/UserCardBin.vue"
export default {
  components: { UserCardRadio, UserCardBin },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    confirmAction: {
      type: Function,
      default() {},
    },
    cancelAction: {
      type: Function,
      default() {},
    },
    usersDefaultIds: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      panel: [],
      dialog: false,
      contactSearchQuery: "",
      refGetListPositions: 0,
      listDepartments: [],
      listPositions: [],
      filterCompany: null,
      filterDepartment: null,
      filterPosition: null,

      advanceFilter: true,
      loadingDepartment: false,
      loadingPosition: false,
      listUserSelectedIds: [],
    }
  },
  computed: {
    ...mapState({
      listUsers: (state) => state.users.listUsers,
      companies: (state) => state.users.companies,
      departments: (state) => state.users.departments,
      positions: (state) => state.users.positions,
    }),
    ...mapGetters({
      userFromAuth: "userFromAuth",
    }),
    departmentsComputed() {
      return this.departments.filter((o) => o.company_id === this.filterCompany)
    },
    isCheckAll() {
      const listUserComputedIds = this.listUsersComputed.map((o) => o.id)
      if (!listUserComputedIds.length) {
        return false
      }
      return listUserComputedIds.every((o) =>
        this.listUserSelectedIds.includes(o),
      )
    },
    listUsersComputed() {
      const _textQuery = String(this.contactSearchQuery).trim()
      // const userMatch = this.listUsers.filter(o => {
      //   return o.company_id === this.
      // })
      if (!this.advanceFilter) {
        if (!_textQuery) {
          return this.listUsers
        } else {
          return this.listUsers
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
        }
      } else {
        let rslt = this.listUsers
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
        return rslt
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
    listUserSelectedComputed() {
      return this.listUsers.filter((o) =>
        this.listUserSelectedIds.includes(o.id),
      )
    },
  },
  watch: {
    isVisible() {
      this.dialog = this.isVisible
      this.listUserSelectedIds = []
      if (this.isVisible) {
        if (this.usersDefaultIds && this.usersDefaultIds.length) {
          this.listUserSelectedIds = [...this.usersDefaultIds]
        }
      }
    },
    filterDepartment: {
      deep: true,
      handler() {
        this.filterPosition = null
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
    if (this.usersDefaultIds && this.usersDefaultIds.length) {
      this.listUserSelectedIds = [...this.usersDefaultIds]
    }
  },
  methods: {
    toggleSelectAll() {
      const listUserComputedIds = this.listUsersComputed.map((o) => o.id)
      if (!listUserComputedIds.length) {
        return
      }
      if (
        listUserComputedIds.every((o) => this.listUserSelectedIds.includes(o))
      ) {
        this.listUserSelectedIds = this.listUserSelectedIds.filter(
          (o) => !listUserComputedIds.includes(o),
        )
      } else {
        let set = new Set([...listUserComputedIds, ...this.listUserSelectedIds])
        this.listUserSelectedIds = [...set]
      }
    },
    handleShowAdvanceFilter() {
      if (this.panel && this.panel.length) {
        this.panel = []
        return
      }
      this.panel = [0]
    },
    toggleUser(_user) {
      console.log(_user)
      if (this.listUserSelectedIds.includes(_user.id)) {
        this.listUserSelectedIds = this.listUserSelectedIds.filter(
          (o) => o !== _user.id,
        )
      } else {
        this.listUserSelectedIds.push(_user.id)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.filter-wr {
  display: flex;
  align-items: center;
  gap: 8px;
}
.select-all-btn-fk {
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  margin-left: auto;
  justify-content: flex-end;
  padding-right: 2px;
  margin-bottom: 16px;
  font-weight: 400;
  font-size: 14px;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
  }
}
.list-users {
  display: flex;
  padding: 0 12px;
  gap: 16px;
  .list-users-selected,
  .list-users-filtered {
    flex: 1 0 0;
    max-height: 420px;
    overflow-y: scroll;
    &.border-right {
      border-right: 1px solid #f2f2f2;
    }
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
  .list-users-selected {
    border-radius: 8px;
  }
}
.group-btn-add-user {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;
}
.small-title {
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 22px !important;
  border-bottom: 1px solid #f2f2f2;
  margin-bottom: 12px;
}
</style>
