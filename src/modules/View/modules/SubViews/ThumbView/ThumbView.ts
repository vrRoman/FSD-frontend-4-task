import { IThumbView, Thumb } from './interfaceAndTypes';
import { IViewModelGetMethods } from '../../ViewModel/interfacesAndTypes';
import IView from '../../View/interfaces';


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

    this.handleThumbMouseDown = this.handleThumbMouseDown.bind(this);
    this.handleThumbMouseUp = this.handleThumbMouseUp.bind(this);
    this.handleThumbMouseMove = this.handleThumbMouseMove.bind(this);
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

      if (this.viewModel.getVertical()) {
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

        if (this.viewModel.getVertical()) {
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
    const valuePosition = this.viewModel.getValuePosition();

    if (this.thumb) {
      if (typeof valuePosition === 'number' && !Array.isArray(this.thumb)) {
        if (this.viewModel.getVertical()) {
          this.thumb.style.top = `${valuePosition - this.thumb.offsetHeight / 2}px`;
          this.thumb.style.left = '';
        } else {
          this.thumb.style.left = `${valuePosition - this.thumb.offsetWidth / 2}px`;
          this.thumb.style.top = '';
        }
      } else if (Array.isArray(valuePosition) && Array.isArray(this.thumb)) {
        for (let i = 0; i <= 1; i += 1) {
          if (this.viewModel.getVertical()) {
            this.thumb[i].style.top = `${valuePosition[i] - this.thumb[i].offsetHeight / 2}px`;
            this.thumb[i].style.left = '';
          } else {
            this.thumb[i].style.left = `${valuePosition[i] - this.thumb[i].offsetWidth / 2}px`;
            this.thumb[i].style.top = '';
          }
        }
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
    const stepLength = this.viewModel.getStepLength();
    const length = this.viewModel.getLengthInPx();
    const activeThumb = this.viewModel.getActiveThumb();

    if (stepLength && length) {
      if (activeThumb) {
        let activeThumbIsFirst: boolean = false;
        if (Array.isArray(this.thumb)) {
          if (this.thumb[0].isEqualNode(activeThumb)) {
            activeThumbIsFirst = true;
          }
        }

        let offsetWidthOrHeight: 'offsetHeight' | 'offsetWidth';
        let leftOrTop: 'left' | 'top';
        if (this.viewModel.getVertical()) {
          offsetWidthOrHeight = 'offsetHeight';
          leftOrTop = 'top';
        } else {
          offsetWidthOrHeight = 'offsetWidth';
          leftOrTop = 'left';
        }

        let maxPos: number = length - activeThumb[offsetWidthOrHeight] / 2;
        let minPos: number = -activeThumb[offsetWidthOrHeight] / 2;
        if (Array.isArray(this.thumb)) {
          if (activeThumbIsFirst) {
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
        const thumbNumber: 0 | 1 = activeThumbIsFirst ? 0 : 1;
        this.mainView.onThumbMove(numOfSteps, thumbNumber);
      }
    }
  }

  // При нажатии на ползунок убирает z-index предыдущего активного ползунка,
  // вызывает this.setActiveThumb, обращается к mainView для изменения clientX/Y, добавляет
  // обработчики handleThumbMouseMove, handleThumbMouseUp и убирает слушатель
  // document-mouseup-removeActiveThumb
  private handleThumbMouseDown(evt: MouseEvent | TouchEvent) {
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
        // курсора, а от thumb(аналогично в handleThumbMouseMove)
        const clientX = activeThumb.getBoundingClientRect().left
          + activeThumb.offsetWidth / 2;

        const clientY = activeThumb.getBoundingClientRect().top
          + activeThumb.offsetHeight / 2;

        this.mainView.setClientCoords([clientX, clientY]);
      }

      document.addEventListener('mousemove', this.handleThumbMouseMove);
      document.addEventListener('touchmove', this.handleThumbMouseMove);
      document.addEventListener('mouseup', this.handleThumbMouseUp);
      document.addEventListener('touchend', this.handleThumbMouseUp);

      document.removeEventListener('mouseup', this.removeActiveThumb);
      document.removeEventListener('touchend', this.removeActiveThumb);
      }
  }

  // При отжатии кнопки после ползунка убирает обработчики handleThumbMouseMove и
  // handleThumbMouseUp, добавляет слушатель document-mouseup, который убирает
  // активный тамб при клике в любое место документа
  private handleThumbMouseUp() {
    document.removeEventListener('mousemove', this.handleThumbMouseMove);
    document.removeEventListener('touchmove', this.handleThumbMouseMove);
    document.removeEventListener('mouseup', this.handleThumbMouseUp);
    document.removeEventListener('touchend', this.handleThumbMouseUp);
    document.addEventListener('mouseup', this.removeActiveThumb);
    document.addEventListener('touchend', this.removeActiveThumb);
  }

  // При перемещении мыши вызывается moveActiveThumb с numOfSteps,
  // зависящим от смещения мыши, обращается к mainView для смены coords
  private handleThumbMouseMove(evt: MouseEvent | TouchEvent) {
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
        if (this.viewModel.getVertical()) {
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

  // Добавляет слушатель thumb onMouseDown к ползунку(ам)
  addListener() {
    if (Array.isArray(this.thumb)) {
      for (let i = 0; i <= 1; i += 1) {
        this.thumb[i].addEventListener('mousedown', this.handleThumbMouseDown);
        this.thumb[i].addEventListener('touchstart', this.handleThumbMouseDown);
      }
    } else {
      if (this.thumb) {
        this.thumb.addEventListener('mousedown', this.handleThumbMouseDown);
        this.thumb.addEventListener('touchstart', this.handleThumbMouseDown);
      }
    }
  }
}

export default ThumbView;
