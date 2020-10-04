// Selectors
select = document.getElementById('select');
inputArea1 = document.getElementById('input-area-1');
inputArea2 = document.getElementById('input-area-2');
labelArea1 = document.getElementById('label-area-1');
labelArea2 = document.getElementById('label-area-2');
outputArea = document.getElementById('output-area');
submitButton = document.getElementById('submit');
nightButton = document.getElementById('night-button');

// Initializers
var nightMode = localStorage.getItem('nightMode');

if (nightMode === null) {
  var nightMode = false;
  localStorage.setItem('nightMode', nightMode);
}

if (nightMode === 'true') {
  nightButton.checked = true;
  document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
  document.documentElement.style.setProperty('--text-color', 'white');
} else {
  document.documentElement.style.setProperty('--bg-color', 'white');
  document.documentElement.style.setProperty('--text-color', '#1a1a1a');
  nightButton.checked = false;
}

// Event listeners
inputArea1.addEventListener('keydown', getInput);
inputArea2.addEventListener('keydown', getInput);
submitButton.addEventListener('click', getInput);
select.addEventListener('change', updateInfo);
nightButton.addEventListener('change', function () {
  if (this.checked) {
    document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
    document.documentElement.style.setProperty('--text-color', 'white');
    nightMode = true;
    localStorage.setItem('nightMode', nightMode);
  } else {
    document.documentElement.style.setProperty('--bg-color', 'white');
    document.documentElement.style.setProperty('--text-color', '#1a1a1a');
    nightMode = false;
    localStorage.setItem('nightMode', nightMode);
  }
});

// Functions
function getInput() {
  if (event.which === 13 || event.which === 1) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.activeElement.blur();
    }
    switch (select.value) {
      case 'floatBinaryToDenary':
        outputArea.value = floatBinaryToDenary(
          inputArea1.value,
          inputArea2.value
        );
        break;

      case 'floatDenaryToBinary':
        rounded = 0;
        outputArea.value = floatDenaryToBinary(
          inputArea1.value,
          inputArea2.value
        );
        break;
    }
    event.preventDefault();
  }
}

function updateInfo() {
  console.log('updated');
  if (select.value == 'floatBinaryToDenary') {
    labelArea1.innerHTML = 'MANTISSA';
    labelArea2.innerHTML = 'EXPONENT';
    inputArea1.setAttribute('placeholder', '10010001');
    inputArea2.setAttribute('placeholder', '111011');
    inputArea2.setAttribute('title', '');
    inputArea1.value = '';
    inputArea2.value = '';
  } else if (select.value == 'floatDenaryToBinary') {
    labelArea1.innerHTML = 'DENARY FLOAT';
    labelArea2.innerHTML = 'NUMBER OF BITS';
    inputArea1.setAttribute('placeholder', '5.88');
    inputArea2.setAttribute('placeholder', '8');
    inputArea2.setAttribute(
      'title',
      'The bigger the number of bits the longer it will take to process it, it is recommended to have maximum 22 bits'
    );
    inputArea1.value = '';
    inputArea2.value = '';
  }
}

function floatBinaryToDenary(binaryMantissa, binaryExponent) {
  var format = /^[0-1]+$/;
  if (!format.test(binaryMantissa)) {
    return ['The mantissa input could not be converted', []].join('');
  } else if (!format.test(binaryExponent)) {
    return ['The exponent input could not be converted', []].join('');
  }

  var steps = [];
  // CALCULATE MANTISSA
  var mantissa = 0;

  // Convert mantissa to decimal value
  var i;
  for (i = 0; i < binaryMantissa.length; i++) {
    if (i == 0 && binaryMantissa[i] == '1') {
      // Ones' complement check
      mantissa = -1;
      steps.push('-1');
    } else if (binaryMantissa[i] == '1') {
      mantissa = mantissa + 1 / Math.pow(2, i);
      var number = Math.pow(2, i);
      steps.push('1/' + number);
    }
  }
  // CALCULATE EXPONENT
  var exponent;
  var negativeNumberBinaryExponent = ''; // If number is in two's complement

  if (binaryExponent[0] == '1') {
    // Two's complement check
    exponent = Math.pow(2, binaryExponent.length - 1) * -1;
    for (i = 0; i < binaryExponent.length; i++) {
      // Getting rid of first binary digit
      if (i !== 0) {
        negativeNumberBinaryExponent =
          negativeNumberBinaryExponent + binaryExponent[i];
      } else {
      }
    }
    exponent = exponent + bin2dec(negativeNumberBinaryExponent);
  } else {
    exponent = bin2dec(binaryExponent);
  }

  var answer = mantissa * Math.pow(2, exponent);

  return `Mantissa: ${mantissa} = ${steps.join(' + ')}
Exponent: ${exponent}
Calculation: ${mantissa} * 2^(${exponent})
Denary Value: ${answer}`;

  // Functions
  function bin2dec(num) {
    return num
      .split('')
      .reverse()
      .reduce(function (x, y, i) {
        return y === '1' ? x + Math.pow(2, i) : x;
      }, 0);
  }
}

