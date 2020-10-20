

function insertCursorTransform(index: number, length: any, cursor: number) {
  return (index < cursor) ? cursor + length : cursor;
}

function removeCursorTransform(index: number, length: number, cursor: number) {
  return (index < cursor) ? cursor - Math.min(length, cursor - index) : cursor;
}

export default class TextDiffBinding {
  element!: HTMLTextAreaElement;

  constructor (element: HTMLTextAreaElement) {
    this.element = element;
  }

  _get(): any {
    throw new Error('`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.');
  }
  _insert(index: any, text: any): any {
    throw new Error('`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.');
  }
  _remove(index: any, text: any): any {
    throw new Error('`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.');
  }

  _getElementValue(): any {
    var value = this.element.value;
    // IE and Opera replace \n with \r\n. Always store strings as \n
    return value.replace(/\r\n/g, '\n');
  }

  _getInputEnd(previous: string | any[], value: string | any[]) {
    if (this.element !== document.activeElement) return null;
    var end = value.length - this.element?.selectionStart;
    if (end === 0) return end;
    if (previous.slice(previous.length - end) !== value.slice(value.length - end)) return null;
    return end;
  };

  public onInput() {
    var previous = this._get();
    var value = this._getElementValue();
    if (previous === value) return;

    if (value) {
      var start = 0;
      // Attempt to use the DOM cursor position to find the end
      var end = this._getInputEnd(previous, value);
      if (end === null) {
        // If we failed to find the end based on the cursor, do a diff. When
        // ambiguous, prefer to locate ops at the end of the string, since users
        // more frequently add or remove from the end of a text input
        while (previous.charAt(start) === value.charAt(start)) {
          start++;
        }
        end = 0;
        while (
          previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) &&
          end + start < previous.length &&
          end + start < value.length
        ) {
          end++;
        }
      } else {
        while (
          previous.charAt(start) === value.charAt(start) &&
          start + end < previous.length &&
          start + end < value.length
        ) {
          start++;
        }
      }

      if (previous.length !== start + end) {
        var removed = previous.slice(start, previous.length - end);
        this._remove(start, removed);
      }
      if (value.length !== start + end) {
        var inserted = value.slice(start, value.length - end);
        this._insert(start, inserted);
      }
    }
  }

  onInsert(index: any, length: any) {
    this._transformSelectionAndUpdate(index, length, insertCursorTransform);
  }

  onRemove(index: any, length: any) {
    this._transformSelectionAndUpdate(index, length, removeCursorTransform);
  }

  _transformSelectionAndUpdate(index: any, length: any, transformCursor: { (index: number, length: any, cursor: number): any; (index: number, length: number, cursor: number): number; (arg0: any, arg1: any, arg2: number): any; }) {
    if (document.activeElement === this.element) {
      var selectionStart = transformCursor(index, length, this.element?.selectionStart);
      var selectionEnd = transformCursor(index, length, this.element?.selectionEnd);
      var selectionDirection = this.element?.selectionDirection;
      this.update();
      this.element?.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    } else {
      this.update();
    }
  }

  update() {
    var value = this._get();
    if (this._getElementValue() === value) return;
    this.element.value = value;
  }
}
