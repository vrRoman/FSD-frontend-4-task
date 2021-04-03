class SliderControlPanel {
  constructor(options) {
    this.sliderName = options.sliderName;
    this.$slider = $(`#${this.sliderName}`);
    this.isRangeName = 'isRange';
    this.valueElems = [
      $(`#${this.sliderName}-value1`),
      $(`#${this.sliderName}-value2`),
    ];
    this.minMaxNames = ['min', 'max'];
    this.stepSizeName = 'stepSize';
    this.lengthName = 'length';
    this.stepsInfoName = 'stepsInfo';
    this.checkboxNames = ['vertical', 'responsive', 'isRange',
      'hasTooltip', 'hasValueInfo', 'useKeyboard', 'stepsInfoInteractivity'];

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
    const $stepSize = $(`#${this.sliderName}-${this.stepSizeName.toLowerCase()}`);
    switch (action.type) {
      case 'UPDATE_VALUE':
        if (Array.isArray(this.$slider.slider('value'))) {
          $value1.val(Number((Number(this.$slider.slider('value')[0])).toFixed(3)));
          $value2.val(Number((Number(this.$slider.slider('value')[1])).toFixed(3)));
        } else {
          $value1.val(Number((Number(this.$slider.slider('value'))).toFixed(3)));
        }
        break;
      case 'UPDATE_IS-RANGE':
        if (Array.isArray(this.$slider.slider('value'))) {
          $value1.val(Number((this.$slider.slider('value')[0]).toFixed(3)));
          $value2.val(Number((this.$slider.slider('value')[1]).toFixed(3)));
        } else {
          $value1.val(Number((Number(this.$slider.slider('value'))).toFixed(3)));
        }
        break;
      case 'UPDATE_MIN-MAX':
        this.valueElems.forEach(($elem) => {
          $elem.val(Number(this.$slider.slider('value')));
        });
        this.minMaxNames.forEach((name) => {
          const $minOrMax = $(`#${this.sliderName}-${name.toLowerCase()}`);
          if (name === 'min') {
            $minOrMax.val(Number(this.$slider.slider('model').getMin()));
          } else if (name === 'max') {
            $minOrMax.val(Number(this.$slider.slider('model').getMax()));
          }
        });
        break;
      case 'UPDATE_STEPSIZE':
        $stepSize.val(Number(this.$slider.slider('model').getStepSize()));
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
      let module;
      if ([this.isRangeName].indexOf(name) !== -1) {
        module = 'model';
      } else if (['responsive', 'vertical', 'hasTooltip', 'hasValueInfo', 'useKeyboard', 'stepsInfoInteractivity'].indexOf(name) !== -1) {
        module = 'viewModel';
      }

      if (this.$slider.slider(module)[`get${name[0].toUpperCase() + name.slice(1)}`]()) {
        $checkbox.prop('checked', true);
      } else {
        $checkbox.prop('checked', false);
      }

      // Навесить обработчики
      function onCheckboxChange() {
        if (this.checked === true) {
          $slider.slider('changeOptions', {
            [name]: true,
          });
        } else {
          $slider.slider('changeOptions', {
            [name]: false,
          });
        }
      }
      $checkbox.on('change', onCheckboxChange);

      // Если isRange===false, то отключить второе поле ввода значения
      function switchValue2() {
        if (this.checked === true) {
          $value2.prop('disabled', false);
        } else {
          $value2.prop('disabled', true);
          $value2.val('');
        }
      }
      if (name === this.isRangeName) {
        if (this.$slider.slider('model').getIsRange() === true) {
          $value2.prop('disabled', false);
        } else {
          $value2.prop('disabled', true);
          $value2.val('');
        }
        $checkbox.on('change', switchValue2);
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
      $value1.val(Number($slider.slider('value')));
    }

    function onValueFocusout() {
      if (Array.isArray($slider.slider('value'))) {
        const isValValid = $value1.val() && $value2.val()
          && !Number.isNaN(Number($value1.val())) && !Number.isNaN(Number($value2.val()));
        if (isValValid) {
          $slider.slider('changeOptions', {
            value: [Number($value1.val()), Number($value2.val())],
          });
          $value1.val($slider.slider('value')[0]);
          $value2.val($slider.slider('value')[1]);
        }
      } else {
        if ($value1.val() && !Number.isNaN(Number($value1.val()))) {
          $slider.slider('changeOptions', {
            value: Number($value1.val()),
          });
          $value1.val(Number($slider.slider('value')));
        }
      }
    }
    this.valueElems.forEach(($value) => {
      $value.on('focusout', onValueFocusout);
    });
  }

  initMinMax() {
    const { $slider, sliderName, minMaxNames } = this;
    const [$value1, $value2] = this.valueElems;

    this.minMaxNames.forEach((name) => {
      const $minOrMax = $(`#${this.sliderName}-${name.toLowerCase()}`);
      $minOrMax.val(Number($slider.slider('model')[`get${name === 'min' ? 'Min' : 'Max'}`]()));
      function onFocusoutMinMax() {
        if ($(this).val() && !Number.isNaN(Number($(this).val()))) {
          $slider.slider('changeOptions', {
            [name]: Number($(this).val()),
          });
          $(`#${sliderName}-${minMaxNames[1]}`).val(Number($slider.slider('model').getMax()));
          $(`#${sliderName}-${minMaxNames[0]}`).val(Number($slider.slider('model').getMin()));
          if (Array.isArray($slider.slider('value'))) {
            $value1.val($slider.slider('value')[0]);
            $value2.val($slider.slider('value')[1]);
          } else {
            $value1.val(Number($slider.slider('value')));
          }
        }
      }

      $minOrMax.on('focusout', onFocusoutMinMax);
    });
  }

  initStepSize() {
    const $stepSize = $(`#${this.sliderName}-${this.stepSizeName.toLowerCase()}`);
    const { $slider } = this;
    $stepSize.val(Number($slider.slider('model').getStepSize()));
    function onFocusoutStepSize() {
      if ($(this).val() && !Number.isNaN(Number($(this).val()))) {
        $slider.slider('changeOptions', {
          stepSize: Number($(this).val()),
        });
        $(this).val(Number($slider.slider('model').getStepSize()));
      }
    }
    $stepSize.on('focusout', onFocusoutStepSize);
  }

  initLength() {
    const $length = $(`#${this.sliderName}-${this.lengthName.toLowerCase()}`);
    const { $slider } = this;
    $length.val($slider.slider('view').getElem('bar').style.width
    || $slider.slider('view').getElem('bar').style.height);

    function onFocusoutLength() {
      if ($(this).val()) {
        $slider.slider('changeOptions', {
          length: $(this).val(),
        });
      }
    }
    $length.on('focusout', onFocusoutLength);
  }

  initStepsInfo() {
    const $stepsInfo = $(`#${this.sliderName}-${this.stepsInfoName.toLowerCase()}`);
    const { $slider } = this;
    $stepsInfo.val($slider.slider('viewModel').getStepsInfoSettings());
    function onFocusoutStepsInfo() {
      if ($stepsInfo.val()) {
        const isValBoolean = $stepsInfo.val().toLowerCase() === 'true'
          || $stepsInfo.val().toLowerCase() === 'false';
        if (isValBoolean) {
          $slider.slider('changeOptions', {
            stepsInfo: $stepsInfo.val().toLowerCase() === 'true',
          });
        } else {
          const isValArr = $stepsInfo.val().indexOf(',') !== -1;
          if (isValArr) {
            $slider.slider('changeOptions', {
              stepsInfo: $stepsInfo.val().split(','),
            });
          } else {
            const isValNum = !Number.isNaN(Number($stepsInfo.val()));
            if (isValNum) {
              $slider.slider('changeOptions', {
                stepsInfo: Number($stepsInfo.val()),
              });
            }
          }
        }
      }
    }
    $stepsInfo.on('focusout', onFocusoutStepsInfo);
  }
}



$('#slider1').slider();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel1 = new SliderControlPanel({
  sliderName: 'slider1',
});


$('#slider2').slider({
  value: [2, 84],
  isRange: true,
  stepSize: 1,
  max: 100,
  min: -30,
  length: '200px',
  hasTooltip: true,
  hasValueInfo: true,
  stepsInfo: ['start', 'half', 'end'],
  vertical: true,
  responsive: true,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel2 = new SliderControlPanel({
  sliderName: 'slider2',
});

$('#slider3').slider({
  onChange() {
    // eslint-disable-next-line no-console
    console.log($('#slider3').slider('value'));
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel3 = new SliderControlPanel({
  sliderName: 'slider3',
});


$('#slider4').slider();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel4 = new SliderControlPanel({
  sliderName: 'slider4',
});
