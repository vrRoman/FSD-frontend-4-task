import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IBarView from './interface';

class BarView implements IBarView {
  private readonly target: HTMLElement
  private readonly viewModel: IViewModelGetMethods
  private bar: HTMLElement | undefined
  private progressBar: HTMLElement | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods) {
    this.target = target;
    this.bar = undefined;
    this.progressBar = undefined;

    this.viewModel = viewModel;
  }

  // Возвращает элемент бара
  getBar(): HTMLElement | undefined {
    return this.bar;
  }

  // Возвращает элемент прогресс-бара
  getProgressBar(): HTMLElement | undefined {
    return this.progressBar;
  }

  // Возвращает длину бара
  getOffsetLength(): number | undefined {
    if (this.bar) {
      if (this.viewModel.getVertical()) {
        return this.bar.offsetHeight;
      }
      return this.bar.offsetWidth;
    }
    return undefined;
  }

  // Создает и возвращает бар в this.target
  createBar(): HTMLElement {
    const bar: HTMLElement = document.createElement('div');
    const { barClass } = this.viewModel.getClasses();
    if (Array.isArray(barClass)) {
      bar.classList.add(...barClass);
    } else {
      bar.classList.add(barClass);
    }
    bar.style.position = 'relative';

    if (!this.viewModel.getVertical()) {
      bar.style.width = this.viewModel.getLength();
    } else {
      bar.style.height = this.viewModel.getLength();
    }

    this.target.appendChild(bar);
    this.bar = bar;
    return bar;
  }

  // Создает в баре и возвращает прогресс-бар. Если бар еще не создан, возвращает undefined
  createProgressBar(): HTMLElement | undefined {
    if (this.bar) {
      const progressBar: HTMLElement = document.createElement('div');
      const { progressBarClass } = this.viewModel.getClasses();

      this.bar.appendChild(progressBar);

      if (Array.isArray(progressBarClass)) {
        progressBar.classList.add(...progressBarClass);
      } else {
        progressBar.classList.add(progressBarClass);
      }
      progressBar.style.position = 'absolute';

      this.progressBar = progressBar;

      this.updateProgressBar();

      return progressBar;
    }
    return undefined;
  }

  // Обновляет положение и длину прогресс-бара
  updateProgressBar() {
    if (this.progressBar) {
      const valuePosition = this.viewModel.getValuePosition();
      if (valuePosition || valuePosition === 0) {
        this.progressBar.style.width = '';
        this.progressBar.style.left = '';
        this.progressBar.style.height = '';
        this.progressBar.style.top = '';
        let widthOrHeight: 'width' | 'height' = 'width';
        let leftOrTop: 'left' | 'top' = 'left';
        if (this.viewModel.getVertical()) {
          widthOrHeight = 'height';
          leftOrTop = 'top';
        }
        if (typeof valuePosition === 'number') {
          this.progressBar.style[widthOrHeight] = `${valuePosition}px`;
          this.progressBar.style[leftOrTop] = '0';
        } else {
          this.progressBar.style[widthOrHeight] = `${valuePosition[1] - valuePosition[0]}px`;
          this.progressBar.style[leftOrTop] = `${valuePosition[0]}px`;
        }
      }
    }
  }

  // Обновляет длину и положение бара
  updateBar() {
    if (this.bar) {
      if (this.viewModel.getVertical()) {
        this.bar.style.height = this.viewModel.getLength();
        this.bar.style.width = '';
      } else {
        this.bar.style.width = this.viewModel.getLength();
        this.bar.style.height = '';
      }
    }
  }
}


export default BarView;
