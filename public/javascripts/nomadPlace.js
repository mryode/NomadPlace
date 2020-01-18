import { $, $$ } from './modules/bling';
import addressAutoComplete from './modules/addressAutoComplete';
import searchAutoComplete from './modules/searchAutoComplete';
import ajaxHeart from './modules/heart';
import makeMap from './modules/map';

import '../scss/style.scss';

addressAutoComplete($('#address'), $('#lat'), $('#lng'));
searchAutoComplete($('.search'));
makeMap('map');

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);
