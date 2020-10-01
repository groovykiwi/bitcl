// SELECTORS
userInput = document.getElementById('input');
userInput2 = document.getElementById('input2');
output = document.getElementById('output');
colorButton = document.getElementById('color-mode');
bindenButton = document.getElementById('binden');
denbinButton = document.getElementById('denbin');

// EVENT LISTENERS

userInput.addEventListener('keydown', getInput);
userInput2.addEventListener('keydown', getInput);

bindenButton.addEventListener('change', function () {
  userInput.value = '';
  userInput.setAttribute('maxlength', '8');
  userInput.setAttribute('placeholder', 'Mantissa (10010000)');
  userInput.setAttribute('pattern', '[0-1]{8}');
  userInput2.value = '';
  output.innerHTML = '';
  userInput2.style.display = 'inline-block';
  conversionOption = 'binden';
});
denbinButton.addEventListener('change', function () {
  userInput.value = '';
  userInput.setAttribute('maxlength', '12');
  userInput.setAttribute('placeholder', '5.88');
  userInput.setAttribute('pattern', `-?[0-9]+(\.[0-9]+)?`);
  userInput2.value = '';
  output.innerHTML = '';
  userInput2.style.display = 'none';
  conversionOption = 'denbin';
});

colorButton.addEventListener('change', function () {
  if (this.checked) {
    document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
    document.documentElement.style.setProperty('--text-color', 'white');
  } else {
    document.documentElement.style.setProperty('--bg-color', 'white');
    document.documentElement.style.setProperty('--text-color', 'black');
  }
});

// Initialisation
userInput.value = '';
userInput2.value = '';
colorButton.checked = false;
bindenButton.checked = true;

var conversionOption = 'binden';
var denaryValues = [];

// Dark Mode after 6pm
now = new Date();
time = now.getHours();
if (time > 18) {
  document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
  document.documentElement.style.setProperty('--text-color', 'white');
}

// FUNCTIONS
function getInput() {
  if (userInput.checkValidity()) {
    if (event.which === 13) {
      output.innerHTML = '';
      denaryValues = [];

      if (conversionOption == 'binden') {
        binden(userInput.value, userInput2.value);
      } else if (conversionOption == 'denbin') {
        if (userInput.value > 600 || userInput.value < -600) {
          output.innerHTML =
            'Number out of range, make sure it is between -600 and 600';
        } else {
          denbin(userInput.value);
        }
      }
    }
  }
}

