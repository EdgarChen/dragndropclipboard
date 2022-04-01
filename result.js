function showResultFromDataTransfer(aTextNode, aAction, aDataTransfer) {
  aTextNode.appendData(`action:\n  ${aAction}\n\n`);
  aTextNode.appendData(`type:\n  DataTransfer\n\n`);
  aTextNode.appendData(`dropEffect:\n  ${aDataTransfer.dropEffect}\n\n`);
  aTextNode.appendData(`effectAllowed:\n  ${aDataTransfer.effectAllowed}\n\n`);
  aTextNode.appendData(`files:\n  length = ${aDataTransfer.files.length}\n\n`);

  let types = aDataTransfer.types;
  aTextNode.appendData(`types:\n`);
  for (let i = 0; i < types.length; i++) {
    aTextNode.appendData(`  [${i}] ${types[i]}\n`);
  }

  let items = aDataTransfer.items;
  aTextNode.appendData(`\nitems:\n`);
  for (let i = 0; i < items.length; i++) {
    aTextNode.appendData(`  [${i}] ${items[i].kind} - ${items[i].type}\n`);
  }
}

function loadDataFromDataTransfer(aContainer, aDataTransfer) {
  let items = aDataTransfer.items;
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let data = document.createElement("li");
    data.innerHTML = `item[${i}]:<br>`;

    let pre = document.createElement("pre");
    pre.classList.add('data');
    data.appendChild(pre);

    switch (item.kind) {
      case "string":
        item.getAsString(str => {
          pre.appendChild(document.createTextNode(str));
        });
        break;
      case "file":
        let object = document.createElement("object");
        object.data = URL.createObjectURL(item.getAsFile());
        pre.appendChild(object);
        break;
    }
    aContainer.appendChild(data);
  }
}

function loadData(aData) {
  let container = document.getElementById("data");
  data.innerHTML = "";

  if (aData instanceof DataTransfer) {
    loadDataFromDataTransfer(container, aData);
  } else {
    let data = document.createElement("li");
    data.innerText = "Unknow format";
  }
}

function showResult(aAction, aData) {
  let resultArea = document.getElementById("result");
  let resultPreviousArea = document.getElementById("resultPrevious");

  resultPreviousArea.firstChild.remove();
  resultPreviousArea.appendChild(resultArea.firstChild);

  let result;
  if (aData instanceof DataTransfer) {
    result = document.createTextNode("");
    showResultFromDataTransfer(result, aAction, aData);
  } else {
    result = document.createTextNode("Unknow format");
  }

  resultArea.appendChild(result);
}