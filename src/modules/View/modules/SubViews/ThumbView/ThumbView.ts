import { IThumbView, Thumb } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IView from '../../View/interfaces';
import areNumbersDefined from '../../../../../utils/areNumbersDefined';


class ThumbView implements IThumbView {
  private readonly target: HTMLElement
  private readonly viewModel: IViewModelGetMethods
  private readonly mainView: IView
  private thumb: Thumb | undefined

  constructor(target: HTMLElement, viewModel: IViewModelGetMethods, mainView: IView) {
    this.target = target;
    this.viewModel = viewModel;
    this.mainView = mainView;
    this.thumb = undefined;

    this._handleThumbMouseDown = this._handleThumbMouseDown.bind(this);
    this._handleThumbMouseUp = this._handleThumbMouseUp.bind(this);
    this._handleThumbMouseMove = this._handleThumbMouseMove.bind(this);
    this.removeActiveThumb = this.removeActiveThumb.bind(this);
  }

  // Создает и возвращает ползунок(ки) в баре
  create(): Thumb | undefined {
    const valuePosition = this.viewModel.getValuePosition();
    const { thumbClass } = this.viewModel.getClasses();

    if (typeof valuePosition === 'number') {
      const thumb = document.createElement('div');

      if (Array.isArray(thumbClass)) {
        thumb.classList.add(...thumbClass);
      } else {
        thumb.classList.add(thumbClass);
      }
      thumb.style.position = 'absolute';

      this.target.appendChild(thumb);

      if (this.viewModel.getIsVertical()) {
        thumb.style.top = `${valuePosition - thumb.offsetHeight / 2}px`;
      } else {
        thumb.style.left = `${valuePosition - thumb.offsetWidth / 2}px`;
      }

      this.thumb = thumb;
      this.addListener();
      return thumb;
    }
    if (Array.isArray(valuePosition)) {
      const thumbElems: Array<HTMLElement> = [];
      for (let i = 0; i < valuePosition.length; i += 1) {
        const thumbElem = document.createElement('div');
        if (Array.isArray(thumbClass)) {
          thumbElem.classList.add(...thumbClass);
        } else {
          thumbElem.classList.add(thumbClass);
        }
        thumbElem.style.position = 'absolute';

        this.target.appendChild(thumbElem);

        if (this.viewModel.getIsVertical()) {
          thumbElem.style.top = `${valuePosition[i] - thumbElem.offsetHeight / 2}px`;
        } else {
          thumbElem.style.left = `${valuePosition[i] - thumbElem.offsetWidth / 2}px`;
        }

        thumbElems.push(thumbElem);
      }

      this.thumb = [thumbElems[0], thumbElems[1]];

      this.addListener();
      return this.thumb;
    }
    return undefined;
  }

  // Удаляет ползунок(ки)
  remove() {
    if (this.thumb) {
      if (Array.isArray(this.thumb)) {
        this.thumb.forEach((elem) => {
          elem.remove();
        });
      } else {
        this.thumb.remove();
      }
    }
    this.thumb = undefined;
  }

  // Обновляет положение ползунков
  update() {
    if (this.thumb) {
      const valuePosition = this.viewModel.getValuePosition();
      let valPos: number[];
      let thumb: HTMLElement[];

      if (valuePosition !== undefined) {
        if (typeof valuePosition === 'number') {
          if (!Array.isArray(this.thumb)) {
            valPos = [valuePosition];
            thumb = [this.thumb];
          } else {
            throw new Error('valuePosition is number, but thumb is array.');
          }
        } else {
          if (Array.isArray(this.thumb)) {
            valPos = valuePosition;
            thumb = this.thumb;
          } else {
            throw new Error('valuePosition is array, but thumb is not array.');
          }
        }

        thumb.forEach((_, index) => {
          if (this.viewModel.getIsVertical()) {
            thumb[index].style.top = `${valPos[index] - thumb[index].offsetHeight / 2}px`;
            thumb[index].style.left = '';
          } else {
            thumb[index].style.left = `${valPos[index] - thumb[index].offsetWidth / 2}px`;
            thumb[index].style.top = '';
          }
        });
      }
    }
  }

  // Возвращает ползунки
  get(): Thumb | undefined {
    return this.thumb;
  }

