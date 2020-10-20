import * as ShareDB from 'sharedb';
import { SDBDoc } from 'sdb-ts';
import TextDiffBinding from './text-diff-binding';

function isSubpath(path: string | any[], testPath: any[]) {
  for (var i = 0; i < path.length; i++) {
    if (testPath[i] !== path[i]) return false;
  }
  return true;
}

export default class StringBinding extends TextDiffBinding {
  // element!: HTMLTextAreaElement;
  doc!: ShareDB.Doc;
  _opListener: any;
  _inputListener: any = null;
  path:[] = [];

  constructor (element: HTMLTextAreaElement, doc: SDBDoc<string>, path?: any) {
    super(element);
    this.doc = doc.__doc__();
    this.path = path || [];
  }

  setup() {
      this.update();
      this.attachDoc();
      this.attachElement();
  }

  destroy() {
    this.detachElement();
    this.detachDoc();
  }

  attachElement() {
    var binding = this;
    this._inputListener = function() {
      binding.onInput();
    };
    this.element.addEventListener('input', this._inputListener, false);
  }

  detachElement() {
    this.element.removeEventListener('input', this._inputListener, false);
  }

  attachDoc() {
    var binding = this;
    this._opListener = function(op: string | any[], source: any) {
      binding._onOp(op, source);
    };
    this.doc.on('op', this._opListener);
  }

  detachDoc() {
    this.doc.removeListener('op', this._opListener);
  }

  _onOp(op: string | any[], source: any) {
    if (source === this) return;
    if (op.length === 0) return;
    if (op.length > 1) {
      throw new Error('Op with multiple components emitted');
    }
    var component = op[0];
    if (isSubpath(this.path, component.p)) {
      this._parseInsertOp(component);
      this._parseRemoveOp(component);
    } else if (isSubpath(component.p, this.path)) {
      this._parseParentOp();
    }
  };

  _parseInsertOp(component: { si: string | any[]; p: string | any[]; }) {
    if (!component.si) return;
    var index = component.p[component.p.length - 1];
    var length = component.si.length;
    this.onInsert(index, length);
  }

  _parseRemoveOp(component: { sd: string | any[]; p: string | any[]; }) {
    if (!component.sd) return;
    var index = component.p[component.p.length - 1];
    var length = component.sd.length;
    this.onRemove(index, length);
  }

  _parseParentOp() {
    this.update();
  }

  _get() {
    var value = this.doc.data;
    for (var i = 0; i < this.path.length; i++) {
      var segment = this.path[i];
      value = value[segment];
    }
    return value;
  }

  _insert(index: any, text: any) {
    var path = this.path.concat(index);
    var op = {p: path, si: text};
    this.doc.submitOp([op], {source: true});
  }

  _remove(index: any, text: any) {
    var path = this.path.concat(index);
    var op = {p: path, sd: text};
    this.doc.submitOp([op], {source: true});
  }
}
