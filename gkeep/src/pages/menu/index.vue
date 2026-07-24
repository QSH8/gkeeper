<template>
  <MenuList v-model:active-category="activeCategory" />
</template>

<script>
import MenuList from './components/MenuList.vue';
export default {
  name: 'Menu',
  components: {
    MenuList,
  },

  data() {
    return {
      activeCategory: '',
    }
  }
}
</script>

<style lang="scss" scoped></style>