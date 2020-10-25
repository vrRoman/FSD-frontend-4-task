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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Model_1 = __importDefault(__webpack_require__(1));

var View_1 = __importDefault(__webpack_require__(2));

var modelFalseRange = new Model_1.default({
  value: [12, 12],
  range: false,
  stepSize: 1,
  min: 0,
  max: 10
}); // @ts-ignore

var view = new View_1.default(document.querySelector('body'), {
  stepSize: 1,
  vertical: false
});
console.log(view.getSlider());

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __spreadArrays = this && this.__spreadArrays || function () {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;

  for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) r[k] = a[j];

  return r;
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Model =
/** @class */
function () {
  function Model(options) {
    var _a;

    this.max = options.max;
    this.min = options.min;
    this.value = options.value; // Если макс. значение > мин., то поменять местами.

    if (this.max < this.min) {
      _a = [this.min, this.max], this.max = _a[0], this.min = _a[1];
    } // Если значение - одно число и это диапазон, то значение становится
    // массивом с двумя одинаковыми значениями.
    // Если значение - массив и это не диапазон, то значением становится
    // первый элемент массива.


    this.range = options.range;

    if (this.range) {
      if (typeof this.value === 'number') {
        this.value = [this.value, this.value];
      }
    } else if (Array.isArray(this.value)) {
      this.value = this.value[0];
    } // Если это диапазон и первое значение больше второго, поменять их местами.
    // Если значения больше максимального, то
    // приравнять с максимальным, и наоборот для минимального.


    this.checkAndFixValue(); // Если размер шага <= 0, то он равен 1.
    // Если размер шага > наибольшего диапазона значений, то он равняется
    // разнице максимального значения и минимального.

    this.stepSize = options.stepSize;

    if (this.stepSize <= 0) {
      this.stepSize = 1;
    }

    if (this.stepSize > this.max - this.min) {
      this.stepSize = this.max - this.min;
    }
  } // Изменяет текущее значение.
  // Если значение - число, а новое - массив, то берется первое число массива.
  // Если значение - массив, а новое - число, то значение = массиву с двумя
  // одинаковыми значениями.


  Model.prototype.changeValue = function (newValue) {
    if (typeof this.value === 'number') {
      if (typeof newValue === 'number') {
        this.value = newValue;
      } else {
        this.value = newValue[0];
      }
    } else if (typeof newValue !== 'number') {
      this.value = newValue;
    } else {
      this.value = [newValue, newValue];
    }

    this.checkAndFixValue();
    return this.value;
  }; // Добавляет указанное количество шагов к нужному значению(если не
  // диапазон или нужно большее значение, то указывать не обязательно)


  Model.prototype.addStepsToValue = function (numOfSteps, valueNumber) {
    if (valueNumber === void 0) {
      valueNumber = 1;
    }

    if (typeof this.value === 'number') {
      this.value += numOfSteps * this.stepSize;
    } else {
      this.value[valueNumber] += numOfSteps * this.stepSize;
    }

    this.checkAndFixValue();
    return this.value;
  }; // Если это диапазон и первое значение больше второго, поменять их местами.
  // Если значения больше максимального, то
  // приравнять с максимальным, и наоборот для минимального.


  Model.prototype.checkAndFixValue = function () {
    if (typeof this.value !== 'number') {
      if (this.value[0] > this.value[1]) {
        this.value = [this.value[1], this.value[0]];
      }
    }

    if (typeof this.value === 'number') {
      if (this.value > this.max) {
        this.value = this.max;
      } else if (this.value < this.min) {
        this.value = this.min;
      }
    } else {
      if (this.value[1] > this.max) {
        this.value[1] = this.max;
      } else if (this.value[1] < this.min) {
        this.value[1] = this.min;
      }

      if (this.value[0] < this.min) {
        this.value[0] = this.min;
      } else if (this.value[0] > this.max) {
        this.value[0] = this.max;
      }
    }

    return this.value;
  };

  Model.prototype.getValue = function () {
    if (typeof this.value === 'number') {
      return this.value;
    }

    return __spreadArrays(this.value);
  };

  return Model;
}();

exports.default = Model;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var __assign = this && this.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var View =
/** @class */
function () {
  function View(parent, options) {
    this._slider = document.createElement('div');
    this._parent = parent;
    this._length = options.vertical ? parent.clientHeight : parent.clientWidth;
    this.stepSize = options.stepSize;
    this._slider.innerHTML = '<p>123</p>';
  }

  View.prototype.getSlider = function () {
    return __assign({}, this._slider);
  };

  return View;
}();

exports.default = View;

/***/ })
/******/ ]);