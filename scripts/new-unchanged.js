function filePreventOpen(e) {
  // Prevent default behavior (prevent file from being opened)
  e.preventDefault();
}

function fileDropHandler(e) {
  filePreventOpen(e);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        readFile(item.getAsFile());
      }
    });
  }
}

function fileChangeHandler(e) {
  readFile(this.files[0]);
}

function readFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      // Get file contents as string
      const xmlStr = event.target.result;

      // Parse as XML
      const domParser = new DOMParser();
      const xmlDoc = domParser.parseFromString(xmlStr, "application/xml");

      const errorNode = xmlDoc.querySelector("parsererror");
      if (errorNode) {
        console.log("Error parsing document :(", errorNode);
      } else {
        transformXml(xmlDoc, domParser);
      }
    };
    fileReader.readAsText(file);
}

function testXSLPerformance(xmlString, xslString1, xslString2) {
  // Parse XML and XSL strings into DOM objects
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "application/xml");
  const xslDoc1 = parser.parseFromString(xslString1, "application/xml");
  const xslDoc2 = parser.parseFromString(xslString2, "application/xml");

  // Function to transform XML using XSL
  function transformXML(xml, xsl) {
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(xsl);
    const resultDocument = xsltProcessor.transformToDocument(xml);
    return new XMLSerializer().serializeToString(resultDocument);
  }

  // Measure performance for the first XSL
  const start1 = performance.now();
  transformXML(xmlDoc, xslDoc1);
  const end1 = performance.now();
  const time1 = end1 - start1;

  // Measure performance for the second XSL
  const start2 = performance.now();
  transformXML(xmlDoc, xslDoc2);
  const end2 = performance.now();
  const time2 = end2 - start2;


 // Log the results
//  console.log(`Time taken for XSL 1: ${time1} ms`);
//  console.log(`Time taken for XSL 2: ${time2} ms`);

  // Return the results
  return {
    xsl1Time: time1,
    xsl2Time: time2,
  };
}

async function transformXml(xmlDoc, domParser) {
  const comparePerfOfTwoFiles = false; //TODO: Remove
  if (!comparePerfOfTwoFiles) {
    // Load XSL file
    const xslResponse = await fetch("../xslt/to-html.xslt");
    const xslString = await xslResponse.text();
    const xsltProcessor = new XSLTProcessor();
    xsltProcessor.importStylesheet(domParser.parseFromString(xslString, "application/xml"));

    // Run transform
    startTimer("transform XML");
    const fragment = xsltProcessor.transformToFragment(xmlDoc, document);
    stopTimer("transform XML");

    showChat(fragment);
  } else {
    const xslResponse = await fetch("../transform0.2.xsl");
    const xslString = await xslResponse.text();

    const xslResponse2 = await fetch("../transform0.3.xsl");
    const xslString2 = await xslResponse2.text();

    // Example usage
    let runTimes = 3000;
    let result = null;
    let time1 = 0;
    let time2 = 0;
    // let times1 = [];
    // let times2 = [];
    for (let i = 0; i < runTimes; i++) {
      result = testXSLPerformance(xmlDoc, xslString, xslString2);
      time1 += result.xsl1Time;
      time2 += result.xsl2Time;
      // times1.push(result.xsl1Time);
      // times2.push(result.xsl2Time);

      result = testXSLPerformance(xmlDoc, xslString2, xslString);
      time1 += result.xsl2Time;
      time2 += result.xsl1Time;
    }
    console.log(time1 / runTimes, time2  / runTimes);
    // console.log(times1);
    // console.log(times2);
  }
}

