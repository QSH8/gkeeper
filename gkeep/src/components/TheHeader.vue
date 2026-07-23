<template>
  <header class="the-header">
    <div class="header-container">
      <div v-click-outside="closeMenu" class="header-left">
        <button class="icon-btn burger-btn" @click="toggleMenu" aria-label="Открыть меню">
          <div class="burger-icon" :class="{ 'is-active': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <HeaderMenu :is-open="isMenuOpen" @close="closeMenu" />
      </div>
      <div class="header-center">
        <router-link to="/" class="logo">Gkeep</router-link>
      </div>
      <div class="header-right">
        <router-link to="/profile" class="icon-btn user-btn" aria-label="Личный кабинет">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </router-link>
      </div>
    </div>
    <TheBreadcrumbs />
  </header>
</template>

<script>
import HeaderMenu from './HeaderMenu.vue';
import TheBreadcrumbs from './TheBreadcrumbs.vue';

export default {
  name: 'TheHeader',
  components: {
    HeaderMenu,
    TheBreadcrumbs,
  },

  data() {
    return {
      isMenuOpen: false
    };
  },

  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },

    closeMenu() {
      this.isMenuOpen = false
    }
  }
};
</script>

<style scoped>
.the-header {
  position: fixed;
  /* Всегда прикреплен сверху */
  top: 0;
  left: 0;
  width: 100%;
  height: fit-content;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.3);

  /* Выше, чем HeaderMenu */
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 15px;
}

.header-right {
  justify-content: flex-end;
}

.header-center {
  flex: 1;
  text-align: center;
}

.logo {
  font-weight: bold;
  text-decoration: none;
  color: #333;
  font-size: 1rem;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
}

.burger-icon {
  width: 20px;
  height: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #333;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.burger-icon.is-active span:nth-child(1) {
  transform: translateY(5px) rotate(45deg);
}

.burger-icon.is-active span:nth-child(2) {
  opacity: 0;
}

.burger-icon.is-active span:nth-child(3) {
  transform: translateY(-5px) rotate(-45deg);
}
</style>