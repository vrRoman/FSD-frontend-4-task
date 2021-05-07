function isArrayOfHTMLElements(array: Array<any>): array is Array<HTMLElement> {
  let isAllHTMLElements = true;
  array.forEach((element) => {
    if (!(element instanceof HTMLElement)) {
      isAllHTMLElements = false;
    }
  });
  return isAllHTMLElements;
}

export default isArrayOfHTMLElements;
