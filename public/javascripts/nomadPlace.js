import { $, $$ } from './modules/bling';
import addressAutoComplete from './modules/addressAutoComplete';

import '../stylesheets/style.css';

addressAutoComplete($('#address'), $('#lat'), $('#lng'));
