<template>
  <div id="map" class="ymap-container" ref="map"></div>
</template>

<script>
/* eslint no-undef: 0 */

import { yandexMap, ymapMarker, loadYmap } from 'vue-yandex-maps';
import {
  mkadCoords, PolygonCustomization, PolygonOptions, RouteCustomization, PolylineCustomization,
  PolylineOptions, centerCoords, notificationDuration, defaultHeadline, lastMarkerHeadline,
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
      this.addLastPoint();

      this.map.events.add('click', async (event) => {
        const coords = event.get('coords');

        // Удаление предыдуших путей и маркера
        this.lastObjects.forEach(path => this.map.geoObjects.remove(path));

        // Добавление маркера в точку клика
        this.addMarker(coords);

        // Добавление путей от кликнутой точки до МКАДа
        await this.addPaths(coords);
        this.showNotification(coords);
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
      localStorage.setItem('lastPoint', JSON.stringify(coords));

      store.commit('setLoading');

      const closestObject = ymaps.geoQuery(this.mkadMarkers).getClosestTo(coords);
      const closestObjectCoords = closestObject.geometry.getCoordinates();

      // Добавление путя по дороге
      const route = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [closestObjectCoords, coords],
        }, RouteCustomization);

      await new Promise((resolve, reject) => {
        route.model.events
          .add('requestsuccess', () => {
            resolve('success');
          })
          .add('requestfail', () => {
            reject('error');
          });
      });

      this.map.geoObjects.add(route);

      // Добавление путя по воздуху
      const polyline = new ymaps.Polyline(
        [
          closestObjectCoords,
          coords,
        ], PolylineOptions, PolylineCustomization);
      this.map.geoObjects.add(polyline);
      store.commit('setLoading');

      [this.lastObjects[1], this.lastObjects[2]] = [route, polyline];
    },

    // Показ уведомления
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

    // Добавление последней точки из localStorage
    async addLastPoint() {
      const lastPoint = localStorage.getItem('lastPoint');
      if (lastPoint) {
        const coords = JSON.parse(lastPoint);
        await this.addPaths(coords);
        this.addMarker(coords);
        this.showNotification(coords, lastMarkerHeadline);
      }
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
