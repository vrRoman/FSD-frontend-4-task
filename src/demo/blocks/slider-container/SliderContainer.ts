import SliderConfig from '../slider-config/SliderConfig';
import { SliderOptionsOptionalParams } from '../../../options/options';

class SliderContainer {
  private readonly sliderSelector: string;

  private readonly configSelector: string;

  private readonly sliderOptions: SliderOptionsOptionalParams;

  private elem: HTMLElement;

  constructor(elem: HTMLElement) {
    this.sliderSelector = '.js-slider';
    this.configSelector = '.js-slider-config';
    this.elem = elem;
    this.sliderOptions = JSON.parse(this.elem.dataset.sliderOptions || '{}');

    this.init();
  }

  getHTMLEl(selector: string): HTMLElement | null {
    return this.elem.querySelector<HTMLElement>(selector);
  }

  private init() {
    const configEl = this.getHTMLEl(this.configSelector);
    const sliderEl = this.getHTMLEl(this.sliderSelector);
    if (configEl !== null) {
      if (sliderEl !== null) {
        $(sliderEl).slider(this.sliderOptions);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const sliderConfig = new SliderConfig(configEl, sliderEl);
      } else {
        throw new Error('sliderEl is null');
      }
    } else {
      throw new Error('configEl is null');
    }
  }
}

export default SliderContainer;
