import axios from 'axios';

function searchResultsHTML(places) {
  return places
    .map(
      place => `
      <a href="/place/${place.slug}" class="search__result">
        <strong>${place.name}</strong>
      </a>
    `
    )
    .join('');
}

export default function typeAhead(search) {
  const searchInput = search.querySelector('input[name=search]');
  const searchResults = search.querySelector('.search__results');

  let results;
  let current;
  let first;

  searchInput.on('input', function() {
    if (!this.value) {
      searchResults.style.display = 'none';
      return;
    }

    searchResults.style.display = 'block';
    searchResults.innerHTML = '';

    axios
      .get(`/api/v1/search?q=${this.value}`)
      .then(res => {
        if (res.data.length) {
          searchResults.innerHTML = searchResultsHTML(res.data);

          results = searchResults.querySelectorAll('.search__result');
          current = 0;
          first = true;
        } else {
          searchResults.innerHTML = `
            <div class="search__result">
              No results for ${this.value}
            </div>
          `;
        }
      })
      .catch(err => console.error(err));
  });

  const activeClass = 'search__result--active';

  searchInput.on('keyup', e => {
    if (!results || ![13, 38, 40].includes(e.keyCode)) return;

    results[current].classList.remove(activeClass);

    switch (e.keyCode) {
      case 38: // up
        current = first ? results.length - 1 : current - (1 % results.length);
        break;

      case 40: // down
        current = first ? 0 : (current + 1) % results.length;
        break;

      case 13: // enter
        // show hidden results again
        if (searchResults.style.display === 'none') {
          searchResults.style.display = 'block';
          return;
        }

        if (results[current].href) {
          window.location = results[current].href;
        }
        return;

      default:
        return;
    }

    first = false;

    // Complete cycle
    if (current % results.length === 0) current = 0;
    if (current % results.length === -1) current = results.length - 1;

    results[current].classList.add(activeClass);
  });

  // If clicked outside - hide results
  window.on('click', e => {
    if (!search.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
}
