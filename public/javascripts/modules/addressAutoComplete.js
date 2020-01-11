const places = require('places.js');

export default function addressAutoComplete(input, latInput, lngInput) {
  if (!input) return;

  const placesAutoComplete = places({
    appId: process.env.PLACES_APP_ID,
    apiKey: process.env.PLACES_API_KEY,
    container: input,
  });

  placesAutoComplete.on('change', e => {
    if (latInput && lngInput) {
      latInput.value = e.suggestion.latlng.lat;
      lngInput.value = e.suggestion.latlng.lng;
    }
  });

  input.on('keydown', e => {
    if (e.keyCode === 13) e.preventDefault();
  });
}
