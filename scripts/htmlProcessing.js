import { emoticons } from "./emoticons.js";
import { escapeRegExp } from "./escapeRegExp.js";
import { roundNumber, basicPluralString } from "./helper.js";

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
            return `${emoticonMarkupStart}${match}</span><img src="${emoticon.gif ? emoticon.gif : emoticon.img}" ${emoticon.gif ? `data-img="${emoticon.img}" data-gif="${emoticon.gif}"` : ''}" alt=""/></span>`;
          } else {
            return match;
          }
        });
      });
    });
    element.innerHTML = innerHTML;
  });
}

export function processElements(fragment) {
  // Process emoticons
  const emoticonElements = fragment.querySelectorAll(
    ".msn_message_text, .friendly-name"
  );
  processEmoticons(emoticonElements);

  // Process dates/times
  insertTimeElapsed(fragment);

  const logElement = fragment.querySelectorAll(".msn_log")[0];
  return {
    to: logElement.getAttribute("data-to"),
    from: logElement.getAttribute("data-from"),
  };
}

export function updateCustomName(name, fragment) {
  const value = document.getElementById(name).value;
  fragment
    .querySelectorAll(`.custom-name.is-${name}-true`)
    .forEach((element) => {
      element.innerHTML = value;
    });
}

export function updateCustomNameFrom(fragment) {
  updateCustomName("from", fragment);
}

export function updateCustomNameTo(fragment) {
  updateCustomName("to", fragment);
}

export function animationEnabled(enabled, fragment) {
  fragment
    .querySelectorAll(`.emoticon > img[data-gif]`)
    .forEach((img) => {
      img.src = img.getAttribute(enabled ? "data-gif" : "data-img");
    });
}

function insertTimeElapsed(fragment) {
  let lastDate = null;
  fragment.querySelectorAll(".msn_message").forEach((messageElement) => {
    const dateTimeElement =
      messageElement.querySelectorAll(".msn_date_time")[0];

    const currentDate = Date.parse(
      `${dateTimeElement.getAttribute(
        "data-date"
      )} ${dateTimeElement.getAttribute("data-time")}`
    );

    if (lastDate != null) {
      let totalMs = currentDate - lastDate; // milliseconds between dates
      let totalDays = roundNumber(totalMs / 86400000, 1); // days
      let totalHours = roundNumber(totalMs / 3600000, 1); // hours
      let totalMins = roundNumber(totalMs / 60000, 0); // minutes

      const elapsedMinsThreshold = 30; // TODO: Could make time configurable
      if (totalMins > elapsedMinsThreshold) {
        let div = document.createElement("div");
        div.classList.add("time-elapsed");

        // Set message
        if (totalDays >= 1) {
          div.innerText = `Time elapsed: ${basicPluralString(
            "day",
            totalDays
          )}`;
        } else if (totalHours >= 1) {
          div.innerText = `Time elapsed: ${basicPluralString(
            "hour",
            totalHours
          )}`;
        } else {
          div.innerText = `Time elapsed: ${basicPluralString(
            "minute",
            totalMins
          )}`;
        }

        // Insert time elapsed element
        let prevSibling = messageElement.previousElementSibling;
        while (prevSibling) {
          if (
            prevSibling.classList.contains("msn_message") ||
            prevSibling.classList.contains("msn_invitation")
          ) {
            break;
          }
          //ELSE: txt_notes, file_notes
          prevSibling = prevSibling.previousElementSibling;
        }

        if (prevSibling) {
          prevSibling.after(div);
        } else {
          messageElement.before(div);
        }
      }
    }
    lastDate = currentDate;
  });
}
