import { readFileAndTransformXml } from "./xmlToHtml.js";
import {
  processElements,
  updateCustomNameFrom,
  updateCustomNameTo,
} from "./htmlProcessing.js";

const xsltPath = "../xslt/to-html.xslt";

// Constants for element IDs and class names
const ELEMENT_IDS = {
  msnApp: "msn-app",
  dropZone: "drop_zone",
  fileXmlUpload: "fileXmlUpload",
  openFileUploadButton: "openFileUploadButton",
  optionsToggle: "optionsToggle",
  emoticonsToggle: "emoticonsToggle",
  logonNameToggle: "logonNameToggle",
  customName: "customName",
  from: "from",
  to: "to",
  dateToggle: "dateToggle",
  timeToggle: "timeToggle",
  threadFormatToggle: "threadFormatToggle",
  reset: "reset",
  output: "output",
};
const CLASS_NAMES = {
  showChat: "showChat",
  showOptions: "show-options",
  hideEmoticons: "hide-emoticons",
  showLogonName: "show-logon-name",
  showCustomNames: "show-custom-names",
  showDate: "show-date",
  showTime: "show-time",
  threadFormat: "thread-format",
};

const Viewer = {
  // Handle file drop event
  fileDropHandler: async (e) => {
    e.preventDefault();
    if (e.dataTransfer.items) {
      for (const item of e.dataTransfer.items) {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          try {
            const fragment = await readFileAndTransformXml(
              item.getAsFile(),
              xsltPath
            );
            Viewer.onShowingChat(fragment);
          } catch (error) {
            console.error("Error:", error);
            //TODO: Add user feedback here
          }
        }
      }
    }
  },

  // Handle file change event
  fileChangeHandler: async (e) => {
    try {
      const fragment = await readFileAndTransformXml(
        e.target.files[0],
        xsltPath
      );
      console.log(fragment);
      Viewer.onShowingChat(fragment);
    } catch (error) {
      console.error("Error:", error);
      //TODO: Add user feedback here
    }
  },

  // Handle from name change
  fromNameChangeHandler: () => {
    updateCustomNameFrom(document);
  },

  // Handle to name change
  toNameChangeHandler: () => {
    updateCustomNameTo(document);
  },

  // Handle reset button click
  resetButtonClick: (e) => {
    const outputNode = document.getElementById(ELEMENT_IDS.output);
    outputNode.innerHTML = "";

    document.body.classList.remove(CLASS_NAMES.showChat);
  },

  // Show chat content
  onShowingChat: (fragment) => {
    // Remove event listeners
    Viewer.removeEventListeners();

    // Clear existing output
    const outputNode = document.getElementById(ELEMENT_IDS.output);
    outputNode.innerHTML = "";

    //TODO: Add loading state

    // Process emoticons and process dates/times and return names
    const names = processElements(fragment);

    // Update custom names
    document.getElementById(ELEMENT_IDS.from).value = names.from || "From";
    document.getElementById(ELEMENT_IDS.to).value = names.to || "To";
    if (!names.from) updateCustomNameFrom(fragment);
    if (!names.to) updateCustomNameTo(fragment);

    // Insert new HTML
    outputNode.appendChild(fragment);

    // Make visible
    document.body.classList.add(CLASS_NAMES.showChat);

    // Re-add event listeners
    Viewer.addEventListeners();
  },

  // Handle body click event
  bodyClick: (e) => {
    const optionsMenu = document.getElementsByClassName("options-menu")[0];
    if (optionsMenu !== e.target && !optionsMenu.contains(e.target)) {
      document.body.removeEventListener("click", Viewer.bodyClick);
      document.body.classList.remove(CLASS_NAMES.showOptions);
    }
  },

  // Initialize the application
  init: () => {
    Viewer.addDragAndDropListeners();
    Viewer.addFileUploadListeners();
    Viewer.addOptionsToggleListeners();
    Viewer.addCustomNameListeners();
    Viewer.addToggleListeners();
    Viewer.addResetListener();
  },

  // Add drag and drop listeners
  addDragAndDropListeners: () => {
    const app = document.getElementById(ELEMENT_IDS.msnApp);
    app.addEventListener("dragenter", (e) => e.preventDefault());
    app.addEventListener("dragover", (e) => e.preventDefault());
    app.addEventListener("drop", Viewer.fileDropHandler);
  },

  // Add file upload listeners
  addFileUploadListeners: () => {
    document
      .getElementById(ELEMENT_IDS.dropZone)
      .addEventListener("click", () => {
        document.getElementById(ELEMENT_IDS.fileXmlUpload).click();
      });

    document
      .getElementById(ELEMENT_IDS.openFileUploadButton)
      .addEventListener("click", (e) => {
        e.stopPropagation();
        document.getElementById(ELEMENT_IDS.fileXmlUpload).click();
      });

    document
      .getElementById(ELEMENT_IDS.fileXmlUpload)
      .addEventListener("change", Viewer.fileChangeHandler);
  },

  // Add options toggle listeners
  addOptionsToggleListeners: () => {
    document
      .getElementById(ELEMENT_IDS.optionsToggle)
      .addEventListener("click", (e) => {
        e.stopPropagation();
        if (document.body.classList.contains(CLASS_NAMES.showOptions)) {
          document.body.removeEventListener("click", Viewer.bodyClick);
          document.body.classList.remove(CLASS_NAMES.showOptions);
        } else {
          document.body.classList.add(CLASS_NAMES.showOptions);
          document.body.addEventListener("click", Viewer.bodyClick);
        }
      });
  },

  // Add custom name listeners
  addCustomNameListeners: () => {
    const customName = document.getElementById(ELEMENT_IDS.customName);
    const customNameCheckBox =
      customName.getElementsByClassName("toggle-checkbox")[0];
    customNameCheckBox.addEventListener("change", () => {
      customName.classList.toggle("show");
      document.body.classList.toggle(CLASS_NAMES.showCustomNames);
    });

    document
      .getElementById(ELEMENT_IDS.from)
      .addEventListener("change", Viewer.fromNameChangeHandler);
    document
      .getElementById(ELEMENT_IDS.to)
      .addEventListener("change", Viewer.toNameChangeHandler);
  },

  // Add toggle listeners
  addToggleListeners: () => {
    document
      .getElementById(ELEMENT_IDS.emoticonsToggle)
      .addEventListener("change", () => {
        document.body.classList.toggle(CLASS_NAMES.hideEmoticons);
      });

    document
      .getElementById(ELEMENT_IDS.logonNameToggle)
      .addEventListener("change", () => {
        document.body.classList.toggle(CLASS_NAMES.showLogonName);
      });

    document
      .getElementById(ELEMENT_IDS.dateToggle)
      .addEventListener("change", () => {
        document.body.classList.toggle(CLASS_NAMES.showDate);
      });
    document
      .getElementById(ELEMENT_IDS.timeToggle)
      .addEventListener("change", () => {
        document.body.classList.toggle(CLASS_NAMES.showTime);
      });

    document
      .getElementById(ELEMENT_IDS.threadFormatToggle)
      .addEventListener("change", () => {
        document.body.classList.toggle(CLASS_NAMES.threadFormat);
      });
  },

  // Add reset listener
  addResetListener: () => {
    document
      .getElementById(ELEMENT_IDS.reset)
      .addEventListener("click", Viewer.resetButtonClick);
  },

  // Add event listeners
  addEventListeners: () => {
    document
      .getElementById(ELEMENT_IDS.from)
      .addEventListener("change", Viewer.fromNameChangeHandler);
    document
      .getElementById(ELEMENT_IDS.to)
      .addEventListener("change", Viewer.toNameChangeHandler);
  },

  // Remove event listeners
  removeEventListeners: () => {
    document
      .getElementById(ELEMENT_IDS.from)
      .removeEventListener("change", Viewer.fromNameChangeHandler);
    document
      .getElementById(ELEMENT_IDS.to)
      .removeEventListener("change", Viewer.toNameChangeHandler);
  },
};

document.addEventListener("DOMContentLoaded", Viewer.init);
