import IView from '../../View/interfacesAndTypes';
import View from '../../View/View';
import { ITooltipView } from './interfaceAndTypes';
import { defaultViewOptions, defaultModelOptions } from '../../../../../options/defaultOptions';
import { defaultClasses } from '../../../options';

let mainView: IView;
let tooltipView: ITooltipView;
beforeEach(() => {
  mainView = new View({
    ...defaultViewOptions,
    hasTooltip: true,
  }, document.body);
  mainView.setModelData(defaultModelOptions);
  mainView.renderSlider();
  tooltipView = mainView.getViews().tooltip;
});

test('get should return HTMLElement', () => {
  expect(tooltipView.get()).toBeInstanceOf(HTMLElement);
});

test('update should change text in tooltip', () => {
  const tooltip = tooltipView.get();
  // View вызовет tooltipView.update
  mainView.setModelData({ value: 5 });
  if (tooltip instanceof HTMLElement) {
    expect(tooltip.querySelector(`.${defaultClasses.tooltipValueClass}`)?.innerHTML).toBe('5');
  }
});

test('unmount should remove all tooltips from the DOM', () => {
  mainView.setModelData({ isRange: true, value: [2, 7] });
  tooltipView.unmount();
  expect(mainView.getElement('slider').querySelectorAll(`.${defaultClasses.tooltipClass}`).length).toBe(0);
});

test('recreate should recreate tooltips and mount they if hasTooltip is true', () => {
  const firstTooltip = tooltipView.get();
  // View вызовет recreate
  mainView.setModelData({ isRange: true, value: [2, 7] });
  const secondTooltip = tooltipView.get();
  if (Array.isArray(secondTooltip)) {
    expect(secondTooltip[0].querySelector(`.${defaultClasses.tooltipValueClass}`)?.innerHTML).toBe('2');
    expect(secondTooltip[1].querySelector(`.${defaultClasses.tooltipValueClass}`)?.innerHTML).toBe('7');
  } else {
    throw new Error('tooltip is not array but isRange is true');
  }
  expect(firstTooltip).not.toBe(secondTooltip);
  expect(mainView.getElement('slider').querySelectorAll(`.${defaultClasses.tooltipClass}`).length).toBe(2);
});
