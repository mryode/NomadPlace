import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
  e.preventDefault();

  console.log('e', e);
  console.log('this', this);

  axios
    .post(e.target.action)
    .then(res => {
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = res.data.hearts.length;

      // NOTE optional
      if (window.location.href.endsWith('/hearts')) window.location.reload();
    })
    .catch(err => console.error(err));
}

export default ajaxHeart;
