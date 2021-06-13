import areElementsDefined from './areElementsDefined';

function changeClassList(
  action: 'add' | 'remove',
): (element: Element, className: string | Array<string>) => Element;
function changeClassList(
  action: 'add' | 'remove',
  element: Element,
  className: string | Array<string>,
): Element;
function changeClassList(
  action: 'add' | 'remove',
  ...elementAndClassName: [Element, string | Array<string>] | []
) {
  const main = (element: Element, className: string | Array<string>) => {
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
