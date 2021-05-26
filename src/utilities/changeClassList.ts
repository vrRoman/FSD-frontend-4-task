import areElementsDefined from './areElementsDefined';

function changeClassList(
  action: 'add' | 'remove',
): (element: HTMLElement, className: string | Array<string>) => HTMLElement;
function changeClassList(
  action: 'add' | 'remove',
  element: HTMLElement,
  className: string | Array<string>,
): HTMLElement;
function changeClassList(
  action: 'add' | 'remove',
  ...elementAndClassName: [HTMLElement, string | Array<string>] | []
) {
  const main = (element: HTMLElement, className: string | Array<string>) => {
    if (Array.isArray(className)) {
      element.classList[action](...className);
    } else {
      element.classList[action](className);
    }
    return element;
  };

  if (areElementsDefined(elementAndClassName)) {
    const [element, className] = elementAndClassName;
    return main(element, className);
  }

  return main;
}

const addClass = changeClassList('add');
const removeClass = changeClassList('remove');

export {
  changeClassList,
  addClass,
  removeClass,
};
