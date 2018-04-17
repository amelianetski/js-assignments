/** ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
export function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.__proto__.getArea = () => this.width * this.height;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
export function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
export function fromJSON(proto, json) {
  return Object.assign(Object.create(proto), JSON.parse(json));
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and
 * pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and
 * implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear
 * and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify() =>
 *    '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify() =>
 *    'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify() =>
 *      'div#main.container.draggable + table#data ~ tr:nth-of-type(even) td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
const ERROR = [
  'Element, id and pseudo-element should not occur more then one time inside the selector...',
  'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element'
];

function selectorCreater(combine = '') {
  const selectors = {
    element: '',
    id: '',
    class: '',
    attr: '',
    pseudoClass: '',
    pseudoElement: ''
  };
  function checkOrder(currentPart) {
    let b = false;
    for (let i in selectors) {
      if (selectors.hasOwnProperty(i)) {
        if (b && selectors[i]) throw new Error(ERROR[1]);
        else if (!b && i === currentPart) b = true;
      }
    }
  }
  this.element = function(value) {
    if (selectors.element) {
      throw new Error(ERROR[0]);
    }
    checkOrder('element');
    selectors.element = value;
    return this;
  };
  this.id = function(value) {
    if (selectors.id) {
      throw new Error(ERROR[0]);
    }
    checkOrder('id');
    selectors.id = `#${value}`;
    return this;
  };
  this.class = function(value) {
    checkOrder('class');
    selectors.class += `.${value}`;
    return this;
  };
  this.attr = function(value) {
    checkOrder('attr');
    selectors.attr = `[${value}]`;
    return this;
  };
  this.pseudoClass = function(value) {
    checkOrder('pseudoClass');
    selectors.pseudoClass += `:${value}`;
    return this;
  };
  this.pseudoElement = function(value) {
    if (selectors.pseudoElement) {
      throw new Error(ERROR[0]);
    }
    checkOrder('pseudoElement');
    selectors.pseudoElement = `::${value}`;
    return this;
  };
  this.stringify = function() {
    let result = '';
    for (let key in selectors) {
      if (selectors.hasOwnProperty(key)) {
        result += selectors[key];
      }
    }
    return combine + result;
  };
}

export const cssSelectorBuilder = {
  element(value) {
    return new selectorCreater().element(value);
  },

  id(value) {
    return new selectorCreater().id(value);
  },

  class(value) {
    return new selectorCreater().class(value);
  },

  attr(value) {
    return new selectorCreater().attr(value);
  },

  pseudoClass(value) {
    return new selectorCreater().pseudoClass(value);
  },

  pseudoElement(value) {
    return new selectorCreater().pseudoElement(value);
  },
  combine(selector1, combinator, selector2) {
    return new selectorCreater(
      `${selector1.stringify()} ${combinator} ${selector2.stringify()}`
    );
  }
};