function floatDenaryToBinary(denaryFloat, bits) {
  var format = /^-?[0-9]+\.?[0-9]+$/;
  if (!format.test(denaryFloat)) {
    return ['The input could not be converted', []].join('');
  }

  var bitFormat = /^[0-9]*[02468]$/;
  if (!bitFormat.test(bits)) {
    return ['The number of bits must be even and positive', []].join('');
  }

  // Define sequence based on bits
  var sequence = [-1];
  var denominator = 2;
  while (sequence.length < bits) {
    sequence.push(1 / denominator);
    denominator = denominator * 2;
  }

  if (denaryFloat < 0) {
    var sign = 'negative';
    denaryFloat = denaryFloat * -1;
  } else {
    var sign = 'positive';
  }

  var binaryInteger = denaryToBinary(parseInt(denaryFloat))[0];
  var binaryDecimal = (denaryFloat + '').split('.')[1];
  binaryDecimal = '.' + binaryDecimal;
  decimal = parseFloat(binaryDecimal);

  decimalFractions = getSubArrays(sequence, binaryDecimal)[0];

  if (decimalFractions === undefined) {
    // var n = Math.pow(2, bits - 1);
    var n = Math.pow(2, bits / 2);
    lower_bound = (1.0 / n) * Math.floor(n * denaryFloat);
    rounded = lower_bound;
    floatDenaryToBinary(lower_bound, bits);
  }
  var currentDenominator = 2;
  var binaryMantissa = '';
  for (i = 1; i < bits; i++) {
    match = false;
    for (j = 0; j < decimalFractions.length; j++) {
      if (decimalFractions[j] == 1 / currentDenominator) {
        match = true;
      }
    }
    if (match == true) {
      binaryMantissa += '1';
    } else {
      binaryMantissa += '0';
    }
    currentDenominator = currentDenominator * 2;
  }

  if (sign == 'positive') {
    binaryInteger = binaryInteger + '';
    if (binaryInteger[0] == '1') {
      binaryInteger = '0' + binaryInteger;
    }

    var combinedBinary = binaryInteger + binaryMantissa;

    var pointIndex = binaryInteger.length;
    var newCombinedBinary = '';
    var index = 0;
    var found = false;
    for (i = 0; i < combinedBinary.length - 1; i++) {
      index++;
      newCombinedBinary += combinedBinary[i];
      if (
        combinedBinary[i] == '0' &&
        combinedBinary[i + 1] == '1' &&
        found == false
      ) {
        newCombinedBinary += '.';
        found = true;
        var finalIndex = index;
      }
    }
    var exponent = pointIndex - finalIndex;
    if (exponent > 0) {
      exponent = denaryToBinary(exponent)[0];
    } else {
      exponent = exponent * -1;
      exponent = binaryToTwosComplement(denaryToBinary(exponent)[0] + '', bits);
    }

    while ((exponent + '').length < bits) {
      exponent = '0' + exponent;
    }

    var finalMantissa = '0' + newCombinedBinary.split('.')[1];
    while (finalMantissa.length < bits) {
      finalMantissa += '0';
    }
    while (finalMantissa.length > bits) {
      finalMantissa = finalMantissa.slice(0, -1);
    }
  } else {
    binaryInteger = binaryInteger + '';
    if (binaryInteger[0] == '1') {
      binaryInteger = '0' + binaryInteger;
    }

    var combinedBinary = binaryInteger + binaryMantissa;
    combinedBinary = binaryToTwosComplement(combinedBinary, bits);

    var pointIndex = binaryInteger.length;
    var newCombinedBinary = '';
    var index = 0;
    var found = false;
    for (i = 0; i < combinedBinary.length - 1; i++) {
      index++;
      newCombinedBinary += combinedBinary[i];
      if (
        combinedBinary[i] == '1' &&
        combinedBinary[i + 1] == '0' &&
        found == false
      ) {
        newCombinedBinary += '.';
        found = true;
        var finalIndex = index;
      }
    }
    var exponent = pointIndex - finalIndex;
    if (exponent > 0) {
      exponent = denaryToBinary(exponent)[0];
    } else {
      exponent = exponent * -1;
      exponent = binaryToTwosComplement(denaryToBinary(exponent)[0] + '', bits);
    }

    while ((exponent + '').length < bits) {
      exponent = '0' + exponent;
    }

    var finalMantissa =
      newCombinedBinary.split('.')[0] + newCombinedBinary.split('.')[1];
    while (finalMantissa.length < bits) {
      finalMantissa += '0';
    }

    while (finalMantissa.length > bits) {
      finalMantissa = finalMantissa.slice(0, -1);
    }
  }
  if (rounded == 0) {
    return `Mantissa: ${finalMantissa}
Exponent: ${exponent}`;
  } else {
    return `Mantissa: ${finalMantissa}
Exponent: ${exponent}

Your number was rounded to ${rounded} to fit in ${bits}-bits`;
  }
  // SUB-FUNCTIONS
  function getSubArrays(arr, n) {
    var len = arr.length,
      subs = Array(Math.pow(2, len)).fill();
    return subs
      .map((_, i) => {
        var j = -1,
          k = i,
          res = [];
        while (++j < len) {
          k & 1 && res.push(arr[j]);
          k = k >> 1;
        }
        return res;
      })
      .slice(1)
      .filter((a) => a.reduce((p, c) => p + c) == n);
  }
}

