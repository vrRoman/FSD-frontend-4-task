import { SliderOptionsPartial } from 'Presenter';

import SliderConfig from '../slider-config';

class SliderContainer {
  private readonly sliderSelector: string;

  private readonly configSelector: string;

  private readonly sliderOptions: SliderOptionsPartial;

  private element: HTMLElement;

  constructor(element: HTMLElement) {
    this.sliderSelector = '.js-slider';
    this.configSelector = '.js-slider-config';
    this.element = element;
    this.sliderOptions = JSON.parse(this.element.dataset.sliderOptions || '{}');

    this.init();
  }

  getHTMLElement(selector: string): HTMLElement | null {
    return this.element.querySelector<HTMLElement>(selector);
  }

  private init() {
    const configElement = this.getHTMLElement(this.configSelector);
    const sliderElement = this.getHTMLElement(this.sliderSelector);
    if (!configElement) {
      throw new Error('configElement is null');
    }
    if (!sliderElement) {
      throw new Error('sliderElement is null');
    }
    $(sliderElement).slider(this.sliderOptions);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const sliderConfig = new SliderConfig(configElement, sliderElement);
  }
}

export default SliderContainer;
