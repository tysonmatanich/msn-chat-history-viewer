function showChat(fragment) {
  document.getElementById("from").removeEventListener("change", fromNameChangeHandler);
  document.getElementById("to").removeEventListener("change", toNameChangeHandler);

  // Clear existing output
  const outputNode = document.getElementById("output");
  outputNode.innerHTML = "";






  const batchLoading = true; //TODO: For low perf devices, only insert a portion of the children and expose the rest on scroll
  if (!batchLoading) {
    processElements(fragment);


    if (false) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          window.setTimeout(() => {
            alert(`Time to append and display: ${roundNumber(entry.duration / 1000, 3)}s`);
          }, 1000)
        });
      });
      observer.observe({ entryTypes: ["measure"] });
      const mutationObserver = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length > 0) {
                performance.mark("end");
                performance.measure("appendChildToDisplay", "start", "end");
                observer.disconnect();
            }
        }
      });
      mutationObserver.observe(outputNode, { childList: true });
      performance.mark("start");
    }

    // const tempDiv = document.createElement("div");
    // tempDiv.appendChild(fragment);
    // outputNode.innerHTML = tempDiv.innerHTML;

    requestAnimationFrame(() => {


      //outputNode.innerHTML = fragment.documentElement.innerHTML; // As fragment
      //NOTE: fragment: 86s, document: 52s
      //outputNode.innerHTML = fragment.firstChild.innerHTML; // As document



      //NOTE: fragment: 82s, document: 41s
      // outputNode.append(fragment.firstChild.firstChild);
      // outputNode.append(fragment.firstChild.firstChild.nextSibling);

      // outputNode.append(fragment.firstChild.firstChild);
      // outputNode.append(fragment.firstChild.firstChild);


      //outputNode.append(fragment);


      if (false) {
        // Append subject
        outputNode.append(fragment.firstChild);

        // Copy messages into a new fragment
        const tempFragment = document.createDocumentFragment();
        let msnLog = fragment.firstChild.firstChild;
        tempFragment.replaceChildren(...msnLog.childNodes);

        // Append history with blank msn log
        outputNode.append(fragment.firstChild);


        // Move elements's contents into shadow dom
        for (const element of tempFragment.children) {
          const existingChildren = Array.from(element.children);
          const shadow = element.attachShadow({ mode: "open" });
          // Move existing children to shadow DOM
          existingChildren.forEach((child) => {
            shadow.appendChild(child);
          });
        }

        //TODO: for some reason its not visible on ios or isnt inserted?
        for (const element of tempFragment.children) {
          msnLog.append(element);
        }
      } else {
        // Append subject
        outputNode.append(fragment.firstChild);

        // Copy messages into a new fragment
        const tempFragment = document.createDocumentFragment();
        let msnLog = fragment.firstChild.firstChild;
        tempFragment.replaceChildren(...msnLog.childNodes);

        // Append history with blank msn log
        outputNode.append(fragment.firstChild);

        for (const element of tempFragment.children) {
          msnLog.append(element);
        }
        alert("done");
      }

    });



  }
  else {
    processElements(fragment);
    const msnLogElement = fragment.firstChild.nextSibling.firstChild;

    // Put all the messages in a fragment
    let tempFragment = new DocumentFragment();
    tempFragment.append(...msnLogElement.childNodes);

    // Insert the subject and history containers
    outputNode.appendChild(fragment.firstChild);
    outputNode.appendChild(fragment.firstChild);

    const batchTimeDelay = 30;
    const batchSize = 100;

    alert(`${tempFragment.childNodes.length} messages. ${(roundNumber((tempFragment.childNodes.length / batchSize) * batchTimeDelay) / 60000, 1)} minutes to load.`);

    const insertMessageBatch = function() {
      // Reinsert the first batch of messages
      let i = 0;
      while (tempFragment.childNodes.length > 0 && i < batchSize) {
        const child = tempFragment.childNodes[0];
        msnLogElement.appendChild(child);
        i++;
      }
      if (tempFragment.childNodes.length < 1) {
        //clearInterval(intervalId);
        alert("All messages loaded");
      }
      else {
        window.setTimeout(insertMessageBatch, batchTimeDelay)
      }
    };
    insertMessageBatch();
  }

  document.body.classList.add("showChat");
  document.getElementById("from").addEventListener("change", fromNameChangeHandler);
  document.getElementById("to").addEventListener("change", toNameChangeHandler);
}
