import { Value } from 'Model';

const $sliderWithOnChange = $('.js-slider3');
$sliderWithOnChange.slider('changeOptions', {
  onChange(value: Value) {
    // eslint-disable-next-line no-console
    console.log(value);
  },
});
