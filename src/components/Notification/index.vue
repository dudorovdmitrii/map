<template>
  <article class="notification">
    <div class="notification_header">
      <h1 class="notification_header_h">
        {{ headline }}
      </h1>
      <button class="notification_header_btn" @click="handleClose">x</button>
    </div>
    <section class="notification_content">
      {{ content.length > 219 ? content.slice(0, 219) + '...' : content }}
    </section>
  </article>
</template>

<script>
import store from '../../store';

export default {
  props: ['headline', 'content', 'id'],
  name: 'Notification',
  methods: {
    handleClose() {
      store.commit('removeNotification', { id: this.id });
    },
  },
};


</script>

<style scoped>
.notification {
  max-height: 150px;
  width: calc(20vw - 60px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: white;
  padding: 20px 15px;
  border-radius: 2px;
  box-shadow: 0 0 5px var(--black-shadow);
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