function floatDenaryToBinary(x, bits) {
  denaryValue = parseFloat(x);
  denaryValues.push(denaryValue);

  // Define sequence based on bits
  var sequence = [-1];
  var denominator = 2;
  while (sequence.length < bits) {
    sequence.push(1 / denominator);
    denominator = denominator * 2;
  }
  // Check if input is float
  if (isNaN(denaryValue)) {
    return 'The input could not be converted to a float.';
  } else {
    var denaryFraction = new Fraction();
    denaryFraction.convert(denaryValue, true);
    var improperFraction = denaryFraction;
    // Convert to proper fraction
    var noDivision = 0;
    var denominator = denaryFraction.denominator;
    var numerator = denaryFraction.numerator;
    var sign = denaryFraction.sign;
    while (numerator > denominator) {
      denominator = denominator * 2;
      noDivision += 1;
    }

    // Get mantissa fractions
    var mantissaFractions = getSubArrays(
      sequence,
      (numerator * sign) / denominator
    );

    // Rounding to binary
    if (mantissaFractions.length == 0) {
      var decimal = parseFloat((denaryValue + '').split('.')[1]);
      decimal = '.' + decimal;
      decimal = parseFloat(decimal);

      var binaryDecimal = '';
      for (i = 0; i < bits; i++) {
        decimal = decimal * 2;
        if (decimal > 1) {
          binaryDecimal += '1';
        } else {
          binaryDecimal += '0';
        }
        decimal = (decimal + '').split('.')[1];
        decimal = '.' + decimal;
        decimal = parseFloat(decimal);
      }
      if (denaryValue < 0) {
        positiveIntDenaryValue = parseInt(denaryValue) * -1;
      } else {
        positiveIntDenaryValue = parseInt(denaryValue);
      }
      var finalBinaryDecimal =
        denaryToBinary(positiveIntDenaryValue) + binaryDecimal + '';
      for (i = 0; i < finalBinaryDecimal.length; i++) {
        if (finalBinaryDecimal[i] == '1') {
          var firstOne = i;
          break;
        }
        var rounded = true;
      }

      // Convert binary mantissa to denary
      var binaryMantissa = finalBinaryDecimal.substring(
        firstOne - 1,
        firstOne + bits
      );
      exponent = finalBinaryDecimal.length - bits - firstOne;

      var mantissa = 0;
      for (i = 0; i < binaryMantissa.length; i++) {
        if (i == 0 && binaryMantissa[i] == '1') {
          mantissa = -1;
        } else if (binaryMantissa[i] == '1') {
          mantissa = mantissa + 1 / 2 ** i;
        }
      }
      var roundedDenary = mantissa * Math.pow(2, exponent);

      if (denaryValue < 0) {
        roundedDenary = roundedDenary * -1;
      }
      floatDenaryToBinary(roundedDenary, bits);
    } else {
      return 'No more rounding neccessary';
    }

    // Check if the mantissa is positive or negative
    var binaryMantissa = '';
    var currentFraction = mantissaFractions[0][0];
    if (currentFraction == -1) {
      binaryMantissa += '1';
      var beginAt = 1;
    } else {
      binaryMantissa += '0';
      var beginAt = 0;
    }

    // Create binary
    var currentDenominator = 2;
    for (i = 1; i < bits; i++) {
      match = false;
      for (j = beginAt; j < mantissaFractions[0].length; j++) {
        currentFraction = mantissaFractions[0][j];
        if (currentFraction == 1 / currentDenominator) {
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
  }

  // Output Variables
  var outputString = `Rounding steps: ${denaryValues.join(' > ')}<br>
    Proper fraction: ${denaryValue} = <sup>${
    improperFraction.numerator
  }</sup>/<sub>${
    improperFraction.denominator
  }</sub> = <sup>${numerator}</sup>/<sub>${denominator}
    </sub> * 2<sup> ${noDivision}</sup><br>
    Mantissa: ${binaryMantissa}<br>
    Exponent: ${denaryToBinary(noDivision)}<br>`;
  // output.innerHTML = outputString;
  return `Mantissa: ${binaryMantissa}
Exponent: ${denaryToBinary(noDivision)}`;
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

function floatBinaryToDenary(binaryMantissa, binaryExponent) {
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
      steps.push('<sup>1</sup>/<sub>' + number + '</sub>');
    }
  }
  // CALCULATE EXPONENT
  var exponent;
  var negativeNumberBinaryExponent = ''; // If number is in ones' complement

  if (binaryExponent[0] == '1') {
    // Ones' complement check
    exponent = -128;
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

  var answer = mantissa * Math.pow(2, exponent); //

  output.innerHTML = `Mantissa: ${mantissa} = ${steps.join(' + ')}<br>
    Exponent: ${exponent}<br>
    Calculation: ${mantissa} * 2<sup>${exponent}</sup><br>
    Denary Value: ${answer}`;

  // SUB-FUNCTIONS
  function bin2dec(num) {
    return num
      .split('')
      .reverse()
      .reduce(function (x, y, i) {
        return y === '1' ? x + Math.pow(2, i) : x;
      }, 0);
  }
}

// Binary to denary
function binaryToDenary(binary) {
  // Input must be string
  var steps = []; // variables
  var answer = 0;
  binary = reverse(binary);
  for (i = 0; i < binary.length; i++) {
    if (binary[i] == '1') {
      var value = Math.pow(2, i);
      steps.push(value); // Pushing added values to steps array
      answer += value;
    }
  }
  // SUB FUNCTION
  function reverse(s) {
    return s.split('').reverse().join('');
  }
}

// Denary to binary
function denaryToBinary(denary) {
  // Input must be integer
  var steps = [];
  var answer = 0;
  var rem,
    i = 1,
    step = 1;
  while (denary != 0) {
    rem = denary % 2;
    steps.push(`Step ${step++}: ${denary}/2, Remainder = ${rem})}`);
    denary = parseInt(denary / 2);
    answer = answer + rem * i;
    i = i * 10;
  }
  // bin variable is the final result
  return answer, steps;
}

function hexadecimalToDenary(hexadecimal) {
  var value = 0;
  var steps = [];
  const hexadecimalchars = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
  ];
  const hexadecimalcharvalues = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    10,
    11,
    12,
    13,
    14,
    15,
  ];

  hexadecimal = hexadecimal.split('').reverse().join(''); // Reversing string as we read from left to right
  for (i = 0; i < hexadecimal.length; i++) {
    for (x = 0; x < hexadecimalchars.length; x++) {
      if (hexadecimalchars[x] == hexadecimal[i]) {
        var hexadecimalvalue = hexadecimalcharvalues[x];
        var hexadecimalweight = Math.pow(16, i);
        value += hexadecimalweight * hexadecimalvalue;
        steps.push(hexadecimalweight * hexadecimalvalue); // Appending numbers we add to steps
      }
    }
  }
  var total = 0;
  for (i = 0; i < steps.length; i++) {
    total = total + steps[i];
  }
  return total;
}

// SUB
var combinationSum = function (candidates, target) {
  let ans = [];
  if (candidates === null || candidates.length === 0) return ans;

  candidates.sort((a, b) => a - b);

  let current = [];
  findNumbers(candidates, target, 0, current, ans);
  return ans;
};

// Fraction Module
function Fraction() {}
Fraction.prototype.convert = function (x, improper) {
  improper = improper || false;
  var abs = Math.abs(x);
  this.sign = x / abs;
  x = abs;
  var stack = 0;
  this.whole = !improper ? Math.floor(x) : 0;
  var fractional = !improper ? x - this.whole : abs;
  /*recursive function that transforms the fraction*/
  function recurs(x) {
    stack++;
    var intgr = Math.floor(x); //get the integer part of the number
    var dec = x - intgr; //get the decimal part of the number
    if (dec < 0.0019 || stack > 20) return [intgr, 1]; //return the last integer you divided by
    var num = recurs(1 / dec); //call the function again with the inverted decimal part
    return [intgr * num[0] + num[1], num[0]];
  }
  var t = recurs(fractional);
  this.numerator = t[0];
  this.denominator = t[1];
};

Fraction.prototype.toString = function () {
  var l = this.sign.toString().length;
  var sign = l === 2 ? '-' : '';
  var whole = this.whole !== 0 ? this.sign * this.whole + ' ' : sign;
  return whole + this.numerator + '/' + this.denominator;
};

function denaryToHexadecimal(denary) {
  var steps = [];
  var answer = '';
  const hexadecimalchars = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];
  const hexadecimalcharvalues = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
  ];
  var stop = false;
  if (denary < 16) {
    for (i = 0; i < hexadecimalcharvalues.length; i++) {
      if (hexadecimalcharvalues[i] == denary) {
        answer += hexadecimalchars[i];
        steps.push('Decimal ' + denary.toString() + ' = ' + answer.toString());
        stop = true;
      }
    }
  }

  while (stop == false) {
    integer = Math.floor(denary / 16);
    afterdot = denary % 16;
    if (integer < 16) {
      if (afterdot == 0) {
        answer += 0;
        steps.push(
          denary.toString() +
            ' % 16 = ' +
            afterdot.toString() +
            ', integer ' +
            afterdot.toString() +
            ' = ' +
            'hexadecimal ' +
            hexadecimalchars[i].toString()
        );
      } else {
        for (i = 0; i < hexadecimalcharvalues.length; i++) {
          if (hexadecimalcharvalues[i] == afterdot) {
            answer += hexadecimalchars[i];
            steps.push(
              denary.toString() +
                ' % 16 = ' +
                afterdot.toString() +
                ', integer ' +
                afterdot.toString() +
                ' = ' +
                'hexadecimal ' +
                hexadecimalchars[i].toString()
            );
          }
        }
      }
      for (i = 0; i < hexadecimalcharvalues.length; i++) {
        if (hexadecimalcharvalues[i] == integer) {
          answer += hexadecimalchars[i];
          steps.push(
            denary.toString() +
              ' / 16 = ' +
              integer.toString() +
              ', integer ' +
              integer.toString() +
              ' = ' +
              'hexadecimal ' +
              hexadecimalchars[i].toString()
          );
        }
      }
      stop = true;
    } else {
      for (i = 0; i < hexadecimalcharvalues.length; i++) {
        if (hexadecimalcharvalues[i] == afterdot) {
          answer += hexadecimalchars[i];
          steps.push(
            denary.toString() +
              ' % 16 = ' +
              afterdot.toString() +
              ', integer ' +
              afterdot.toString() +
              ' = ' +
              'hexadecimal ' +
              hexadecimalchars[i].toString()
          );
        }
      }
      denary = integer;
    }
  }
  answer = answer.split('').reverse().join('');
  return answer;
  return steps;
}