  // Вызывает this.removeActiveThumb, добавляет класс новому activeThumb, увеличивает z-index
  // нового активного ползунка, обращается к mainView
  setActiveThumb(numOfThumb: number = 1) {
    if (this.thumb) {
      this.removeActiveThumb();

      const activeThumb = Array.isArray(this.thumb) ? this.thumb[numOfThumb] : this.thumb;
      const { activeThumbClass } = this.viewModel.getClasses();
      if (activeThumb) {
        if (Array.isArray(activeThumbClass)) {
          activeThumb.classList.add(...activeThumbClass);
        } else {
          activeThumb.classList.add(activeThumbClass);
        }

        if (Array.isArray(this.thumb)) {
          if (activeThumb.isEqualNode(this.thumb[0])) {
            const zIndex: number = window.getComputedStyle(this.thumb[1]).zIndex === 'auto'
              ? 0 : Number(window.getComputedStyle(this.thumb[1]).zIndex);
            activeThumb.style.zIndex = String(zIndex + 1);
          } else {
            const zIndex: number = window.getComputedStyle(this.thumb[0]).zIndex === 'auto'
              ? 0 : Number(window.getComputedStyle(this.thumb[0]).zIndex);
            activeThumb.style.zIndex = String(zIndex + 1);
          }
        }

        this.mainView.setActiveThumb(numOfThumb);
      }
    }
  }

  // Убирает класс активного ползунка
  removeActiveThumb(): void {
    const activeThumb = this.viewModel.getActiveThumb();
    const { activeThumbClass } = this.viewModel.getClasses();
    if (activeThumb) {
      if (Array.isArray(activeThumbClass)) {
        activeThumb.classList.remove(...activeThumbClass);
      } else {
        activeThumb.classList.remove(activeThumbClass);
      }
    }
  }

  // Перемещает ползунок на numOfSteps шагов
  moveActiveThumb(numOfSteps: number = 1) {
    const stepLengthAndLength = [this.viewModel.getStepLength(), this.viewModel.getLengthInPx()];

    if (areNumbersDefined(stepLengthAndLength)) {
      const [stepLength, length] = stepLengthAndLength;
      const activeThumb = this.viewModel.getActiveThumb();

      if (activeThumb) {
        let isActiveThumbFirst: boolean = false;
        if (Array.isArray(this.thumb)) {
          if (this.thumb[0].isEqualNode(activeThumb)) {
            isActiveThumbFirst = true;
          }
        }

        let offsetWidthOrHeight: 'offsetHeight' | 'offsetWidth';
        let leftOrTop: 'left' | 'top';
        if (this.viewModel.getIsVertical()) {
          offsetWidthOrHeight = 'offsetHeight';
          leftOrTop = 'top';
        } else {
          offsetWidthOrHeight = 'offsetWidth';
          leftOrTop = 'left';
        }

        let maxPos: number = length - activeThumb[offsetWidthOrHeight] / 2;
        let minPos: number = -activeThumb[offsetWidthOrHeight] / 2;
        if (Array.isArray(this.thumb)) {
          if (isActiveThumbFirst) {
            maxPos = parseFloat(this.thumb[1].style[leftOrTop]);
          } else {
            minPos = parseFloat(this.thumb[0].style[leftOrTop]);
          }
        }

        const offset: number = stepLength * numOfSteps;
        const pos: number = parseFloat(activeThumb.style[leftOrTop]) + offset;
        if (pos <= maxPos) {
          if (pos >= minPos) {
            activeThumb.style[leftOrTop] = `${pos}px`;
          } else {
            activeThumb.style[leftOrTop] = `${minPos}px`;
          }
        } else {
          activeThumb.style[leftOrTop] = `${maxPos}px`;
        }
        const thumbNumber: 0 | 1 = isActiveThumbFirst ? 0 : 1;
        this.mainView.onThumbMove(numOfSteps, thumbNumber);
      }
    }
  }

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  addListener() {
    if (Array.isArray(this.thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        this.thumb[i].addEventListener('mousedown', this._handleThumbMouseDown);
        this.thumb[i].addEventListener('touchstart', this._handleThumbMouseDown);
      }
    } else {
      if (this.thumb) {
        this.thumb.addEventListener('mousedown', this._handleThumbMouseDown);
        this.thumb.addEventListener('touchstart', this._handleThumbMouseDown);
      }
    }
  }

  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // вызывает this.setActiveThumb, обращается к mainView для изменения clientX/Y, добавляет
  // обработчики _handleThumbMouseMove, _handleThumbMouseUp и убирает слушатель
  // document-mouseup-removeActiveThumb
  private _handleThumbMouseDown(evt: MouseEvent | TouchEvent) {
    const activeThumb = this.viewModel.getActiveThumb();
    evt.preventDefault();
    evt.stopPropagation();

    const target = <HTMLElement>evt.target;
    if (target) {
      if (activeThumb) {
        activeThumb.style.zIndex = '';
      }

      let thumbNumber: 0|1 | undefined;
      if (Array.isArray(this.thumb)) {
        if (target.isEqualNode(this.thumb[0])) {
          thumbNumber = 0;
        } else {
          thumbNumber = 1;
        }
      }

      this.setActiveThumb(thumbNumber);

      if (activeThumb) {
        // Тут возможно this._clientX/Y = evt.clientX/Y, но я сделал так,
        // чтобы положение курсора все время было в середине thumb. Т.е.
        // определение прошлого положения курсора зависит не от самого
        // курсора, а от thumb(аналогично в _handleThumbMouseMove)
        const clientX = activeThumb.getBoundingClientRect().left
          + activeThumb.offsetWidth / 2;

        const clientY = activeThumb.getBoundingClientRect().top
          + activeThumb.offsetHeight / 2;

        this.mainView.setClientCoords([clientX, clientY]);
      }

      document.addEventListener('mousemove', this._handleThumbMouseMove);
      document.addEventListener('touchmove', this._handleThumbMouseMove);
      document.addEventListener('mouseup', this._handleThumbMouseUp);
      document.addEventListener('touchend', this._handleThumbMouseUp);

      document.removeEventListener('mouseup', this.removeActiveThumb);
      document.removeEventListener('touchend', this.removeActiveThumb);
      }
  }

