<template>
  <div id="app">
    <MapBlock />
    <NotificationList />
    <div :class="{ loading: loading }">
      <Loading class="loading_icon" />
    </div>
  </div>
</template>

<script>
import MapBlock from './components/MapBlock';
import NotificationList from './components/NotificationList';
import store from './store';

// eslint-disable-next-line import/extensions
import Loading from './assets/icons/loading.vue';

export default {
  name: 'App',
  data: () => ({
  }),
  computed: {
    loading() {
      return store.state.loading;
    },
  },
  components: {
    MapBlock,
    NotificationList,
    Loading,
  },
};
</script>

<style>
#app {
  height: 100vh;
  overflow: hidden;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--grey);
  opacity: 0.7;
  width: 100vw;
  height: 100vh;
}

.loading_icon {
  animation: loading-animation infinite 1.2s;
}

@keyframes loading-animation {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