function escapeRegExp(string) {
  // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const emoticonsUrlPrefix = "images/emoticons/";
let emoticons = [
  {
    img: "brb.gif",
    key: "Be Right Back",
    text: "(brb)",
  },
  {
    img: "sunshine.webp",
    key: "Sunshine",
    text: "(#)",
  },
  {
    img: "74_74.gif",
    key: "Party",
    text: "&lt;:o)",
  },
  {
    img: "dog.gif",
    key: "Dog face",
    text: "(&amp;)",
  },
  {
    img: "rainbow.webp",
    key: "Rainbow",
    text: "(R)",
  },
  {
    img: "regular_smile.gif",
    key: "Smile",
    text: [":-)", ":)"],
  },
  {
    img: "teeth_smile.gif",
    key: "Open-mouthed",
    text: [":-D", ":d"],
  },
  {
    img: "omg_smile.gif",
    key: "Surprised",
    text: [":-O", ":o"],
  },
  {
    img: "tongue_smile.gif",
    key: "Tongue out",
    text: [":-P", ":p"],
  },
  {
    img: "wink_smile.gif",
    key: "Wink",
    text: [";-)", ";)"],
  },
  {
    img: "sad_smile.gif",
    key: "Sad",
    text: [":-(", ":("],
  },
  {
    img: "confused_smile.gif",
    key: "Confused",
    text: [":-S", ":s"],
  },
  {
    img: "what_smile.gif",
    key: "Disappointed",
    text: [":-|", ":|"],
  },
  {
    img: "cry_smile.gif",
    key: "Crying",
    text: ":'(",
  },
  {
    img: "red_smile.gif",
    key: "Embarrassed",
    text: [":-$", ":$"],
  },
  {
    img: "shades_smile.gif",
    key: "Hot",
    text: "(H)",
  },
  {
    img: "angry_smile.gif",
    key: "Angry",
    text: [":-@", ":@"],
  },
  {
    img: "angel_smile.gif",
    key: "Angel",
    text: "(A)",
  },
  {
    img: "devil_smile.gif",
    key: "Devil",
    text: "(6)",
  },
  {
    img: "47_47.gif",
    key: "Don't tell anyone",
    text: ":-#",
  },
  {
    img: "48_48.gif",
    key: "Baring teeth",
    text: "8o|",
  },
  {
    img: "49_49.gif",
    key: "Nerd",
    text: "8-|",
  },
  {
    img: "50_50.gif",
    key: "Sarcastic",
    text: "^o)",
  },
  {
    img: "51_51.gif",
    key: "Secret telling",
    text: ":-*",
  },
  {
    img: "52_52.gif",
    key: "Sick",
    text: "+o(",
  },
  {
    img: "71_71.gif",
    key: "I don't know",
    text: ":^)",
  },
  {
    img: "72_72.gif",
    key: "Thinking",
    text: "*-)",
  },
  {
    img: "75_75.gif",
    key: "Eye-rolling",
    text: "8-)",
  },
  {
    img: "77_77.gif",
    key: "Sleepy",
    text: "|-)",
  },
  {
    img: "coffee.gif",
    key: "Coffee cup",
    text: "(C)",
  },
  {
    img: "thumbs_up.gif",
    key: "Thumbs up",
    text: "(Y)",
  },
  {
    img: "thumbs_down.gif",
    key: "Thumbs down",
    text: "(N)",
  },
  {
    img: "beer_mug.gif",
    key: "Beer mug",
    text: "(B)",
  },
  {
    img: "martini.gif",
    key: "Martini glass",
    text: "(D)",
  },
  {
    img: "girl.gif",
    key: "Girl",
    text: "(X)",
  },
  {
    img: "guy.gif",
    key: "Boy",
    text: "(Z)",
  },
  {
    img: "guy_hug.gif",
    key: "Left hug",
    text: "({)",
  },
  {
    img: "girl_hug.gif",
    key: "Right hug",
    text: "(})",
  },
  {
    img: "bat.gif",
    key: "Vampire bat",
    text: [":-[", ":["],
  },
  {
    img: "cake.gif",
    key: "Birthday cake",
    text: "(^)",
  },
  {
    img: "heart.gif",
    key: "Red heart",
    text: "(L)",
  },
  {
    img: "broken_heart.gif",
    key: "Broken heart",
    text: "(U)",
  },
  {
    img: "kiss.gif",
    key: "Red lips",
    text: "(K)",
  },
  {
    img: "present.gif",
    key: "Gift with a bow",
    text: "(G)",
  },
  {
    img: "rose.gif",
    key: "Red rose",
    text: "(F)",
  },
  {
    img: "wilted_rose.gif",
    key: "Wilted rose",
    text: "(W)",
  },
  {
    img: "camera.gif",
    key: "Camera",
    text: "(P)",
  },
  {
    img: "film.gif",
    key: "Filmstrip",
    text: "(~)",
  },
  {
    img: "cat.gif",
    key: "Cat face",
    text: "(@)",
  },
  {
    img: "phone.gif",
    key: "Telephone receiver",
    text: "(T)",
  },
  {
    img: "lightbulb.gif",
    key: "Light bulb",
    text: "(I)",
  },
  {
    img: "note.gif",
    key: "Note",
    text: "(8)",
  },
  {
    img: "moon.gif",
    key: "Sleeping half-moon",
    text: "(S)",
  },
  {
    img: "star.gif",
    key: "Star",
    text: "(*)",
  },
  {
    img: "envelope.gif",
    key: "E-mail",
    text: "(E)",
  },
  {
    img: "clock.gif",
    key: "Clock",
    text: "(O)",
  },
  {
    img: "messenger.gif",
    key: "MSN Messenger icon",
    text: "(M)",
  },
  {
    img: "53_53.gif",
    key: "Snail",
    text: "(sn)",
  },
  {
    img: "70_70.gif",
    key: "Black Sheep",
    text: "(bah)",
  },
  {
    img: "55_55.gif",
    key: "Plate",
    text: "(pl)",
  },
  {
    img: "56_56.gif",
    key: "Bowl",
    text: "(||)",
  },
  {
    img: "57_57.gif",
    key: "Pizza",
    text: "(pi)",
  },
  {
    img: "58_58.gif",
    key: "Soccer ball",
    text: "(so)",
  },
  {
    img: "59_59.gif",
    key: "Auto",
    text: "(au)",
  },
  {
    img: "60_60.gif",
    key: "Airplane",
    text: "(ap)",
  },
  {
    img: "61_61.gif",
    key: "Umbrella",
    text: "(um)",
  },
  {
    img: "62_62.gif",
    key: "Island with a palm tree",
    text: "(ip)",
  },
  {
    img: "63_63.gif",
    key: "Computer",
    text: "(co)",
  },
  {
    img: "64_64.gif",
    key: "Mobile Phone",
    text: "(mp)",
  },
  {
    img: "66_66.gif",
    key: "Stormy cloud",
    text: "(st)",
  },
  {
    img: "73_73.gif",
    key: "Lightning",
    text: "(li)",
  },
  {
    img: "69_69.gif",
    key: "Money",
    text: "(mo)",
  },
];
emoticons.forEach((emoticon) => {
  emoticon.regex = [];
  if (Array.isArray(emoticon.text)) {
    emoticon.text.forEach((item) => {
      emoticon.regex.push(new RegExp(escapeRegExp(item), "ig"));
    });
  } else {
    emoticon.regex.push(new RegExp(escapeRegExp(emoticon.text), "ig"));
  }
});

function fromNameChangeHandler() {
  updateCustomNameFrom(document);
}

function toNameChangeHandler() {
  updateCustomNameTo(document);
}


const enableTimers = true;
const timers = {};
function startTimer(name) {
  if (enableTimers) {
    timers[name] = {
      start: new Date()
    };
  }
}
function stopTimer(name) {
  if (enableTimers) {
    timers[name].end = new Date();
  }
}

function alterTimers() {
  if (enableTimers) {
    let resultMessage = '';
    for (const timerName in timers) {
      const timer = timers[timerName];
      resultMessage += `${timerName}: ${roundNumber((timer.end - timer.start) / 1000, 3)}s\n`;
    }
    console.log(resultMessage);
    //alert(resultMessage);
  }
}



function processElements(fragment) {
  startTimer("process emoticons");

  // Process emoticons
  processEmoticons(fragment.querySelectorAll(".msn_message_text"));
  processEmoticons(fragment.querySelectorAll(".friendly-name"));

  stopTimer("process emoticons");

  startTimer("process custom names");

  // Update custom names
  const logElement = fragment.querySelectorAll(".msn_log")[0];
  if (logElement.getAttribute("data-to") != '') {
    document.getElementById("to").value = logElement.getAttribute("data-to");
  } else {
    document.getElementById("to").value = "To";
    updateCustomNameTo(fragment);
  }
  if (logElement.getAttribute("data-from") != '') {
    document.getElementById("from").value = logElement.getAttribute("data-from");
  } else {
    document.getElementById("from").value = "From";
    updateCustomNameFrom(fragment);
  }

  stopTimer("process custom names");

  startTimer("process date time");

  // Process dates/times
  processDateTime(fragment);

  stopTimer("process date time");
}



const batchLoading = true; //TODO: For low perf devices, only insert a portion of the children and expose the rest on scroll
function showChat(fragment) {
  document.getElementById("from").removeEventListener("change", fromNameChangeHandler);
  document.getElementById("to").removeEventListener("change", toNameChangeHandler);

  // Clear existing output
  const outputNode = document.getElementById("output");
  outputNode.innerHTML = "";

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

  alterTimers();

  document.body.classList.add("showChat");
  document.getElementById("from").addEventListener("change", fromNameChangeHandler);
  document.getElementById("to").addEventListener("change", toNameChangeHandler);
}

const emoticonMarkupStart = '<span class="emoticon"><span>';
const emoticonMarkupStartRegex = new RegExp(escapeRegExp(emoticonMarkupStart));
function processEmoticons(elements) {
  elements.forEach((element) => {
    let innerHTML = element.innerHTML;
    emoticons.forEach((emoticon) => {
      emoticon.regex.forEach((regex) => {
        innerHTML = innerHTML.replaceAll(regex, (match, offset, string) => {
          if (
            !emoticonMarkupStartRegex.test(
              string.substring(offset - emoticonMarkupStart.length - 10, offset)
            )
          ) {
            return `${emoticonMarkupStart}${match}</span><img src="${emoticonsUrlPrefix}${emoticon.img}" alt=""/></span>`;
          } else {
            return match;
          }
        });
      });
    });
    element.innerHTML = innerHTML;
  });
}

function reset(e) {
  const outputNode = document.getElementById("output");
  outputNode.innerHTML = "";
  document.body.classList.remove("showChat");
}

function updateCustomName(name, fragment) {
  const value = document.getElementById(name).value;
  fragment.querySelectorAll(`.custom-name.is-${name}-true`).forEach((element) => {
    element.innerHTML = value;
  });
}

function updateCustomNameFrom(fragment) {
  updateCustomName("from", fragment);
}

function updateCustomNameTo(fragment) {
  updateCustomName("to", fragment);
}

function roundNumber(number, decimalPlaces) {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

function basicPluralString(string, number) {
  return `${number} ${string}${number > 1 ? 's' : ''}`;
}

function processDateTime(fragment) {
  let lastDate = null;
  fragment
    .querySelectorAll(".msn_message .msn_date_time")
    .forEach((element) => {
      const currentDate = Date.parse(element.getAttribute("data-date") + " " + element.getAttribute("data-time"));
      if (lastDate != null) {
        let totalMs = currentDate - lastDate; // milliseconds between dates
        let totalDays = roundNumber(totalMs / 86400000, 1); // days
        let totalHours = roundNumber(totalMs / 3600000, 1); // hours
        let totalMins = roundNumber(totalMs / 60000, 0); // minutes

        const elapsedMinsThreshold = 30; // TODO: Could make time configurable
        if (totalMins > elapsedMinsThreshold) {
          let div = document.createElement("div");
          div.classList.add("date-diff");

          if (totalDays >= 1) {
            div.innerText = basicPluralString('day', totalDays);
          } else if (totalHours >= 1) {
              div.innerText = basicPluralString('hour', totalHours);
          } else {
            div.innerText = basicPluralString('minute', totalMins);
          }

          // Insert time elapsed element
          const maxSiblingAttempts = 3;
          let siblingAttempts = 1;
          let previousElementSibling = element.parentElement.parentElement.previousElementSibling;
          while(siblingAttempts <= maxSiblingAttempts) {
            if (previousElementSibling.classList.contains("msn_message") || previousElementSibling.classList.contains("msn_invitation")) { //msn_invitation
              previousElementSibling.after(div);
              break;
            }
            previousElementSibling = previousElementSibling.previousElementSibling;
            siblingAttempts++;
          }
          if (siblingAttempts > maxSiblingAttempts) {
            element.parentElement.parentElement.before(div);
          }
        }
      }
      lastDate = currentDate;
    });
}

function bodyClick(e) {
  const optionsMenu = document.getElementsByClassName("options-menu")[0];
  if (optionsMenu != e.target && !optionsMenu.contains(e.target)) {
    document.body.removeEventListener("click", bodyClick);
    document.body.classList.remove("show-options");
  }
}

addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("msn-app");
  app.addEventListener("dragenter", filePreventOpen);
  app.addEventListener("dragover", filePreventOpen);
  app.addEventListener("drop", fileDropHandler);

  document.getElementById("drop_zone").addEventListener("click", () => {
    document.getElementById("fileXmlUpload").click();
  });
  document.getElementById("openFileUploadButton").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("fileXmlUpload").click();
  });
  document.getElementById("fileXmlUpload").addEventListener("change", fileChangeHandler);

  // Options Toggles
  document.getElementById("optionsToggle").addEventListener("click", (e) => {
    if (document.body.classList.contains("show-options")) {
      document.body.removeEventListener("click", bodyClick);
      document.body.classList.remove("show-options");
      e.stopPropagation();
    } else {
      document.body.classList.add("show-options");
      document.body.addEventListener("click", bodyClick);
      e.stopPropagation();
    }
  });

  document.getElementById("emoticonsToggle").addEventListener("change", () => {
    document.body.classList.toggle("hide-emoticons");
  });

  document.getElementById("logonNameToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-logon-name");
  });

  const customName = document.getElementById("customName");
  const customNameCheckBox = customName.getElementsByClassName("toggle-checkbox")[0];
  customNameCheckBox.addEventListener("change", () => {
    customName.classList.toggle("show");
    document.body.classList.toggle("show-custom-names");
  });
  document.getElementById("from").addEventListener("change", fromNameChangeHandler);
  document.getElementById("to").addEventListener("change", toNameChangeHandler);

  document.getElementById("dateToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-date");
  });
  document.getElementById("timeToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-time");
  });

  document
    .getElementById("threadFormatToggle")
    .addEventListener("change", () => {
      document.body.classList.toggle("thread-format");
    });

  document.getElementById("reset").addEventListener("click", reset);
});
