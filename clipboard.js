let clipboardread = document.getElementById("clipboardread");

clipboardread.addEventListener('click', async evt => {
  navigator.clipboard.read().then(items => {
    showResult("async clipboard read", items);
  }, (e) => {
    showException(e);
  });
  clearData();
});