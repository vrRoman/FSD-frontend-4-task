import { IWindowListeners, Views } from './interfaces';
import { IViewModel } from '../ViewModel/interfacesAndTypes';
import { IThumbView } from '../SubViews/ThumbView/interfaceAndTypes';
import IBarView from '../SubViews/BarView/interface';
import IScaleView from '../SubViews/ScaleView/interface';

class WindowListeners implements IWindowListeners {
  private readonly viewModel: IViewModel
  private thumbView: IThumbView | undefined
  private barView: IBarView | undefined
  private scaleView: IScaleView | undefined

  constructor(viewModel: IViewModel, views: Views) {
    this.viewModel = viewModel;
    this.thumbView = views.thumb;
    this.barView = views.bar;
    this.scaleView = views.scale;

    this._handleWindowResize = this._handleWindowResize.bind(this);
    this._handleDocumentKeyDown = this._handleDocumentKeyDown.bind(this);
  }

  // Добавить обработчик onKeydown и useKeyboard = true
  addKeyboardListener(): void {
    document.addEventListener('keydown', this._handleDocumentKeyDown);
  }

  // Убирает слушатель клавиатуры и useKeyboard = false
  removeKeyboardListener() {
    document.removeEventListener('keydown', this._handleDocumentKeyDown);
  }

  // Изменяет значение isResponsive, добавляет/убирает слушатели window resize
  // Возвращает новое значение isResponsive
  setIsResponsive(newIsResponsive: boolean): void {
    if (newIsResponsive) {
      window.removeEventListener('resize', this._handleWindowResize);
      window.addEventListener('resize', this._handleWindowResize);
    } else {
      window.removeEventListener('resize', this._handleWindowResize);
    }
  }

  // При нажатии клавиш wasd и стрелок вызывается moveActiveThumb(1/-1)
  private _handleDocumentKeyDown(evt: KeyboardEvent): void {
    const isThisNextKey = evt.key === 'ArrowRight' || evt.key === 'ArrowBottom'
      || evt.key === 'd' || evt.key === 's';
    const isThisPrevKey = evt.key === 'ArrowLeft' || evt.key === 'ArrowTop'
      || evt.key === 'a' || evt.key === 'w';

    if (this.thumbView) {
      if (isThisNextKey) {
        this.thumbView.moveActiveThumb(1);
      } else if (isThisPrevKey) {
        this.thumbView.moveActiveThumb(-1);
      }
    }
  }

  // Используется в слушателях window-resize
  private _handleWindowResize(): void {
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
