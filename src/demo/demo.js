import './demo.pug';
import './demo.css';

class SliderControlPanel {
  constructor(options) {
    this.sliderName = options.sliderName;
    this.$slider = this._getSlider();
    this.isRangeName = 'isRange';
    this.valueElems = this._getValueElems();
    this.minMaxNames = ['min', 'max'];
    this.stepSizeName = 'stepSize';
    this.lengthName = 'length';
    this.scaleValueName = 'scaleValue';
    this.checkboxNames = ['isVertical', 'isResponsive', 'isRange',
      'hasTooltip', 'hasValueInfo', 'useKeyboard', 'isScaleClickable', 'hasScale'];

    this._initCheckboxes(this.checkboxNames);
    this._initValueInputs();
    this._initMinMax();
    this._initLength();
    this._initStepSize();
    this._initScaleValue();

    this._subscribeToModel();
  }

  update(action) {
    const [$value1, $value2] = this.valueElems;
    const $stepSize = $(`.js-${this.sliderName}-${this.stepSizeName.toLowerCase()}`);
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
          const $minOrMax = $(`.js-${this.sliderName}-${name.toLowerCase()}`);
          if (name === 'min') {
            $minOrMax.val(Number(this.$slider.slider('model').getMin()));
          } else if (name === 'max') {
            $minOrMax.val(Number(this.$slider.slider('model').getMax()));
          }
        });
        break;
      case 'UPDATE_STEP-SIZE':
        $stepSize.val(Number(this.$slider.slider('model').getStepSize()));
        break;
      default:
        $.error('Wrong action.type');
    }
  }

  _subscribeToModel() {
    this.$slider.slider('model').subscribe(this);
  }

  _getSlider() {
    return $(`.js-${this.sliderName}`);
  }

  _getValueElems() {
    return [
      $(`.js-${this.sliderName}-value1`),
      $(`.js-${this.sliderName}-value2`),
    ];
  }

  _initCheckboxes(optionNames) {
    const { $slider } = this;
    const [, $value2] = this.valueElems;

    optionNames.forEach((name) => {
      const $checkbox = $(`.js-${this.sliderName}-${name.toLowerCase()}`);

      // Для включенных изначально настроек включить чекбоксы
      let module;
      if ([this.isRangeName].indexOf(name) !== -1) {
        module = 'model';
      } else if ([
        'isResponsive', 'isVertical', 'hasTooltip', 'hasValueInfo', 'useKeyboard', 'isScaleClickable', 'hasScale',
      ].indexOf(name) !== -1) {
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

  _initValueInputs() {
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
        const isValCorrect = $value1.val() && !Number.isNaN(Number($value1.val()));

        if (isValCorrect) {
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

  _initMinMax() {
    const { $slider, sliderName, minMaxNames } = this;
    const [$value1, $value2] = this.valueElems;

    this.minMaxNames.forEach((name) => {
      const $minOrMax = $(`.js-${this.sliderName}-${name.toLowerCase()}`);
      $minOrMax.val(Number($slider.slider('model')[`get${name === 'min' ? 'Min' : 'Max'}`]()));
      function onFocusoutMinMax() {
        const isValCorrect = $(this).val() && !Number.isNaN(Number($(this).val()));

        if (isValCorrect) {
          $slider.slider('changeOptions', {
            [name]: Number($(this).val()),
          });
          $(`.js-${sliderName}-${minMaxNames[1]}`).val(Number($slider.slider('model').getMax()));
          $(`.js-${sliderName}-${minMaxNames[0]}`).val(Number($slider.slider('model').getMin()));
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

  _initStepSize() {
    const $stepSize = $(`.js-${this.sliderName}-${this.stepSizeName.toLowerCase()}`);
    const { $slider } = this;
    $stepSize.val(Number($slider.slider('model').getStepSize()));
    function onFocusoutStepSize() {
      const isValCorrect = $(this).val() && !Number.isNaN(Number($(this).val()));

      if (isValCorrect) {
        $slider.slider('changeOptions', {
          stepSize: Number($(this).val()),
        });
        $(this).val(Number($slider.slider('model').getStepSize()));
      }
    }
    $stepSize.on('focusout', onFocusoutStepSize);
  }

  _initLength() {
    const $length = $(`.js-${this.sliderName}-${this.lengthName.toLowerCase()}`);
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

  _initScaleValue() {
    const $scaleValue = $(`.js-${this.sliderName}-${this.scaleValueName.toLowerCase()}`);
    const { $slider } = this;
    $scaleValue.val($slider.slider('viewModel').getScaleValue());

    function onFocusoutScaleValue() {
      if ($scaleValue.val()) {
        const isValArr = $scaleValue.val().indexOf(',') !== -1;
        if (isValArr) {
          $slider.slider('changeOptions', {
            scaleValue: $scaleValue.val().split(','),
          });
        } else {
          const isValNum = !Number.isNaN(Number($scaleValue.val()));
          if (isValNum) {
            $slider.slider('changeOptions', {
              scaleValue: Number($scaleValue.val()),
            });
          }
        }
      }
    }

    $scaleValue.on('focusout', onFocusoutScaleValue);
  }
}


$('.js-slider1').slider();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel1 = new SliderControlPanel({
  sliderName: 'slider1',
});


$('.js-slider2').slider({
  value: [2, 84],
  isRange: true,
  stepSize: 1,
  max: 100,
  min: -30,
  length: '200px',
  hasTooltip: true,
  hasValueInfo: true,
  hasScale: true,
  scaleValue: ['start', 'half', 'end'],
  isVertical: true,
  isResponsive: true,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel2 = new SliderControlPanel({
  sliderName: 'slider2',
});


$('.js-slider3').slider({
  onChange() {
    // eslint-disable-next-line no-console
    console.log($('.js-slider3').slider('value'));
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel3 = new SliderControlPanel({
  sliderName: 'slider3',
});


$('.js-slider4').slider();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const controlPanel4 = new SliderControlPanel({
  sliderName: 'slider4',
});
