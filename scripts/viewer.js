function preventOpen(e) {
  // Prevent default behavior (prevent file from being opened)
  e.preventDefault();
}

function dropHandler(e) {
  preventOpen(e);
  if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        const fileName = file.name;
        const fileReader = new FileReader();

        fileReader.onload = function (event) {
          // Get file contents as string
          const xmlStr = event.target.result;

          // Parse as XML
          const domParser = new DOMParser();
          const xmlDoc = domParser.parseFromString(xmlStr, "text/xml");

          const errorNode = xmlDoc.querySelector("parsererror");
          if (errorNode) {
            console.log("Error parsing document :(");
          } else {
            //console.log(xmlDoc);
            runXslt(xmlDoc);
          }
        };

        fileReader.readAsText(file);
      }
    });
  }
}

function runXslt(xmlDoc) {
  const xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(document.getElementById("xslt"));

  const fragment = xsltProcessor.transformToFragment(xmlDoc, document);

  showChat(fragment);
}

const emoticonsUrlPrefix = "emoticons/";
let emoticons = [
  {
    img: "74_74.gif",
    key: "Party",
    text: "<:o)",
  },
  {
    img: "rainbow.png",
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
    img: "dog.gif",
    key: "Dog face",
    text: "(&amp;)",
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

function showChat(fragment) {
  const outputNode = document.getElementById("output");
  outputNode.innerHTML = "";
  outputNode.appendChild(fragment);
  document.body.classList.add("showChat");

  processEmoticons(outputNode.querySelectorAll(".msn_message_text"));
  processEmoticons(outputNode.querySelectorAll(".friendly-name"));

  updateCustomNamesFrom();
  updateCustomNamesTo();
}

function processEmoticons(outputNode) {
  outputNode.forEach((message) => {
    let messageText = message.innerHTML;
    emoticons.forEach((emoticon) => {
      emoticon.regex.forEach((regex) => {
        messageText = messageText.replaceAll(regex, (match, offset, string) => {
          return `<span class="emoticon"><span data-text="${match}"></span><img src="${emoticonsUrlPrefix}${emoticon.img}" alt=""/></span>`;
        });
      });
    });
    message.innerHTML = messageText;
  });
}

function reset(e) {
  const outputNode = document.getElementById("output");
  outputNode.innerHTML = "";
  document.body.classList.remove("showChat");
  //TODO: Reset any error messages
}

function escapeRegExp(string) {
  // From: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function updateCustomNamesFrom() {
  document.querySelectorAll(".custom-name.is-from-true").forEach((element) => {
    element.innerHTML = document.getElementById("from").value;
  });
}

function updateCustomNamesTo() {
  document.querySelectorAll(".custom-name.is-from-false").forEach((element) => {
    element.innerHTML = document.getElementById("to").value;
  });
}

addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("msn-app");
  app.addEventListener("dragover", preventOpen);
  app.addEventListener("drop", dropHandler);

  document.getElementById("hideHeaderToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-header");
  });
  document
    .getElementById("threadFormatToggle")
    .addEventListener("change", () => {
      document.body.classList.toggle("thread-format");
    });
  document.getElementById("logonNameToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-logon-name");
  });

  let customNameSet = false;
  const customName = document.getElementById("customName");
  const customNameCheckBox =
    customName.getElementsByClassName("toggle-checkbox")[0];
  customNameCheckBox.addEventListener("change", () => {
    customName.classList.toggle("show");
    document.body.classList.toggle("show-custom-names");
    if (!customNameSet) {
      updateCustomNamesFrom();
      updateCustomNamesTo();
      customNameSet = true;
    }
  });
  document.getElementById("from").addEventListener("change", () => {
    updateCustomNamesFrom();
  });
  document.getElementById("to").addEventListener("change", () => {
    updateCustomNamesTo();
  });

  document.getElementById("emoticonsToggle").addEventListener("change", () => {
    document.body.classList.toggle("hide-emoticons");
  });
  document.getElementById("dateToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-date");
  });
  document.getElementById("timeToggle").addEventListener("change", () => {
    document.body.classList.toggle("show-time");
  });

  document.getElementById("reset").addEventListener("click", reset);
});
