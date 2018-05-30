/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left,
 * right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ];
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false
 */
export function findStringInSnakingPuzzle(puzzle, searchStr) {
  function rec(exclude) {
    if (searchStr.length === exclude.length) return true;
    let pos = exclude[exclude.length - 1];
    for (let val of [[0, 1], [1, 0], [0, -1], [-1, 0]]) {
      if (
        pos[0] + val[0] >= 0 &&
        pos[0] + val[0] < puzzle.length &&
        pos[1] + val[1] >= 0 &&
        pos[1] + val[1] < puzzle[pos[0] + val[0]].length &&
        !exclude.some(
          v => v[0] === pos[0] + val[0] && v[1] === pos[1] + val[1]
        ) &&
        puzzle[pos[0] + val[0]][pos[1] + val[1]] === searchStr[exclude.length]
      ) {
        if (rec(exclude.concat([[pos[0] + val[0], pos[1] + val[1]]]))) {
          return true;
        }
      }
    }
  }

  for (let i = 0; i < puzzle.length; i++) {
    for (let j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] === searchStr[0] && rec([[i, j]])) return true;
    }
  }
  return false;
}

/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 *
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from
 *    the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
export function* getPermutations(chars) {
  function* rec(str) {
    if (str.length === chars.length) yield str;
    else {
      for (let i = 0; i < chars.length; i++) {
        if (str.indexOf(chars[i]) < 0) yield* rec(str + chars[i]);
      }
    }
  }

  yield* rec('');
}

/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units
 * you have already bought, or do nothing.
 * Therefore, the most profit is the maximum difference of all pairs in a sequence
 * of stock prices.
 *
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
export function getMostProfitFromStockQuotes(quotes) {
  let result = 0,
    quotesSorted = quotes.slice(0).sort((a, b) => b - a);
  while (quotes.length) {
    while (quotes.indexOf(quotesSorted[0]) < 0) quotesSorted.shift();
    let inx = quotes.indexOf(quotesSorted[0]);
    result += quotesSorted[0] * inx;
    for (let i = 0; i < inx; i++) result -= quotes[i];
    quotes.splice(0, inx + 1);
  }
  return result;
}

/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 *
 * @class
 *
 * @example
 *
 *   var urlShortener = new UrlShortener();
 *   var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *   var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 *
 */
export function UrlShortener() {
  this.urlAllowedChars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwxyz' +
    "0123456789-_.~!*'();:@&=+$,/?#[]";
}

UrlShortener.prototype = {
  encode: function(url) {
    let code = url.slice(8);
    code = code
      .split('')
      .map(val => {
        let cur = '' + (val.charCodeAt(0) - 27);

        if (cur.length === 1) return '0' + cur;
        return cur;
      })
      .join('');

    let codeSequence = [];

    for (let i = 3; i <= code.length; i += 3) {
      codeSequence.push(code.slice(i - 3, i));

      if (code.length - i < 3) {
        let repeat = code.length - i > 1 ? 1 : 2;
        codeSequence.push(code.slice(i) + '0'.repeat(repeat));
        break;
      }
    }

    code = codeSequence.map(val => String.fromCharCode(val)).join('');

    return code;
  },

  decode: function(code) {
    let url = code
      .split('')
      .map(val => {
        let cur = '' + val.charCodeAt(0);
        if (cur.length === 2) return '0' + cur;
        else if (cur.length === 1) return '00' + cur;
        return cur;
      })
      .join('');

    let urlSequence = [];

    for (let i = 2; i <= url.length; i += 2) {
      urlSequence.push(url.slice(i - 2, i));
    }

    url = urlSequence
      .map(val => {
        if (+val !== 0) return String.fromCharCode(+val + 27);
        else if (val[0] !== '0' && val[1] === '0') {
          return String.fromCharCode(+val.charAt(0) + 27);
        }
      })
      .join('');

    return 'https://' + url;
  }
};
