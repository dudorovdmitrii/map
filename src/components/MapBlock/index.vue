<template>
  <div id="map" class="ymap-container" ref="map"></div>
</template>

<script>
/* eslint no-undef: 0 */

import { yandexMap, ymapMarker, loadYmap } from 'vue-yandex-maps';
import {
  mkadCoords, PolygonCustomization, PolygonOptions, RouteCustomization, PolylineCustomization,
  PolylineOptions, centerCoords, notificationDuration, defaultHeadline, lastMarkerHeadline,
  failMessage,
} from './MapBlock.settings';
import store from '../../store';

export default {
  name: 'MapBlock',
  components: { yandexMap, ymapMarker },
  data: () => ({
    center: centerCoords,
    map: null,
    mkadMarkers: [],
    lastObjects: [],
  }),
  methods: {
    // Инициализация карты
    initMap() {
      this.map = new ymaps.Map('map', {
        center: this.center,
        zoom: 10,
      });
      this.addPolygon();

      // Добавление объектов последней точки из localStorage
      const lastPoint = localStorage.getItem('lastPoint');
      if (lastPoint) this.tryAddMultipleObjects(JSON.parse(lastPoint), lastMarkerHeadline);

      this.map.events.add('click', async (event) => {
        const coords = event.get('coords');

        // Удаление предыдуших путей и маркера
        this.lastObjects.forEach(path => this.map.geoObjects.remove(path));

        // Добавление объектов точки
        this.tryAddMultipleObjects(coords);
      });
    },

    // Добавление полигона МКАДа
    addPolygon() {
      const polygon = new ymaps.Polygon(mkadCoords, PolygonOptions, PolygonCustomization);
      this.map.geoObjects.add(polygon);

      // Добавление невидимых маркеров, до одного из которых будет постороен путь при каждом клике
      for (let i = 0; i < mkadCoords[0].length; i += 1) {
        this.mkadMarkers.push(new ymaps.Placemark(mkadCoords[0][i]));
      }
      ymaps.geoQuery(this.mkadMarkers).addToMap(this.map).setOptions('visible', false);
    },

    // Добавление маркера
    addMarker(coords) {
      const marker = new ymaps.Placemark(coords);
      this.map.geoObjects.add(marker);
      this.lastObjects[0] = marker;
      return marker;
    },

    // Добавление путей до ближайшей точки МКАДа от кликнутой
    async addPaths(coords) {
      // Сохранение координат последней точки
      localStorage.setItem('lastPoint', JSON.stringify(coords));

      // Отображение индикатора загрузки
      store.commit('setLoading');

      const closestObject = ymaps.geoQuery(this.mkadMarkers).getClosestTo(coords);
      const closestObjectCoords = closestObject.geometry.getCoordinates();

      // Добавление пути по дороге
      const route = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [closestObjectCoords, coords],
        }, RouteCustomization);

      const loaded = await new Promise((resolve, reject) => {
        route.model.events
          .add('requestsuccess', () => {
            resolve('success');
          })
          .add('requestfail', () => {
            reject('error');
          });
      }).catch(() => {
        store.commit('setLoading');
        return false;
      });

      if (!loaded) return false;

      this.map.geoObjects.add(route);

      // Добавление пути по воздуху
      const polyline = new ymaps.Polyline(
        [
          closestObjectCoords,
          coords,
        ], PolylineOptions, PolylineCustomization);
      this.map.geoObjects.add(polyline);
      store.commit('setLoading');

      [this.lastObjects[1], this.lastObjects[2]] = [route, polyline];
      return true;
    },

    // Отображение уведомления
    showNotification(coords, headline = defaultHeadline) {
      ymaps.geocode(coords).then((res) => {
        store.commit('incrementId');
        const id = store.state.id;

        // Добавление уведомления в хранилище
        store.commit('addNotification', {
          notification: {
            headline,
            content: res.geoObjects.get(0).properties.get('text'),
            id,
          },
        });

        // Удаление уведомления из хранилища
        setTimeout(() => {
          store.commit('removeNotification', {
            id,
          });
        }, notificationDuration);
      });
    },

    // Попытка добвления объектов на карту
    async tryAddMultipleObjects(coords, notificationHeadline) {
      // Добавление путей от кликнутой точки до МКАДа
      const success = await this.addPaths(coords);
      if (!success) {
        // eslint-disable-next-line no-alert
        alert(failMessage);
        return;
      }

      // Добавление маркера в точку клика
      this.addMarker(coords);

      // Добавление уведомления
      this.showNotification(coords, notificationHeadline);
    },
  },

  async mounted() {
    const settings = { debug: true, coordorder: 'latlong' };
    await loadYmap(settings);
    ymaps.ready(this.initMap);
  },
};


</script>

<style scoped>
.ymap-container {
  height: 100%;
}
</style>
