<template>
  <div id="app" class="app-container">
    <TheHeader />

    <div class="main-layout">
      <main class="content">
        <router-view />
      </main>
    </div>

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

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout {
  display: flex;
  margin-top: 60px;
  flex: 1;
}

.content {
  flex: 1;
  width: 100%;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
}
</style>
