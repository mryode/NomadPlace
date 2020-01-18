import axios from 'axios';
import { $, $$ } from './bling';

const placesjs = require('places.js');

// 1. Create a map object
// 2. Get all places using our API
// 3. Add markers and push boundaries
// 4. Create auto complete input

function loadPlaces(map) {
  axios.get('/api/v1/places').then(res => {
    if (!res.data.length) {
      alert('No places found near this location!');
      return;
    }

    const places = res.data.map(record => record.docs);

    // Initiate bounds to the first point
    const position = places[0][0].location.coordinates;
    const sw = new mapboxgl.LngLat(position[0], position[1]);
    const ne = new mapboxgl.LngLat(position[0], position[1]);
    const bounds = new mapboxgl.LngLatBounds(sw, ne);

    const markers = [];

    places.forEach(docs =>
      docs.forEach((place, index) => {
        let coordinates;
        if (index === 0) {
          coordinates = place.location.coordinates;
        } else {
          coordinates = [
            place.location.coordinates[0] + Math.random() / 10000,
            place.location.coordinates[1] + Math.random() / 10000,
          ];
        }

        bounds.extend(coordinates);

        const marker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
        marker.place = place; // Save place data

        markers.push(marker);
      })
    );

    markers.forEach(marker => {
      console.log('marker', marker);
      const html = `
        <div>
          <a href="/place/${marker.place.slug}">
            <p><strong>${marker.place.name}</strong></p>
          </a>
          <p>${marker.place.location.address}</p>
        </div>
      `;

      const popup = new mapboxgl.Popup({ className: 'popup' }).setHTML(html);

      marker.setPopup(popup);

      marker.getElement().addEventListener('click', () => {
        map.flyTo({
          center: [marker.getLngLat().lng, marker.getLngLat().lat],
          zoom: 18,
          speed: 0.3,
        });
      });
    });

    console.log('markers', markers);

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds, {
      maxZoom: 13,
      padding: 50,
    });
  });
}

function makeMap(mapDivId) {
  if (!$(`#${mapDivId}`)) return;

  // TODO Find a way to not revealing the API KEY
  mapboxgl.accessToken =
    'pk.eyJ1IjoibXJ5b2RlIiwiYSI6ImNrNWZkZGVrczJqczQzbXBneHlodXZlOW0ifQ.6_5DbnL3QBRJ8dMZzFPUrQ';

  const mapOptions = {
    container: mapDivId,
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 9,
  };
  const map = new mapboxgl.Map(mapOptions);
  map.addControl(new mapboxgl.NavigationControl());
  loadPlaces(map);

  const placesAutoComplete = placesjs({
    appId: process.env.PLACES_APP_ID,
    apiKey: process.env.PLACES_API_KEY,
    container: $('input[name="geolocation"]'),
  });

  placesAutoComplete.on('change', e => {
    map.flyTo({
      center: [e.suggestion.latlng.lng, e.suggestion.latlng.lat],
      zoom: 13,
      speed: 0.3,
    });
  });
}

export default makeMap;
