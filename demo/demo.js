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

    // подписать на обновления модели
    this.$slider.slider('model').subscribe(this);
  }

  update(action) {
    const [$value1, $value2] = this.valueElems;
    switch (action.type) {
      case 'UPDATE_VALUE':
        if (Array.isArray(this.$slider.slider('value'))) {
          $value1.val(this.$slider.slider('value')[0]);
          $value2.val(this.$slider.slider('value')[1]);
        } else {
          $value1.val(+this.$slider.slider('value'));
        }
        break;
      case 'UPDATE_RANGE':
        if (Array.isArray(this.$slider.slider('value'))) {
          $value1.val(this.$slider.slider('value')[0]);
          $value2.val(this.$slider.slider('value')[1]);
        } else {
          $value1.val(+this.$slider.slider('value'));
        }
        break;
      case 'UPDATE_MIN' || 'UPDATE_MAX':
        this.valueElems.forEach(($elem) => {
          $elem.val(+this.$slider.slider('value'));
        });
        this.minMaxNames.forEach((name) => {
          const $minOrMax = $(`#${this.sliderName}-${name.toLowerCase()}`);
          $minOrMax.val(+this.$slider.slider(name));
        });
        break;
      default:
        $.error('Wrong action.type');
    }
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
          $value2.val('');
        }
        $checkbox.on('change', function switchValue2() {
          if (this.checked === true) {
            $value2.prop('disabled', false);
          } else {
            $value2.prop('disabled', true);
            $value2.val('');
          }
        });
      }
    });
  }

  initValueInputs() {
    const [$value1, $value2] = this.valueElems;
    const { $slider } = this;
    if (Array.isArray($slider.slider('value'))) {
      $value1.val($slider.slider('value')[0]);
      $value2.val($slider.slider('value')[1]);
    } else {
      $value1.val(+$slider.slider('value'));
    }

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
      const $minOrMax = $(`#${this.sliderName}-${name.toLowerCase()}`);
      $minOrMax.val(+$slider.slider(name));

      $minOrMax.on('focusout', function changeMinMax() {
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
    $stepSize.val(+$slider.slider('stepSize'));
    $stepSize.on('focusout', function changeStepSize() {
      if ($(this).val() && !Number.isNaN(+$(this).val())) {
        $slider.slider('stepSize', +$(this).val());
        $(this).val(+$slider.slider('stepSize'));
      }
    });
  }

  initLength() {
    const $length = $(`#${this.sliderName}-${this.lengthName.toLowerCase()}`);
    const { $slider } = this;
    $length.val($slider.slider('view').getBar().style.width
    || $slider.slider('view').getBar().style.height);

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
    $stepsInfo.val($slider.slider('view').getStepsInfoSettings());

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

$('#slider1').slider({
  tooltip: true,
});

const controlPanel1 = new SliderControlPanel({
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
