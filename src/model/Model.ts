type Value = [number, number] | number

interface Options {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number
}

export default class Model {
  value: Value
  range: boolean
  stepSize: number
  max: number
  min: number

  constructor(options: Options) {
    this.max = options.max;
    this.min = options.min;

    this.value = options.value;

    this.range = options.range;
    if (this.range) {
      if (typeof this.value === 'number') {
        this.value = [this.value, this.value];
      }
    } else if (Array.isArray(this.value)) {
      [this.value] = this.value;
    }

    // if (this.max > this.min) {
    //   if (typeof this.value === 'number') {
    //     if (this.value > this.max) {
    //       this.value = this.max;
    //     }
    //     if (this.value < this.min) {
    //       this.value = this.min;
    //     }
    //   } else {
    //     if (this.value[1] > this.max) {
    //       this.value[1] = this.max;
    //     }
    //     if (this.value[0] < this.min) {
    //       this.value[0] = this.min;
    //     }
    //   }
    // } else if (typeof this.value === 'number') {
    //   if (this.value > this.min) {
    //     this.value = this.min;
    //   }
    //   if (this.value < this.max) {
    //     this.value = this.max;
    //   }
    // } else {
    //   if (this.value[1] > this.min) {
    //     this.value[1] = this.min;
    //   }
    //   if (this.value[0] < this.max) {
    //     this.value[0] = this.max;
    //   }
    // }

    this.stepSize = options.stepSize;
    if (this.stepSize < 1) {
      this.stepSize = 1;
    } else if (this.stepSize > this.max - this.min) {
      this.stepSize = this.max - this.min;
    }
  }

  changeValue(newValue: Value): Value {
    if (typeof this.value !== 'number') {
      if (typeof newValue !== 'number') {
        this.value = newValue;
      } else {
        this.value = [newValue, newValue];
      }
    } else if (typeof newValue === 'number') {
      this.value = newValue;
    } else {
      [this.value] = newValue;
    }

    return this.value;
  }

  addStepsToValue(numOfSteps: number, valueNumber: 0 | 1): Value {
    if (typeof this.value !== 'number') {
      this.value[valueNumber] += numOfSteps * this.stepSize;
    } else {
      this.value += numOfSteps * this.stepSize;
    }
    return this.value;
  }
}
