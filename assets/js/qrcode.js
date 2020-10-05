// Selectors
select = document.getElementById('select');
inputArea = document.getElementById('input-area');
outputArea = document.getElementById('output-area');
submitButton = document.getElementById('submit');
nightButton = document.getElementById('night-button');
qrcode = document.getElementById('qrcode');
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
      case 'textToQrcode':
        console.log(encodeURIComponent(inputArea.value));
        qrcode.setAttribute(
          'src',
          'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
            encodeURIComponent(inputArea.value)
        );
        qrcode.setAttribute('title', `${inputArea.value}`);
        outputArea.setAttribute('hidden', true);
        break;
    }
    event.preventDefault();
  }
}
