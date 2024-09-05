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

function alertTimers() {
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



startTimer("process emoticons");
stopTimer("process emoticons");
alertTimers();
