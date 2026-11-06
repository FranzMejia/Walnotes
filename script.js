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

/* Knowledge base: search, popular chips, active sidebar link */
(function () {
  const input = document.getElementById('kb-search-input');
  const status = document.getElementById('kb-search-status');
  const noResults = document.getElementById('kb-no-results');
  const panels = Array.from(document.querySelectorAll('.dashboard-panel'));
  const links = Array.from(document.querySelectorAll('.kb-sidenav a'));
  if (!input) return;

  function runSearch() {
    const q = input.value.trim().toLowerCase();
    let total = 0;
    panels.forEach((panel) => {
      let shown = 0;
      panel.querySelectorAll('tbody tr').forEach((row) => {
        const match = !q || row.textContent.toLowerCase().includes(q);
        row.classList.toggle('is-hidden', !match);
        if (match) shown++;
      });
      const headMatch = q && panel.querySelector('.kb-article-head').textContent.toLowerCase().includes(q);
      if (headMatch && shown === 0) {
        panel.querySelectorAll('tbody tr').forEach((r) => r.classList.remove('is-hidden'));
        shown = panel.querySelectorAll('tbody tr').length;
      }
      panel.classList.toggle('is-hidden', shown === 0);
      const link = document.querySelector('.kb-sidenav a[data-target="' + panel.id + '"]');
      if (link) link.parentElement.classList.toggle('is-empty', shown === 0);
      total += shown;
    });
    noResults.hidden = total !== 0;
    status.textContent = q ? total + (total === 1 ? ' log matches' : ' logs match') + ' "' + input.value.trim() + '"' : '';
  }

  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('articles').scrollIntoView();
    if (e.key === 'Escape') { input.value = ''; runSearch(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) { e.preventDefault(); input.focus(); }
  });
  document.querySelectorAll('.kb-chip').forEach((chip) => {
    chip.addEventListener('click', () => { input.value = chip.dataset.query; runSearch(); document.getElementById('articles').scrollIntoView(); });
  });
  const clear = document.getElementById('kb-clear-search');
  if (clear) clear.addEventListener('click', () => { input.value = ''; runSearch(); input.focus(); });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.dataset.target === en.target.id));
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    panels.forEach((p) => obs.observe(p));
  }
})();
