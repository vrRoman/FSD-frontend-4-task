# Слайдер. Плагин для JQuery

### [Демо слайдера](https://vrroman.github.io/FSD-frontend-4-task/demo/demo.html)
---
## Развертывание
#### Установка библиотек
```
npm install
```
#### Команды для компиляции
_Запустить webpack-dev-server:_  
```
npm run start
```  
_Скомпилировать код в режиме development:_  
```
npm run build:dev
```  
_Скомпилировать код в режиме production:_  
```
npm run build:prod
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
   range: true,
   value: [1, 9],
 });
 ```

#### Получение значений
```javascript
 $('selector').slider('value'); // Возвращает текущее value
```

#### Изменение настроек
```javascript
 $('selector').slider('value', [1, 9]);
```
---

## Настройки
| Имя свойства         | Тип значения               | Значение по умолчанию | Описание               |
| -------------------- |:--------------------------:|:---------------------:| ---------------------- |
| value | [number, number] \| number | 0 | Устанавливает начальное значение слайдера. Если range==true, а значение - number, то значение удваивается. Если range==false, а значение - массив, берется первое значение.|
| range | boolean | false | Диапазон(два бегунка). |
| stepSize | number | 1 | Определяет скольким еденицам равняется размер шага. Если < 0, то stepSize=1. |
| min | number | 0 | Минимальное значение. Если > max, то они меняются местами. |
| max | number | 10 | Максимальное значение. |
| length | string | 100% | Длина слайдера как css свойство(px, % и т.д.). |
| tooltip | boolean | false | Подсказка над бегунками с соответствующим значением. |
| stepsInfo | boolean \| number \| Array<number, string> | false | Показывает шкалу значений. Если true, показывает 5 значений. Если number, показывает n значений. Если массив, то показывает все пользовательские значения в массиве. |
| valueInfo | boolean | false | Добавляет элмент с текущим значением слайдера(Если range==true, используется шаблон value[0] - value[1]). |
| vertical | boolean | false | Вертикальный режим слайдера. |
| responsive | boolean | false | Если true, при изменении размера слайдера, он обновляется. Не рекомендуется, если length указывается в статических ед. измерения(px). |
| (slider\|sliderVertical<br>\|bar\|progressBar\|thumb<br>\|activeThumb\|tooltip\|stepsInfo<br>\|valueInfo)Class | string \|Array<string\> | Одноименное, по БЭМ | Класс определенного элемента. Может быть массивом классов. |
| useKeyboard | boolean | true | При нажатии стрелок и клавиш ad активный ползунок будет перемещаться. |
| interactiveStepsInfo | boolean | true | При нажатии на элементы шкалы значений, значение будет меняться на соответсвующее. |
| onChange | Function | None | Будет вызываться при каждом перемещении ползунков. |


## Значения, которые можно получить
| Имя значения | Тип возвращаемого значения | Описание |
| ------------ |:--------------------------:| -------- |
| model | Object | Возвращает model слайдера. Можно использовать, если нужны методы Model. |
| view | Object | Возвращает view слайдера. Можно использовать, если нужны методы View. |
| controller | Object | Возвращает controller слайдера. Можно использовать, если нужны методы Controller. |
| value | [number, number] \| number | Текущее значение слайдера |
| range | boolean | Range |
| stepSize | number | Размер шага |
| min | number | Минимальное значение |
| max | number | Максимальное значение |
| vertical | boolean | Вертикальный режим |
| responsive | boolean | Отзывчивость |
| tooltip | undefined \| HTMLElement | Элемент(ы) с подсказками |
| stepsInfo | undefined \| HTMLElement | Элемент шкалы значений |
| valueInfo | undefined \| HTMLElement | Элемент информации о значении |
| useKeyboard | boolean | Использование клавиатуры |
| interactiveStepsInfo | boolean | Интерактивная шкала значений |

---

## Описание архитектуры
#### Model
Управляет значением слайдера(работа без пользовательского интерфейса). Реализует Observer. 
При изменении значений вызывает у всех подписчиков метод update 
с входящим параметром action. В action.type может храниться: 'UPDATE_VALUE' 
| 'UPDATE_RANGE' | 'UPDATE_MIN' | 'UPDATE_MAX'.
#### View
Отрисовывает все элементы слайдера. Берет значения из model.
#### Controller
Реализует взаимодействие пользователя и модели. Управляет ползунками и шкалой значений(если интерактивная).
Подписывается на model, обновляет view.

### ![Diagram](https://github.com/vrRoman/FSD-frontend-4-task/blob/master/slider-uml.png)
