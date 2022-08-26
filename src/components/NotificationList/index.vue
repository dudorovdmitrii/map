<template>
  <transition-group tag="ul" name="fade" class="notificationList">
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
  width: 20vw;
  min-width: 240px;
  position: absolute;
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 5px;
  right: 0;
  top: 0;
  box-sizing: border-box;
  margin: 20px;
  z-index: 0;
}

/* 1. declare transition */
.fade-move,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-active {
  animation: appearAnimation 0.3s ease-out forwards;
  transition: opacity 0.3s;
}

.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01);
}

.fade-leave-active {
  position: absolute;
}

@keyframes appearAnimation {
  from {
    transform: scaleY(0.01);
  }

  to {
    transform: scaleY(1);
  }
}
</style>
