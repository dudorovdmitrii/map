<template>
  <article class="notification">
    <div class="notification_header">
      <h1 class="notification_header_h">
        {{ headline }}
      </h1>
      <button class="notification_header_btn" @click="handleClose">x</button>
    </div>
    <section class="notification_content">
      {{ content.length > getMaxContentLength ? content.slice(0, getMaxContentLength) + '...' :
          content
      }}
    </section>
  </article>
</template>

<script>
import store from '../../store';
import { maxContentLength } from './Notification.settings';

export default {
  props: ['headline', 'content', 'id'],
  name: 'Notification',
  computed: {
    getMaxContentLength() {
      return maxContentLength;
    },
  },
  methods: {
    handleClose() {
      store.commit('removeNotification', { id: this.id });
    },
  },
};


</script>

<style scoped>
.notification {
  width: calc(100% - 30px);
  display: flex;
  flex-direction: column;
  background: var(--white);
  padding: 20px 15px;
  border-radius: 2px;
  box-shadow: 0 0 5px var(--black-shadow);
  z-index: 100;
}

.notification_header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: var(--black);
}

.notification_header_btn {
  border: none;
  background: var(--white);
  cursor: pointer;
  color: var(--grey);
}

.notification_content {
  padding-top: 10px;
  color: var(--grey);
}
</style>
