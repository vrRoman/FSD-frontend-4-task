# Слайдер. Плагин для JQuery

### [Демо слайдера](https://vrroman.github.io/FSD-frontend-4-task/demo/demo.html)
---
## Развертывание
#### Установка библиотек
```
npm install
```
#### Команды для компиляции
_Запустить тесты:_  
```
npm run test
```  
_Скомпилировать код в режиме development:_  
```
npm run build:dev
```  
_Скомпилировать код в режиме production:_  
```
npm run build:prod
```  
_Запустить линтер:_  
```
npm run lint
```  

## Использование
#### Для подключения необходимо:
 * Подключить JQuery
 * Подключить slider.min.css и slider.min.js из папки dist  
 
#### Создание слайдера
 * С настройками по умолчанию:  
 ```javascript
 $('selector').slider();
 ```
 * С пользовательскими настройками:  
 ```javascript
 $('selector').slider({
   isRange: true,
   value: [1, 9],
 });
 ```

#### Получение значений
```javascript
 $('selector').slider('value'); // Возвращает текущее value
 $('selector').slider('view'); // Возвращает view
```

#### Изменение настроек
```javascript
 $('selector').slider('changeOptions', {
   value: [1, 9],
   isVertical: true,
 });
```
---

## Настройки
| Имя свойства         | Тип значения               | Значение по умолчанию | Описание               |
| -------------------- |:--------------------------:|:---------------------:| ---------------------- |
| value | [number, number] \| number | 0 | Устанавливает начальное значение слайдера. Если range==true, а значение - number, то значение удваивается. Если range==false, а значение - массив, берется первое значение.|
| isRange | boolean | false | Диапазон(два бегунка). |
| stepSize | number | 1 | Определяет скольким еденицам равняется размер шага. Если < 0, то stepSize=1. |
| min | number | 0 | Минимальное значение. Если > max, то они меняются местами. |
| max | number | 10 | Максимальное значение. |
| length | string | 100% | Длина слайдера как css свойство(px, % и т.д.). |
| hasTooltip | boolean | false | Подсказка над бегунками с соответствующим значением. |
| hasScale | boolean | false | Шкала значений. |
| scaleValue | number \| Array<number, string> | 3 | Если number, показывает n зачений. Если массив, показывает все пользовательские элементы массива. |
| hasValueInfo | boolean | false | Добавляет элмент с текущим значением слайдера(Если range==true, используется шаблон value[0] - value[1]). |
| isVertical | boolean | false | Вертикальный режим слайдера. |
| isResponsive | boolean | false | Если true, при изменении размера слайдера, он обновляется. Не рекомендуется, если length указывается в статических ед. измерения(px). |
| (slider\|sliderVertical<br>\|bar\|progressBar\|thumb<br>\|activeThumb\|tooltip\|scale<br>\|valueInfo)Class | string \|Array<string\> | Одноименное, по БЭМ | Класс определенного элемента. Может быть массивом классов. |
| useKeyboard | boolean | true | При нажатии стрелок и клавиш ad активный ползунок будет перемещаться. |
| isScaleClickable | boolean | false | При нажатии на элементы шкалы значений, значение будет меняться на соответсвующее. |
| onChange | Function | None | Будет вызываться при каждом перемещении ползунков. |


## Значения, которые можно получить
| Имя значения | Тип возвращаемого значения | Описание |
| ------------ |:--------------------------:| -------- |
| model | Object | Возвращает model слайдера. Можно использовать, если нужны методы Model. |
| view | Object | Возвращает view слайдера. Можно использовать, если нужны методы View. |
| viewModel | Object | Возвращает viewModel слайдера. Можно использовать, если нужны данные отображения. |
| controller | Object | Возвращает controller слайдера. Можно использовать, если нужны методы Presenter. |
| value | [number, number] \| number | Текущее значение слайдера |

---

## Описание архитектуры
#### Model
Управляет данными слайдера(работа без пользовательского интерфейса). 
При изменении значений вызывает у всех подписчиков метод update 
с входящим параметром action. В action.type может храниться: 'UPDATE_VALUE' 
| 'UPDATE_IS-RANGE' | 'UPDATE_MIN-MAX' | 'UPDATE_STEPSIZE'.
#### View
Имеет свою внутреннюю структуру: ViewModel, SubViews, View. Внутренний View
 является "точкой входа" в этот модуль, управляет и предоставляет данные SubViews и ViewModel,
 подписывается на ViewModel и обновляет SubViews. При движении ползунка уведомляет Presenter.
 SubViews отвечают за отрисовку элементов слайдера, берут значения из ViewModel,
 который предоставляет View. ViewModel
 управляет данными отображения. При изменении данных, уведомляет подписчиков. В action.type ViewModel'а
 может храниться 'UPDATE_LENGTH' | 'UPDATE_IS-VERTICAL' | 'UPDATE_IS-RESPONSIVE' | 'UPDATE_HAS-TOOLTIP'
 | 'UPDATE_HAS-SCALE' | 'UPDATE_SCALE-VALUE' | 'UPDATE_HAS-VALUEINFO' | 'UPDATE_USEKEYBOARD'
 | 'UPDATE_IS-SCALE-CLICKABLE'. 
#### Presenter
Реализует взаимодействие отображения и модели. Подписывается на model. 
При изменении модели обновляет view, при движении ползунка обращается к модели.

### ![Diagram](https://github.com/vrRoman/FSD-frontend-4-task/blob/master/slider-uml.png)
