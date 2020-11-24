class SliderControlPanel {
  constructor(options) {
    this.sliderName = options.sliderName;
    this.$slider = $(`#${this.sliderName}`);
    this.rangeName = options.rangeName;
    this.valueElems = [
      $(`#${this.sliderName}-${options.valueName1}`),
      $(`#${this.sliderName}-${options.valueName2}`),
    ];
    this.minMaxNames = [options.minName, options.maxName];
    this.stepSizeName = options.stepSizeName;
    this.lengthName = options.lengthName;
    this.stepsInfoName = options.stepsInfoName;
    this.checkboxNames = options.checkboxNames;

    this.initCheckboxes(this.checkboxNames);
    this.initValueInputs();
    this.initMinMax();
    this.initLength();
    this.initStepSize();
    this.initStepsInfo();
  }

  initCheckboxes(optionNames) {
    const { $slider } = this;
    const [, $value2] = this.valueElems;

    optionNames.forEach((name) => {
      const $checkbox = $(`#${this.sliderName}-${name.toLowerCase()}`);

      // Для включенных изначально настроек включить чекбоксы
      if (this.$slider.slider(name)) {
        $checkbox.prop('checked', true);
      } else {
        $checkbox.prop('checked', false);
      }

      // Навесить обработчики
      $checkbox.on('change', function change() {
        if (this.checked === true) {
          $slider.slider(name, true);
        } else {
          $slider.slider(name, false);
        }
      });

      // Если range===false, то отключить второе поле ввода значения
      if (name === this.rangeName) {
        if (this.$slider.slider(this.rangeName) === true) {
          $value2.prop('disabled', false);
        } else {
          $value2.prop('disabled', true);
        }
        $checkbox.on('change', function switchValue2() {
          if (this.checked === true) {
            $value2.prop('disabled', false);
          } else {
            $value2.prop('disabled', true);
          }
        });
      }
    });
  }

  initValueInputs() {
    const [$value1, $value2] = this.valueElems;
    const { $slider } = this;
    this.valueElems.forEach(($value) => {
      $value.on('focusout', () => {
        if (Array.isArray($slider.slider('value'))) {
          if ($value1.val() && $value2.val()
            && !Number.isNaN(+$value1.val()) && !Number.isNaN(+$value2.val())) {
            $slider.slider('value', [+$value1.val(), +$value2.val()]);
            $value1.val($slider.slider('value')[0]);
            $value2.val($slider.slider('value')[1]);
          }
        } else {
          if ($value1.val() && !Number.isNaN(+$value1.val())) {
            $slider.slider('value', +$value1.val());
            $value1.val(+$slider.slider('value'));
          }
        }
      });
    });
  }

  initMinMax() {
    const { $slider, sliderName, minMaxNames } = this;
    const [$value1, $value2] = this.valueElems;

    this.minMaxNames.forEach((name) => {
      $(`#${this.sliderName}-${name.toLowerCase()}`).on('focusout', function changeMinMax() {
        if ($(this).val() && !Number.isNaN(+$(this).val())) {
          $slider.slider(name, +$(this).val());
          $(`#${sliderName}-${minMaxNames[1]}`).val(+$slider.slider('max'));
          $(`#${sliderName}-${minMaxNames[0]}`).val(+$slider.slider('min'));
          if (Array.isArray($slider.slider('value'))) {
            $value1.val($slider.slider('value')[0]);
            $value2.val($slider.slider('value')[1]);
          } else {
            $value1.val(+$slider.slider('value'));
          }
        }
      });
    });
  }

  initStepSize() {
    const $stepSize = $(`#${this.sliderName}-${this.stepSizeName.toLowerCase()}`);
    const { $slider } = this;
    $stepSize.on('focusout', function changeStepSize() {
      if ($(this).val() && !Number.isNaN(+$(this).val())) {
        $slider.slider('stepSize', +$(this).val());
        $(this).val($slider.slider('model').getStepSize());
      }
    });
  }

  initLength() {
    const $length = $(`#${this.sliderName}-${this.lengthName.toLowerCase()}`);
    const { $slider } = this;
    $length.on('focusout', function changeLength() {
      if ($(this).val()) {
        $slider.slider('length', +$(this).val());
        $slider.slider('length', $(this).val());
      }
    });
  }

  initStepsInfo() {
    const $stepsInfo = $(`#${this.sliderName}-${this.stepsInfoName.toLowerCase()}`);
    const { $slider } = this;
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
            const valIsNum = !Number.isNaN(+$stepsInfo.val());
            if (valIsNum) {
              $slider.slider('stepsInfo', +$stepsInfo.val());
            }
          }
        }
      }
    });
  }
}

$('#slider1').slider();

const controlPanel = new SliderControlPanel({
  sliderName: 'slider1',
  rangeName: 'range',
  valueName1: 'value1',
  valueName2: 'value2',
  minName: 'min',
  maxName: 'max',
  stepSizeName: 'stepSize',
  lengthName: 'length',
  stepsInfoName: 'stepsInfo',
  checkboxNames: ['vertical', 'responsive', 'range',
    'tooltip', 'valueInfo', 'useKeyboard'],
});
