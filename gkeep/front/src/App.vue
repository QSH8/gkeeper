<template>
  <div id="app" class="app-wrapper">
    <TheHeader />

    <main class="app-content">
      <router-view />
    </main>

    <TheFooter />
  </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import TheSidebar from './components/TheSidebar.vue';
import TheFooter from './components/TheFooter.vue';

// Глобальные стили

export default {
  name: 'App',
  components: {
    TheHeader,
    TheSidebar,
    TheFooter,
  }
};
</script>

<style scoped>
#app {
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Запрещает баунс-эффект и скролл всего экрана в iOS */
  background-color: #ffffff; /* Задайте цвет фона, чтобы не было видно белых полос */
}

.app-wrapper {
  display: flex;
  flex-direction: column;
  /* dvh идеально работает в iOS 15.4+ и решает проблему прыгающей высоты */
  height: 100dvh; 
  width: 100%;
}

.app-content {
  margin-top: 60px;
  flex-grow: 1;
}
</style>
