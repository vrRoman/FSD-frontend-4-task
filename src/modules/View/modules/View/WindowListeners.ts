import { IWindowListeners, Views } from './interfaces';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import IBarView from '../SubViews/BarView/interface';
import IScaleView from '../SubViews/ScaleView/interface';

class WindowListeners implements IWindowListeners {
  private readonly viewModel: IViewModel

  private readonly thumbView: IThumbView | undefined

  private readonly barView: IBarView | undefined

  private readonly scaleView: IScaleView | undefined

  constructor(viewModel: IViewModel, views: Views) {
    this.viewModel = viewModel;
    this.thumbView = views.thumb;
    this.barView = views.bar;
    this.scaleView = views.scale;

    this.handleWindowResize = this.handleWindowResize.bind(this);
    this.handleDocumentKeyDown = this.handleDocumentKeyDown.bind(this);
  }

  // Добавить обработчик onKeydown и useKeyboard = true
  addKeyboardListener(): void {
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  // Изменяет значение isResponsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение isResponsive
  setIsResponsive(newIsResponsive: boolean): void {
    if (newIsResponsive) {
      window.removeEventListener('resize', this.handleWindowResize);
      window.addEventListener('resize', this.handleWindowResize);
    } else {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }

  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private handleDocumentKeyDown(event: KeyboardEvent): void {
    const isThisNextKey = event.key === 'ArrowRight' || event.key === 'ArrowBottom'
      || event.key === 'd' || event.key === 's';
    const isThisPrevKey = event.key === 'ArrowLeft' || event.key === 'ArrowTop'
      || event.key === 'a' || event.key === 'w';

    if (this.thumbView) {
      if (isThisNextKey) {
        this.thumbView.moveActiveThumb(1);
      } else if (isThisPrevKey) {
        this.thumbView.moveActiveThumb(-1);
      }
    }
  }

  // Используется в слушателях window-resize
  private handleWindowResize(): void {
    if (this.barView) {
      const bar = this.barView.getBar();
      if (bar) {
        const currentLength = this.viewModel.getIsVertical() ? bar.offsetHeight : bar.offsetWidth;

        if (currentLength !== this.viewModel.getLengthInPx()) {
          this.barView.updateProgressBar();
          if (this.thumbView) this.thumbView.update();
          if (this.scaleView) this.scaleView.update();

          this.viewModel.setLengthInPx(currentLength);
        }
      }
    }
  }
}

export default WindowListeners;
