/**
 * Show result
 */

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

function showResultFromClipboardItems(aContainer, aAction, aClipboardItems) {
  let prefix = document.createTextNode(`action:\n  ${aAction}\n\n`);
  prefix.appendData(`type:\n  ClipboardItems\n\n`);
  prefix.appendData(`items:\n  length = ${aClipboardItems.length}\n`);
  aContainer.appendChild(prefix);

  for (let i = 0; i < aClipboardItems.length; i++) {
    let item = aClipboardItems[i];
    let itemContainer = document.createElement("pre");
    let text = document.createTextNode(`item ${i}:\n`);
    text.appendData(`  ${item.presentationStyle}\n`);
    itemContainer.appendChild(text);

    let types = item.types;
    for (let j = 0; j < types.length; j++) {
      let typeContainer = document.createElement("div");
      typeContainer.innerHTML = `  [${j}] ${types[j]} `;
      itemContainer.appendChild(typeContainer);
    }

    if (types.length > 0) {
      let preBtn = document.createTextNode("  ");
      itemContainer.appendChild(preBtn);

      let btn = document.createElement("button");
      btn.innerText = `get data`;
      btn.addEventListener('click', evt => {
        loadDataFromClipboardItem(aClipboardItems, i);
      });
      itemContainer.appendChild(btn);
    }

    aContainer.appendChild(itemContainer);
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
  } else if (Array.isArray(aData)) {
    result = document.createElement("pre");
    showResultFromClipboardItems(result, aAction, aData);
  } else {
    result = document.createTextNode("Unknow format");
  }

  resultArea.appendChild(result);
}

function showException(aException) {
  let resultArea = document.getElementById("result");
  let resultPreviousArea = document.getElementById("resultPrevious");

  resultPreviousArea.firstChild.remove();
  resultPreviousArea.appendChild(resultArea.firstChild);

  resultArea.appendChild(document.createTextNode(aException));
}

/**
 * Load data
 */

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
        let file = item.getAsFile();
        let div = document.createElement("div");

        div.innerHTML += `type: ${file.type}<br>`
        div.innerHTML += `size: ${file.size}<br><br>`;
        pre.appendChild(div);

        if (file.type == "image/svg+xml") {
          file.text().then((text) => {
            pre.appendChild(document.createTextNode(text));
          });
          break;
        }

        let object = document.createElement("object");
        object.data = URL.createObjectURL(item.getAsFile());
        pre.appendChild(object);
        break;
    }
    aContainer.appendChild(data);
  }
}

function loadDataFromClipboardItem(aClipboardItems, aIndex) {
  let container = document.getElementById("data");
  container.innerHTML = `<pre>item ${aIndex}</pre>`;

  let item = aClipboardItems[aIndex];
  let types = item.types;
  for (let i = 0; i < types.length; i++) {
    let type = types[i];
    let data = document.createElement("li");
    data.innerHTML = `${type}:<br>`;

    let pre = document.createElement("pre");
    pre.classList.add('data');
    data.appendChild(pre);

    item.getType(type).then(blob => {
      div = document.createElement("div");
      div.innerHTML = `size: ${blob.size}<br><br>`;
      pre.appendChild(div);

      if (type == 'text/html' || type == 'text/plain' || type == "image/svg+xml") {
        blob.text().then((text) => {
          div = document.createElement("div");
          div.innerText = `${text}`;
          pre.appendChild(div);
        });
      } else {
        let object = document.createElement("object");
        object.data = URL.createObjectURL(blob);
        pre.appendChild(object);
      }
    }, e => {
      let div = document.createElement("div");
      div.innerHTML = `promise rejected: ${e}`;
      pre.appendChild(div);
    });

    container.appendChild(data);
  }
}

function loadData(aData) {
  let container = document.getElementById("data");
  container.innerHTML = "";

  if (aData instanceof DataTransfer) {
    loadDataFromDataTransfer(container, aData);
  } else {
    let data = document.createElement("li");
    data.innerText = "Unknow format";
  }
}

function clearData() {
  let container = document.getElementById("data");
  container.innerHTML = "No Data";
}
