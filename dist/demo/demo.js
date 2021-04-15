/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/demo/demo.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/demo/demo.js":
/*!**************************!*\
  !*** ./src/demo/demo.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _demo_pug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./demo.pug */ "./src/demo/demo.pug");
/* harmony import */ var _demo_pug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_demo_pug__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _demo_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./demo.scss */ "./src/demo/demo.scss");
/* harmony import */ var _demo_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_demo_scss__WEBPACK_IMPORTED_MODULE_1__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var SliderControlPanel = /*#__PURE__*/function () {
  function SliderControlPanel(options) {
    _classCallCheck(this, SliderControlPanel);

    this.sliderName = options.sliderName;
    this.$slider = this._getSlider();
    this.isRangeName = 'isRange';
    this.valueElems = this._getValueElems();
    this.minMaxNames = ['min', 'max'];
    this.stepSizeName = 'stepSize';
    this.lengthName = 'length';
    this.scaleValueName = 'scaleValue';
    this.checkboxNames = ['isVertical', 'isResponsive', 'isRange', 'hasTooltip', 'hasValueInfo', 'useKeyboard', 'isScaleClickable', 'hasScale'];

    this._initCheckboxes(this.checkboxNames);

    this._initValueInputs();

    this._initMinMax();

    this._initLength();

    this._initStepSize();

    this._initScaleValue();

    this._subscribeToModel();
  }

  _createClass(SliderControlPanel, [{
    key: "update",
    value: function update(action) {
      var _this = this;

      var _this$valueElems = _slicedToArray(this.valueElems, 2),
          $value1 = _this$valueElems[0],
          $value2 = _this$valueElems[1];

      var $stepSize = $(".js-".concat(this.sliderName, "-").concat(this.stepSizeName.toLowerCase()));

      switch (action.type) {
        case 'UPDATE_VALUE':
          if (Array.isArray(this.$slider.slider('value'))) {
            $value1.val(Number(Number(this.$slider.slider('value')[0]).toFixed(3)));
            $value2.val(Number(Number(this.$slider.slider('value')[1]).toFixed(3)));
          } else {
            $value1.val(Number(Number(this.$slider.slider('value')).toFixed(3)));
          }

          break;

        case 'UPDATE_IS-RANGE':
          if (Array.isArray(this.$slider.slider('value'))) {
            $value1.val(Number(this.$slider.slider('value')[0].toFixed(3)));
            $value2.val(Number(this.$slider.slider('value')[1].toFixed(3)));
          } else {
            $value1.val(Number(Number(this.$slider.slider('value')).toFixed(3)));
          }

          break;

        case 'UPDATE_MIN-MAX':
          this.valueElems.forEach(function ($elem) {
            $elem.val(Number(_this.$slider.slider('value')));
          });
          this.minMaxNames.forEach(function (name) {
            var $minOrMax = $(".js-".concat(_this.sliderName, "-").concat(name.toLowerCase()));

            if (name === 'min') {
              $minOrMax.val(Number(_this.$slider.slider('model').getMin()));
            } else if (name === 'max') {
              $minOrMax.val(Number(_this.$slider.slider('model').getMax()));
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
  }, {
    key: "_subscribeToModel",
    value: function _subscribeToModel() {
      this.$slider.slider('model').subscribe(this);
    }
  }, {
    key: "_getSlider",
    value: function _getSlider() {
      return $(".js-".concat(this.sliderName));
    }
  }, {
    key: "_getValueElems",
    value: function _getValueElems() {
      return [$(".js-".concat(this.sliderName, "-value1")), $(".js-".concat(this.sliderName, "-value2"))];
    }
  }, {
    key: "_initCheckboxes",
    value: function _initCheckboxes(optionNames) {
      var _this2 = this;

      var $slider = this.$slider;

      var _this$valueElems2 = _slicedToArray(this.valueElems, 2),
          $value2 = _this$valueElems2[1];

      optionNames.forEach(function (name) {
        var $checkbox = $(".js-".concat(_this2.sliderName, "-").concat(name.toLowerCase())); // Для включенных изначально настроек включить чекбоксы

        var module;

        if ([_this2.isRangeName].indexOf(name) !== -1) {
          module = 'model';
        } else if (['isResponsive', 'isVertical', 'hasTooltip', 'hasValueInfo', 'useKeyboard', 'isScaleClickable', 'hasScale'].indexOf(name) !== -1) {
          module = 'viewModel';
        }

        if (_this2.$slider.slider(module)["get".concat(name[0].toUpperCase() + name.slice(1))]()) {
          $checkbox.prop('checked', true);
        } else {
          $checkbox.prop('checked', false);
        } // Навесить обработчики


        function onCheckboxChange() {
          if (this.checked === true) {
            $slider.slider('changeOptions', _defineProperty({}, name, true));
          } else {
            $slider.slider('changeOptions', _defineProperty({}, name, false));
          }
        }

        $checkbox.on('change', onCheckboxChange); // Если isRange===false, то отключить второе поле ввода значения

        function switchValue2() {
          if (this.checked === true) {
            $value2.prop('disabled', false);
          } else {
            $value2.prop('disabled', true);
            $value2.val('');
          }
        }

        if (name === _this2.isRangeName) {
          if (_this2.$slider.slider('model').getIsRange() === true) {
            $value2.prop('disabled', false);
          } else {
            $value2.prop('disabled', true);
            $value2.val('');
          }

          $checkbox.on('change', switchValue2);
        }
      });
    }
  }, {
    key: "_initValueInputs",
    value: function _initValueInputs() {
      var _this$valueElems3 = _slicedToArray(this.valueElems, 2),
          $value1 = _this$valueElems3[0],
          $value2 = _this$valueElems3[1];

      var $slider = this.$slider;

      if (Array.isArray($slider.slider('value'))) {
        $value1.val($slider.slider('value')[0]);
        $value2.val($slider.slider('value')[1]);
      } else {
        $value1.val(Number($slider.slider('value')));
      }

      function onValueFocusout() {
        if (Array.isArray($slider.slider('value'))) {
          var isValValid = $value1.val() && $value2.val() && !Number.isNaN(Number($value1.val())) && !Number.isNaN(Number($value2.val()));

          if (isValValid) {
            $slider.slider('changeOptions', {
              value: [Number($value1.val()), Number($value2.val())]
            });
            $value1.val($slider.slider('value')[0]);
            $value2.val($slider.slider('value')[1]);
          }
        } else {
          var isValCorrect = $value1.val() && !Number.isNaN(Number($value1.val()));

          if (isValCorrect) {
            $slider.slider('changeOptions', {
              value: Number($value1.val())
            });
            $value1.val(Number($slider.slider('value')));
          }
        }
      }

      this.valueElems.forEach(function ($value) {
        $value.on('focusout', onValueFocusout);
      });
    }
  }, {
    key: "_initMinMax",
    value: function _initMinMax() {
      var _this3 = this;

      var $slider = this.$slider,
          sliderName = this.sliderName,
          minMaxNames = this.minMaxNames;

      var _this$valueElems4 = _slicedToArray(this.valueElems, 2),
          $value1 = _this$valueElems4[0],
          $value2 = _this$valueElems4[1];

      this.minMaxNames.forEach(function (name) {
        var $minOrMax = $(".js-".concat(_this3.sliderName, "-").concat(name.toLowerCase()));
        $minOrMax.val(Number($slider.slider('model')["get".concat(name === 'min' ? 'Min' : 'Max')]()));

        function onFocusoutMinMax() {
          var isValCorrect = $(this).val() && !Number.isNaN(Number($(this).val()));

          if (isValCorrect) {
            $slider.slider('changeOptions', _defineProperty({}, name, Number($(this).val())));
            $(".js-".concat(sliderName, "-").concat(minMaxNames[1])).val(Number($slider.slider('model').getMax()));
            $(".js-".concat(sliderName, "-").concat(minMaxNames[0])).val(Number($slider.slider('model').getMin()));

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
  }, {
    key: "_initStepSize",
    value: function _initStepSize() {
      var $stepSize = $(".js-".concat(this.sliderName, "-").concat(this.stepSizeName.toLowerCase()));
      var $slider = this.$slider;
      $stepSize.val(Number($slider.slider('model').getStepSize()));

      function onFocusoutStepSize() {
        var isValCorrect = $(this).val() && !Number.isNaN(Number($(this).val()));

        if (isValCorrect) {
          $slider.slider('changeOptions', {
            stepSize: Number($(this).val())
          });
          $(this).val(Number($slider.slider('model').getStepSize()));
        }
      }

      $stepSize.on('focusout', onFocusoutStepSize);
    }
  }, {
    key: "_initLength",
    value: function _initLength() {
      var $length = $(".js-".concat(this.sliderName, "-").concat(this.lengthName.toLowerCase()));
      var $slider = this.$slider;
      $length.val($slider.slider('view').getElem('bar').style.width || $slider.slider('view').getElem('bar').style.height);

      function onFocusoutLength() {
        if ($(this).val()) {
          $slider.slider('changeOptions', {
            length: $(this).val()
          });
        }
      }

      $length.on('focusout', onFocusoutLength);
    }
  }, {
    key: "_initScaleValue",
    value: function _initScaleValue() {
      var $scaleValue = $(".js-".concat(this.sliderName, "-").concat(this.scaleValueName.toLowerCase()));
      var $slider = this.$slider;
      $scaleValue.val($slider.slider('viewModel').getScaleValue());

      function onFocusoutScaleValue() {
        if ($scaleValue.val()) {
          var isValArr = $scaleValue.val().indexOf(',') !== -1;

          if (isValArr) {
            $slider.slider('changeOptions', {
              scaleValue: $scaleValue.val().split(',')
            });
          } else {
            var isValNum = !Number.isNaN(Number($scaleValue.val()));

            if (isValNum) {
              $slider.slider('changeOptions', {
                scaleValue: Number($scaleValue.val())
              });
            }
          }
        }
      }

      $scaleValue.on('focusout', onFocusoutScaleValue);
    }
  }]);

  return SliderControlPanel;
}();

$('.js-slider1').slider(); // eslint-disable-next-line @typescript-eslint/no-unused-vars

var controlPanel1 = new SliderControlPanel({
  sliderName: 'slider1'
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
  isResponsive: true
}); // eslint-disable-next-line @typescript-eslint/no-unused-vars

var controlPanel2 = new SliderControlPanel({
  sliderName: 'slider2'
});
$('.js-slider3').slider({
  onChange: function onChange() {
    // eslint-disable-next-line no-console
    console.log($('.js-slider3').slider('value'));
  }
}); // eslint-disable-next-line @typescript-eslint/no-unused-vars

var controlPanel3 = new SliderControlPanel({
  sliderName: 'slider3'
});
$('.js-slider4').slider(); // eslint-disable-next-line @typescript-eslint/no-unused-vars

var controlPanel4 = new SliderControlPanel({
  sliderName: 'slider4'
});

/***/ }),

/***/ "./src/demo/demo.pug":
/*!***************************!*\
  !*** ./src/demo/demo.pug ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/pug-loader/index.js):\nError: Cannot find module 'pug'\nRequire stack:\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/pug-loader/index.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/loader-runner/lib/loadLoader.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/loader-runner/lib/LoaderRunner.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack/lib/NormalModule.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack/lib/NormalModuleFactory.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack/lib/Compiler.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack/lib/webpack.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack-cli/bin/utils/validate-options.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack-cli/bin/utils/convert-argv.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack-cli/bin/cli.js\n- /home/roman/Desktop/FSD-frontend-4-task/node_modules/webpack/bin/webpack.js\n    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:925:15)\n    at Function.resolve (/home/roman/Desktop/FSD-frontend-4-task/node_modules/v8-compile-cache/v8-compile-cache.js:164:23)\n    at Object.module.exports (/home/roman/Desktop/FSD-frontend-4-task/node_modules/pug-loader/index.js:11:28)");

/***/ }),

/***/ "./src/demo/demo.scss":
/*!****************************!*\
  !*** ./src/demo/demo.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module parse failed: Unexpected character '@' (1:0)\nYou may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders\n> @import '../styles/variables';\n| \n| html {");

/***/ })

/******/ });
//# sourceMappingURL=demo.js.map