'use strict';

(() => {
  const updateContentScript = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { update: true });
    });
  };
  
  const setPatternFromInput = (pattern) => {
    if (pattern) {
      try {
        const regex = new RegExp(pattern, 'g');
        const stringified = regex.toString().slice(1, -2);
        
        chrome.storage.sync.set({ 
          pattern: stringified,
        }, () => {
          updateContentScript();
          console.log('[INFO] Setting New Pattern:', stringified);
        });
      } catch (e) {
        console.error('[ERROR] Malformed Pattern:', pattern);
      }
    }
  };
  
  window.onload = () => {
    const inputEl = document.getElementById('pattern');
    const resetEl = document.getElementById('reset-btn');
    const formEl = document.getElementById('pattern-form');
  
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const { value: pattern } = e.target.pattern; 
      setPatternFromInput(pattern);
    });
  
    resetEl.addEventListener('click', () => {
      chrome.storage.sync.get('defaultPattern', ({ defaultPattern: pattern }) => {
        inputEl.value = pattern;
        
        chrome.storage.sync.set({ pattern }, () => {
          console.log('RESETTING PATTERN:', pattern);
          updateContentScript();
        });
      });
    });
    
    chrome.storage.sync.get('pattern', ({ pattern }) => {
      inputEl.value = pattern;
    });
  }
})();
