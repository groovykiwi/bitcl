// Selectors
select = document.getElementById('select');
inputArea = document.getElementById('input-area');
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
inputArea.addEventListener('keydown', getInput);
submitButton.addEventListener('click', getInput);
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
      case 'binaryToDenary':
        outputArea.value =
          binaryToDenary(inputArea.value)[0] +
          ' = ' +
          binaryToDenary(inputArea.value)[1].join(' + ');
        break;
      case 'binaryToHex':
        outputArea.value = binaryToHexadecimal(inputArea.value);
        break;
      case 'denaryToBinary':
        outputArea.value =
          denaryToBinary(inputArea.value)[0] +
          '\n_\n' +
          denaryToBinary(inputArea.value)[1].join('\n');
        break;
      case 'denaryToHex':
        outputArea.value =
          denaryToHexadecimal(inputArea.value)[0] +
          '\n_\n' +
          denaryToHexadecimal(inputArea.value)[1].join('\n');
        break;
      case 'hexToBinary':
        outputArea.value = hexadecimalToBinary(inputArea.value);
        break;
      case 'hexToDenary':
        outputArea.value = hexadecimalToDenary(inputArea.value);
        break;
    }
    event.preventDefault();
  }
}

function binaryToDenary(binary) {
  var format = /^[0-1]+$/;
  if (!format.test(binary)) {
    return ['The input could not be converted', []];
  }
  // Input must be string
  var steps = [];
  var answer = 0;
  binary = binary.split('').reverse().join('');
  for (i = 0; i < binary.length; i++) {
    if (binary[i] == '1') {
      var value = Math.pow(2, i);
      steps.push(value); // Push added values to steps array
      answer += value;
    }
  }
  var output = [answer, steps];
  return output;
}

function binaryToHexadecimal(binary) {
  var format = /^[0-1]+$/;
  if (!format.test(binary)) {
    return ['The input could not be converted', []];
  }
  return denaryToHexadecimal(binaryToDenary(binary)[0].toString())[0];
}

function denaryToBinary(denary) {
  var format = /^-?[0-9]+$/;
  if (!format.test(denary)) {
    return ['The input could not be converted', []];
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

function denaryToHexadecimal(denary) {
  // denary must be a string
  var format = /^[0-9]+$/;
  if (!format.test(denary)) {
    return ['The input could not be converted', []];
  }
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
        steps.push('denary ' + denary.toString() + ' = ' + answer.toString());
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
            ', denary ' +
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
                ', denary ' +
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
              ', denary ' +
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
              ', denary ' +
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
  var output = [answer, steps];
  return output;
}

function hexadecimalToBinary(hexadecimal) {
  var format = /^[a-f-A-F-0-9]+$/;
  if (!format.test(hexadecimal)) {
    return ['The input could not be converted', []];
  }
  return denaryToBinary(hexadecimalToDenary(hexadecimal).toString())[0];
}

function hexadecimalToDenary(hexadecimal) {
  var format = /^[a-f-A-F-0-9]+$/;
  if (!format.test(hexadecimal)) {
    return ['The input could not be converted', []];
  }
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
  var answer = 0;
  for (i = 0; i < steps.length; i++) {
    answer = answer + steps[i];
  }
  return answer;
}
