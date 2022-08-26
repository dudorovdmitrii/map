<template>
  <transition-group name="slide" class="notificationList">
    <Notification :headline="notification.headline" :content="notification.content"
      :id="notification.id" v-for="notification in notifications" :key="notification.id" />
  </transition-group>
</template>

<script>
import store from '../../store';
import Notification from '../Notification';

export default {
  components: { Notification },
  name: 'NotificationList',
  computed: {
    notifications() {
      return store.state.notifications;
    },
  },
};


</script>

<style scoped>
.notificationList {
  overflow: hidden;
  position: absolute;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 5px;
  right: 0;
  top: 0;
  width: 20vw;
  min-width: 240px;
  box-sizing: border-box;
  padding: 20px 20px;
  z-index: 0;
}

.slide-enter {
  opacity: 1;
}

.slide-move {
  transition: transform 1s;
}

.slide-enter-active {
  animation: slide-in 0.5s ease-out forwards;
  transition: opacity 0.5s;
}

.slide-leave-active {
  position: relative;
  animation: slide-out 0.5s ease-out forwards;
  transition: 0.5s;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0px);
  }
}

@keyframes slide-out {
  from {
    top: 0;
  }

  to {
    top: -200px;
  }
}
</style>
