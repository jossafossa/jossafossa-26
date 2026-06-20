// Icons are registered by plain string name so the data layer stays serializable.
import { library, config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import {
  faPaintbrush,
  faUser,
  faCheck,
  faCode,
  faGamepad,
  faMicrophone,
  faMusic,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFaceSmile,
  faThumbsUp,
  faLightbulb,
} from '@fortawesome/free-regular-svg-icons';

// We import the FA CSS ourselves, so disable the runtime <style> injection.
config.autoAddCss = false;

library.add(
  // solid
  faPaintbrush,
  faUser,
  faCheck,
  faCode,
  faGamepad,
  faMicrophone,
  faMusic,
  faStar,
  // regular
  faFaceSmile,
  faThumbsUp,
  faLightbulb,
);
