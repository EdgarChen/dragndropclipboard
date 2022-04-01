let droparea = document.getElementById("droparea");

// show drag over effect.
droparea.addEventListener('dragenter', evt => {
  droparea.classList.add('dragover');
  evt.preventDefault();
});
droparea.addEventListener('dragover', evt => {
  evt.preventDefault();
});
droparea.addEventListener('dragleave', evt => {
  droparea.classList.remove('dragover');
  evt.preventDefault();
});

// Get DataTransfer from drop event.
droparea.addEventListener('drop', evt => {
  droparea.classList.remove('dragover');
  showResult("drag and drop", evt.dataTransfer);
  loadData(evt.dataTransfer);
  evt.preventDefault();
});

// Get DataTransfer from paste event.
document.addEventListener('paste', evt => {
  showResult("past", evt.clipboardData);
  loadData(evt.clipboardData);
  evt.preventDefault();
});
