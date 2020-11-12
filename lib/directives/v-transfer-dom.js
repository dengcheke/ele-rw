"use strict";

exports.__esModule = true;
exports.TransferDom = void 0;

function getTarget(node) {
  if (node === false || node === null) return null;

  if (node === true || !node || node === 'body') {
    return document.body;
  }

  if (typeof node === 'string') {
    return document.querySelector(node);
  }

  if (node instanceof window.Node) {
    return node;
  }

  return null;
}
/*
*  移动dom到其他位置，
*   v-transfer-dom="node"
*       node为 null/false 则不移动,
*       node为 undefined/falsy/'body' 则目标为document.body
*       node为 string, 则调用css selector,（若找不到节点则不移动）
*       node为 window.Node, 则目标为node
*/


var TransferDom = {
  inserted: function inserted(el, _ref, vnode) {
    var value = _ref.value;
    el.classList.add('v-transfer-dom');
    var parentNode = el.parentNode; //父节点

    var placeholder = document.createComment('');
    var hasMovedOut = false;
    var target = getTarget(value);

    if (target) {
      parentNode.replaceChild(placeholder, el); // 用占位节点替换

      target.appendChild(el); // el移动到新位置

      hasMovedOut = true;
    }

    if (!el.__transferDomData) {
      el.__transferDomData = {
        parentNode: parentNode,
        home: placeholder,
        target: target,
        hasMovedOut: hasMovedOut
      };
    }
  },
  componentUpdated: function componentUpdated(el, _ref2, vnode, oldvnode) {
    var value = _ref2.value;
    var transferData = el.__transferDomData;
    var parentNode = transferData.parentNode,
        home = transferData.home,
        target = transferData.target,
        hasMovedOut = transferData.hasMovedOut;
    var newTarget = getTarget(value); //新目标

    if (target === newTarget) {
      //不需要移动
      return;
    }

    if (newTarget) {
      //新目标存在
      if (!hasMovedOut) {
        //还没有移动过
        parentNode.replaceChild(home, el);
      }

      newTarget.appendChild(el);
      transferData.hasMovedOut = true;
      transferData.target = newTarget;
    } else {
      //没有目标，移回去
      if (hasMovedOut) {
        parentNode.replaceChild(el, home);
        el.__transferDomData.hasMovedOut = false;
        el.__transferDomData.target = null;
      }
    }
  },
  unbind: function unbind(el, binding) {
    el.classList.remove('v-transfer-dom');
    var transferData = el.__transferDomData || {};
    var hasMovedOut = transferData.hasMovedOut,
        parentNode = transferData.parentNode,
        home = transferData.home;

    if (hasMovedOut) {
      parentNode && parentNode.replaceChild(el, home);
    }

    el.__transferDomData = null;
  }
};
exports.TransferDom = TransferDom;