// Sub-Functions
function binaryToTwosComplement(binary, bits) {
  while (binary.length < bits) {
    binary = '0' + binary;
  }
  var inverseBinary = '';
  for (i = 0; i < binary.length; i++) {
    if (binary[i] == '0') {
      inverseBinary += '1';
    } else {
      inverseBinary += '0';
    }
  }
  return addBinary(inverseBinary, '1');

  // Sub-functions

  // logic gates
  function xor(a, b) {
    return a === b ? 0 : 1;
  }

  function and(a, b) {
    return a == 1 && b == 1 ? 1 : 0;
  }

  function or(a, b) {
    return a || b;
  }

  function halfAdder(a, b) {
    const sum = xor(a, b);
    const carry = and(a, b);
    return [sum, carry];
  }

  function fullAdder(a, b, carry) {
    halfAdd = halfAdder(a, b);
    const sum = xor(carry, halfAdd[0]);
    carry = and(carry, halfAdd[0]);
    carry = or(carry, halfAdd[1]);
    return [sum, carry];
  }

  function padZeroes(a, b) {
    const lengthDifference = a.length - b.length;
    switch (lengthDifference) {
      case 0:
        break;
      default:
        const zeroes = Array.from(Array(Math.abs(lengthDifference)), () =>
          String(0)
        );
        if (lengthDifference > 0) {
          // if a is longer than b
          // then we pad b with zeroes
          b = `${zeroes.join('')}${b}`;
        } else {
          // if b is longer than a
          // then we pad a with zeroes
          a = `${zeroes.join('')}${a}`;
        }
    }
    return [a, b];
  }

  function addBinary(a, b) {
    let sum = '';
    let carry = '';

    const paddedInput = padZeroes(a, b);
    a = paddedInput[0];
    b = paddedInput[1];

    for (let i = a.length - 1; i >= 0; i--) {
      if (i == a.length - 1) {
        // half add the first pair
        const halfAdd1 = halfAdder(a[i], b[i]);
        sum = halfAdd1[0] + sum;
        carry = halfAdd1[1];
      } else {
        // full add the rest
        const fullAdd = fullAdder(a[i], b[i], carry);
        sum = fullAdd[0] + sum;
        carry = fullAdd[1];
      }
    }
    return carry ? carry + sum : sum;
  }
}

function denaryToBinary(denary) {
  var format = /^[0-9]+$/;
  if (!format.test(denary)) {
    return ['The input could not be converted', []].join('');
  }
  var steps = [];
  var answer = 0;
  var rem,
    i = 1;
  while (denary != 0) {
    rem = denary % 2;
    steps.push(`${denary}/2 = ${rem}`);
    denary = parseInt(denary / 2);
    answer = answer + rem * i;
    i = i * 10;
  }
  var output = [answer, steps];
  return output;
}