  // При отжатии кнопки после ползунка убирает обработчики _handleThumbMouseMove и
  // _handleThumbMouseUp, добавляет слушатель document-mouseup, который убирает
  // активный тамб при клике в любое место документа
  private _handleThumbMouseUp() {
    document.removeEventListener('mousemove', this._handleThumbMouseMove);
    document.removeEventListener('touchmove', this._handleThumbMouseMove);
    document.removeEventListener('mouseup', this._handleThumbMouseUp);
    document.removeEventListener('touchend', this._handleThumbMouseUp);
    document.addEventListener('mouseup', this.removeActiveThumb);
    document.addEventListener('touchend', this.removeActiveThumb);
  }

  // При перемещении мыши вызывается moveActiveThumb с numOfSteps,
  // зависящим от смещения мыши, обращается к mainView для смены coords
  private _handleThumbMouseMove(evt: MouseEvent | TouchEvent) {
    const stepLength = this.viewModel.getStepLength();
    const activeThumb = this.viewModel.getActiveThumb();

    if (stepLength) {
      if (activeThumb) {
        let clientX;
        let clientY;
        if ('clientX' in evt) {
          clientX = evt.clientX;
          clientY = evt.clientY;
        } else {
          clientX = evt.touches[0].clientX;
          clientY = evt.touches[0].clientY;
        }
        if (this.viewModel.getIsVertical()) {
          if (Math.abs(clientY - this.viewModel.getClientCoords()[1]) >= stepLength) {
            const numOfSteps = Math.trunc(
              (clientY - this.viewModel.getClientCoords()[1]) / stepLength,
            );
            this.moveActiveThumb(numOfSteps);

            this.mainView.setClientCoords([
              this.viewModel.getClientCoords()[0],
              activeThumb.getBoundingClientRect().top + activeThumb.offsetHeight / 2,
            ]);
          }
        } else {
          if (Math.abs(clientX - this.viewModel.getClientCoords()[0]) >= stepLength) {
            const numOfSteps = Math.trunc(
              (clientX - this.viewModel.getClientCoords()[0]) / stepLength,
            );
            this.moveActiveThumb(numOfSteps);

            this.mainView.setClientCoords([
              activeThumb.getBoundingClientRect().left + activeThumb.offsetWidth / 2,
              this.viewModel.getClientCoords()[1],
            ]);
          }
        }
      }
    }
  }
}

export default ThumbView;
