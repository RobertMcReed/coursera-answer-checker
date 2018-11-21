const defaultPattern = (new RegExp('[a-zA-Z]\\d*|[\\s =:!%_\/]')).toString().slice(1, -1);

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    pattern: defaultPattern,
    defaultPattern,
  }, () => {
    console.log('Pattern Set:', defaultPattern);
  });

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {
          hostEquals: 'hub.coursera-notebooks.org'
        },
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
