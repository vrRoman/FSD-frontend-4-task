// добавить валидации

const slider1 = $('#slider1').slider();

const initControlPanel = (sliderName) => {
  const $slider = $(`#${sliderName}`);

  const initCheckbox = (optionNames) => {
    for (let i = 0; i < optionNames.length; i += 1) {
      const $checkbox = $(`#${sliderName}-${optionNames[i].toLowerCase()}`);
      $checkbox.on('change', function change() {
        if (this.checked === true) {
          $slider.slider(optionNames[i], true);
        } else {
          $slider.slider(optionNames[i], false);
        }
      });
    }
  };

  initCheckbox(
    ['vertical', 'responsive',
      'tooltip', 'valueInfo', 'useKeyboard'],
  );

  // range и value
  const $rangeCheckbox = $(`#${sliderName}-range`);
  const $value1 = $(`#${sliderName}-value1`);
  const $value2 = $(`#${sliderName}-value2`);
  const $values = $(`#${sliderName}-value1, #${sliderName}-value2`);
  if ($slider.slider('range')) {
    $value1.val(String($slider.slider('value')[0]));
    $value2.val(String($slider.slider('value')[1]));
  } else {
    $value1.val(String($slider.slider('value')));
    $value2.prop('disabled', true);
  }
  $rangeCheckbox.on('change', function changeRange() {
    if (this.checked === true) {
      $slider.slider('range', true);
      $value2.prop('disabled', false);
      $value2.val(`${$slider.slider('value')[1]}`);
    } else {
      $slider.slider('range', false);
      $value2.prop('disabled', true);
      $value2.val('');
    }
  });
  // value
  $values.on('focusout', function changeValue() {
    $(this).each(() => {
      if (Array.isArray($slider.slider('value'))) {
        if ($value1.val() && $value2.val()) {
          $slider.slider('value', [+$value1.val(), +$value2.val()]);
          $value1.val($slider.slider('value')[0]);
          $value2.val($slider.slider('value')[1]);
        }
      } else {
        if ($value1.val()) {
          $slider.slider('value', +$value1.val());
          $value1.val($slider.slider('value'));
        }
      }
    });
  });

  // min-max
  const $min = $(`#${sliderName}-min`);
  const $max = $(`#${sliderName}-max`);
  $min.on('focusout', function changeMinMax() {
    if ($(this).val()) {
      $slider.slider('min', +$min.val());
      $max.val($slider.slider('max'));
      $min.val($slider.slider('min'));
      if (Array.isArray($slider.slider('value'))) {
        $value1.val($slider.slider('value')[0]);
        $value2.val($slider.slider('value')[1]);
      } else {
        $value1.val($slider.slider('value'));
      }
    }
  });
  $max.on('focusout', function changeMinMax() {
    if ($(this).val()) {
      $slider.slider('max', +$max.val());
      $max.val($slider.slider('max'));
      $min.val($slider.slider('min'));
      if (Array.isArray($slider.slider('value'))) {
        $value1.val($slider.slider('value')[0]);
        $value2.val($slider.slider('value')[1]);
      } else {
        $value1.val($slider.slider('value'));
      }
    }
  });


  // stepsize
  const $stepSize = $(`#${sliderName}-stepsize`);
  $stepSize.on('focusout', function changeStepSize() {
    if ($(this).val()) {
      $slider.slider('stepSize', +$(this).val());
      $(this).val($slider.slider('model').getStepSize());
    }
  });

  // length
  const $length = $(`#${sliderName}-length`);
  $length.on('focusout', function changeLength() {
    if ($(this).val()) {
      $slider.slider('length', $(this).val());
    }
  });

  // stepsInfo
  const $stepsInfo = $(`#${sliderName}-stepsinfo`);
  $stepsInfo.on('focusout', () => {
    if ($stepsInfo.val()) {
      const valIsBoolean = $stepsInfo.val().toLowerCase() === 'true'
        || $stepsInfo.val().toLowerCase() === 'false';
      if (valIsBoolean) {
        $slider.slider('stepsInfo', $stepsInfo.val().toLowerCase() === 'true');
      } else {
        const valIsArr = $stepsInfo.val().indexOf(',') !== -1;
        if (valIsArr) {
          $slider.slider('stepsInfo', $stepsInfo.val().split(','));
        } else {
          const valIsNum = !Number.isNaN($stepsInfo.val());
          if (valIsNum) {
            $slider.slider('stepsInfo', +$stepsInfo.val());
          }
        }
      }
    }
  });
};

initControlPanel('slider1');
