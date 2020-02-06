import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
  e.preventDefault();

  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');

  const req = {
    method: 'POST',
    url: this.action,
    headers: {
      'CSRF-Token': csrfToken,
    },
  };

  axios(req)
    .then(res => {
      this.heart.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = res.data.hearts.length;

      // NOTE optional
      if (window.location.href.endsWith('/hearts')) window.location.reload();
    })
    .catch(err => console.error(err));
}

export default ajaxHeart;
