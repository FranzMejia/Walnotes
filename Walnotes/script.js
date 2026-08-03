const scrollTopButton = document.getElementById('btnScrollTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 250) {
    scrollTopButton.classList.add('visible');
  } else {
    scrollTopButton.classList.remove('visible');
  }
});

function copyLog(buttonElement) {
  const row = buttonElement.closest('tr');
  if (!row) return;

  const logTextEl = row.querySelector('.log-text');
  if (!logTextEl) return;
  const textToCopy = logTextEl.innerText;
  const statusMsg = row.querySelector('.status-msg');
  const textArea = document.getElementById('hidden-copy-area');
  textArea.value = textToCopy;
  textArea.select();
  textArea.setSelectionRange(0, 99999);

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showSuccess(statusMsg);
      return;
    }
  } catch (err) {
    console.warn('Backup buffer copy method blocked.');
  }

  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy)
      .then(() => showSuccess(statusMsg))
      .catch(() => handleManualFallback(textToCopy));
  } else {
    handleManualFallback(textToCopy);
  }
}

function handleManualFallback(text) {
  alert('Browser security is blocking auto-copy.\n\nPlease select and copy this text manually:\n\n' + text);
}

function showSuccess(element) {
  if (!element) return;
  element.style.display = 'inline';
  setTimeout(() => {
    element.style.display = 'none';
  }, 2000);
}
