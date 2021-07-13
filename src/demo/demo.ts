import './demo.pug';

import './blocks/slider-container/init';

const $sliderWithOnChange = $('.js-slider3');
$sliderWithOnChange.slider('changeOptions', {
  onChange(value) {
    // eslint-disable-next-line no-console
    console.log(value);
  },
});
