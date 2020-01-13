import { $, $$ } from './modules/bling';
import addressAutoComplete from './modules/addressAutoComplete';
import searchAutoComplete from './modules/searchAutoComplete';

import '../scss/style.scss';

addressAutoComplete($('#address'), $('#lat'), $('#lng'));
searchAutoComplete($('.search'));
