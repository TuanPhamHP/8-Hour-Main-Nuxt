<template>
  <v-avatar
    :color="backgroundColor"
    :size="size"
    :class="[extClass, !imageUrl || avatarLoadFail ? '' : 'no-background']"
  >
    <img
      v-if="!avatarLoadFail && imageUrl"
      :src="imageUrl"
      alt="user avatar"
      style="object-fit: cover"
      @error="avatarLoadFail = true"
    />
    <span
      v-if="!imageUrl || avatarLoadFail"
      class="white--text text-h6"
      style="font-size: 15px"
      >{{ getCapital(abbrName) }}</span
    >
  </v-avatar>
</template>

<script>
export default {
  props: {
    size: {
      type: Number,
      default: 48,
    },
    extClass: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    abbrName: {
      type: String,
      default: "8 Hours",
    },
    backgroundColor: {
      type: String,
      default: "primary",
    },
  },
  data() {
    return {
      avatarLoadFail: false,
    }
  },
  methods: {
    getCapital(_name) {
      const _nameSpl = _name.split(" ")
      return `${String(_nameSpl[0].slice(0, 1))}${String(
        _nameSpl[_nameSpl.length - 1].slice(0, 1),
      )}`
    },
  },
}
</script>

<style>
.v-application .v-avatar {
  border-color: transparent !important;
}
.v-application .no-background {
  background-color: transparent !important;
}
</style>
