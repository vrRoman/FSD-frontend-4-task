/* eslint-disable @typescript-eslint/no-unused-vars */

import SliderContainer from './SliderContainer';

$('.js-slider-container').each(function init() {
  const sliderContainer = new SliderContainer(this);
});
