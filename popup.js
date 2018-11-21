const setPatternFromInput = (pattern) => {
  if (pattern) {
    try {
      const regex = new RegExp(pattern, 'g');
      const stringified = regex.toString().slice(1, -2);
      
      chrome.storage.sync.set({ 
        pattern: stringified,
      }, () => {
        console.log('STORING PATTERN:', stringified);
      });
    } catch (e) {
      console.error('Malformed Pattern:', pattern);
    }
  }
};

window.onload = () => {
  const inputEl = document.getElementById('pattern');
  const resetEl = document.getElementById('reset-btn');
  const formEl = document.getElementById('pattern-form');

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const pattern = e.target.pattern.value;
    setPatternFromInput(pattern);
  });

  resetEl.addEventListener('click', () => {
    chrome.storage.sync.get('defaultPattern', ({ defaultPattern }) => {
      inputEl.value = defaultPattern;
      
      chrome.storage.sync.set({ 
        pattern: defaultPattern,
      }, () => {
        console.log('STORING PATTERN:', defaultPattern);
      });
    });
  })
  
  chrome.storage.sync.get('pattern', ({ pattern }) => {
    inputEl.value = pattern;
  });
}

