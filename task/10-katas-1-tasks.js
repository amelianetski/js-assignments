/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
export function createCompassPoints(sides = ['N', 'E', 'S', 'W']) {
  /* implement your code here */
  /* use array of cardinal directions only! it is a default parameter! */
  const result = [];

  for (let i = 0; i < 4; i++) {
    const from = i % 2 ? 2 : 5;
    for (let j = -from; j <= from; j++) {
      const pos = (i * 8 + j + 32) % 32, // current position in result
        posi = (i + (j < 0 ? -1 : 1) + 4) % 4, // previous or next position in sides
        ja = Math.abs(j);
      result[pos] = sides[i];
      if (j) {
        result[pos] +=
          ja % 2
            ? (ja > 1 ? sides[posi] : '') +
              'b' +
              (ja === 3 ? sides[i] : sides[posi])
            : ja === 4
              ? sides[posi]
              : i % 2
                ? sides[posi] + sides[i]
                : sides[i] + sides[posi];
      }
    }
  }
  return result.map((e, i) => {
    return {
      abbreviation: e,
      azimuth: i * 11.25
    };
  });
}

/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear
 * at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
export function* expandBraces(str) {
  const input = [str],
    exist = [];
  while (input.length > 0) {
    str = input.shift();
    let match = str.match(/\{([^{}]+)\}/);
    if (match) {
      for (let value of match[1].split(',')) {
        input.push(str.replace(match[0], value));
      }
    } else if (exist.indexOf(str) < 0) {
      exist.push(str);
      yield str;
    }
  }
}

/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient
 * of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
export function getZigZagMatrix(n) {
  const mtx = [];
  for (let i = 0; i < n; i++) mtx[i] = [];
  let i = 1,
    j = 1;
  for (let e = 0; e < n * n; e++) {
    mtx[i - 1][j - 1] = e;
    if ((i + j) % 2 === 0) {
      if (j < n) j++;
      else i += 2;
      if (i > 1) i--;
    } else {
      if (i < n) i++;
      else j += 2;
      if (j > 1) j--;
    }
  }
  return mtx;
}

/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row
 *  (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
export function canDominoesMakeRow(dominoes) {
  let res = false,
    cnt = Array.from({ length: 7 }, () => 0);
  dominoes = dominoes.filter((v, i) => {
    if (v[0] !== v[1]) {
      cnt[v[0]]++;
      cnt[v[1]]++;
      return true;
    } else {
      if (
        !dominoes.some(
          (v1, i1) => i !== i1 && (v[0] === v1[0] || v[0] === v1[1])
        )
      ) {
        res = true;
      }
      return false;
    }
  });
  if (res) return false;
  if (dominoes.length === 1) return true;
  res = 0;
  for (let i = 0; i < 7; i++) if (cnt[i] % 2) res++;
  if (res > 2) return false;
  function* combine(domino1, domino2) {
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        if (domino1[i] === domino2[j]) yield [domino1[1 - i], domino2[1 - j]];
      }
    }
  }
  const exclude = Array.from({ length: dominoes.length }, (v, i) => i);
  let excludeCount = 1;
  function rec(domino) {
    if (excludeCount === dominoes.length) return true;
    for (let i = 1; i < dominoes.length; i++) {
      if (exclude[i]) {
        exclude[i] = false;
        excludeCount++;
        for (let v of combine(domino, dominoes[i])) if (rec(v)) return true;
        exclude[i] = true;
        excludeCount--;
      }
    }
    if (excludeCount === 1) return false;
  }
  return rec(dominoes[0]);
}

/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end
 *     integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to
 *     more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
export function extractRanges(nums) {
  let arr = [[nums[0]]];
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] - 1 === arr[arr.length - 1][arr[arr.length - 1].length - 1]) {
      arr[arr.length - 1].push(nums[i]);
    } else arr.push([nums[i]]);
  }
  for (let i in arr) {
    if (arr[i].length > 2) arr[i] = arr[i][0] + '-' + arr[i][arr[i].length - 1];
    else arr[i] = arr[i].join(',');
  }
  return arr.join(',');
}
