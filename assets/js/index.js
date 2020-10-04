// Selectors
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
