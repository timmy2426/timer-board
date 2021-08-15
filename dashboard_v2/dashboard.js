document.addEventListener("DOMContentLoaded", function () {
  class Timer {
    constructor(name) {
      this.id = Date.now();
      this.name = name;
      this.count = 0;
    }
  }

  let timerList = [];
  let timerIdList = [];
  let stopwatchCount = 0;
  let recordNum = 0;
  let recordIdList = [];

  function doubleDigit(num) {
    let output = num < 10 ? "0" + `${num}` : `${num}`;
    return output;
  }

  function maxID(list) {
    let max = list[0];
    list.forEach((ele) => {
      if (ele > max) {
        max = ele;
      }
    });
    return max;
  }

  function timerPrinter(id, count) {
    let c = count;
    let s = Math.floor(c / 100);
    let sec = s % 60;
    let min = Math.floor((s / 60) % 60);
    let hrs = Math.floor((s / 3600) % 100);
    document.querySelector(`#t-sec-${id}`).innerHTML = doubleDigit(sec);
    document.querySelector(`#t-min-${id}`).innerHTML = doubleDigit(min);
    document.querySelector(`#t-hrs-${id}`).innerHTML = doubleDigit(hrs);
    timerList[timerIdList.indexOf(parseInt(id))].count = count;
  }

  function timerStartFun(start) {
    start.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = timerIdList.indexOf(parseInt(btn));
      if (start.innerHTML === "開始") {
        let counter = new Worker("counter.js");
        counter.postMessage({ count: `${timerList[index].count}` });
        counter.onmessage = function (e) {
          let count = e.data.count;
          timerPrinter(btn, count);
        };
        start.addEventListener(
          "click",
          () => {
            counter.terminate();
          },
          { once: true }
        );
        start.innerHTML = "暫停";
      } else {
        start.innerHTML = "開始";
      }
    });
  }

  function timerResetFun(reset, start) {
    reset.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = timerIdList.indexOf(parseInt(btn));
      if (start.innerHTML !== "開始") {
        start.click();
      }
      timerList[index].count = 0;
      document.querySelector(`#t-sec-${btn}`).innerHTML = "00";
      document.querySelector(`#t-min-${btn}`).innerHTML = "00";
      document.querySelector(`#t-hrs-${btn}`).innerHTML = "00";
    });
  }

  function timerDeleFun(dele, start) {
    dele.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = timerIdList.indexOf(parseInt(btn));
      let timerDele = document.getElementById(btn);
      if (start.innerHTML !== "開始") {
        start.click();
      }
      timerList.splice(index, 1);
      timerIdList.splice(index, 1);
      timerDele.remove();
    });
  }

  function stopwatchPrinter(count) {
    let c = Math.floor(count / 100);
    let tms = count % 100;
    let sec = c % 60;
    let min = Math.floor((c / 60) % 60);
    let hrs = Math.floor((c / 3600) % 100);
    document.querySelector("#s-tms").innerHTML = doubleDigit(tms);
    document.querySelector("#s-sec").innerHTML = doubleDigit(sec);
    document.querySelector("#s-min").innerHTML = doubleDigit(min);
    document.querySelector("#s-hrs").innerHTML = doubleDigit(hrs);
    stopwatchCount = count;
  }

  function recordDeleFun(dele) {
    dele.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = recordIdList.indexOf(parseInt(btn));
      let recordDele = document.getElementById(btn);
      recordIdList.splice(index, 1);
      recordDele.remove();
    });
  }

  if (localStorage.getItem("timerList") !== null || undefined) {
    timerList = JSON.parse(localStorage.getItem("timerList"));
    timerIdList = JSON.parse(localStorage.getItem("timerIdList"));
    document.querySelector("#timer-columns").innerHTML =
      localStorage.getItem("timerHTML");
    document.querySelectorAll(".timer").forEach((timer) => {
      let start = timer.querySelector("#t-start-pause");
      let reset = timer.querySelector("#t-reset");
      let dele = timer.querySelector("#t-delete");
      timerStartFun(start);
      timerResetFun(reset, start);
      timerDeleFun(dele, start);
    });
  }

  if (localStorage.getItem("stopwatchCount") !== null || undefined) {
    stopwatchCount = localStorage.getItem("stopwatchCount");
    recordNum = localStorage.getItem("recordNum");
    recordIdList = JSON.parse(localStorage.getItem("recordIdList"));
    document.querySelector("#stopwatch-records").innerHTML =
      localStorage.getItem("recordHTML");
    document.querySelectorAll(".stopwatch").forEach((stopwatch) => {
      let dele = stopwatch.querySelector("#s-delete");
      recordDeleFun(dele);
    });
    let c = Math.floor(stopwatchCount / 100);
    let tms = stopwatchCount % 100;
    let sec = c % 60;
    let min = Math.floor((c / 60) % 60);
    let hrs = Math.floor((c / 3600) % 100);
    document.querySelector("#s-tms").innerHTML = doubleDigit(tms);
    document.querySelector("#s-sec").innerHTML = doubleDigit(sec);
    document.querySelector("#s-min").innerHTML = doubleDigit(min);
    document.querySelector("#s-hrs").innerHTML = doubleDigit(hrs);
  }

  window.addEventListener("unload", () => {
    document.querySelectorAll(".timer").forEach((timer) => {
      let start = timer.querySelector("#t-start-pause");
      if (start.innerHTML !== "開始") {
        start.innerHTML = "開始";
      }
    });
    let timerHTML = document.querySelector("#timer-columns");
    localStorage.setItem("timerList", JSON.stringify(timerList));
    localStorage.setItem("timerIdList", JSON.stringify(timerIdList));
    localStorage.setItem("timerHTML", timerHTML.innerHTML);
    let recordHTML = document.querySelector("#stopwatch-records");
    localStorage.setItem("recordIdList", JSON.stringify(recordIdList));
    localStorage.setItem("stopwatchCount", stopwatchCount);
    localStorage.setItem("recordNum", recordNum);
    localStorage.setItem("recordHTML", recordHTML.innerHTML);
  });

  document
    .querySelector("#input-timer-name")
    .addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        document.querySelector("#t-build").click();
      }
    });

  document.querySelector("#t-build").onclick = function () {
    if (document.querySelector("#input-timer-name").value !== "") {
      let lastTimerId = maxID(timerIdList);
      let lastTimerWrap = document.getElementById(lastTimerId);
      let name = document.querySelector("#input-timer-name").value;
      document.querySelector("#input-timer-name").value = "";
      let newTimer = new Timer(name);
      timerList.push(newTimer);
      timerIdList.push(newTimer.id);
      let timerWrap = document.createElement("div");
      timerWrap.setAttribute("class", "timer");
      timerWrap.setAttribute("id", newTimer.id);
      timerWrap.innerHTML =
        '<div class="timer" id="' +
        newTimer.id +
        '"><div class="title"><h3>' +
        newTimer.name +
        '</h3></div><div class="times"><p><span id="t-hrs-' +
        newTimer.id +
        '">00</span> 時<span id="t-min-' +
        newTimer.id +
        '">00</span> 分<span id="t-sec-' +
        newTimer.id +
        '">00</span> 秒</p></div><div class="controls"><button id="t-start-pause" data-id="' +
        newTimer.id +
        '">開始</button><button id="t-reset" data-id="' +
        newTimer.id +
        '">歸零</button><button id="t-delete" data-id="' +
        newTimer.id +
        '">刪除</button></div></div>';
      if (document.querySelector("#timer-columns").innerHTML === "") {
        document.querySelector("#timer-columns").appendChild(timerWrap);
      } else {
        document
          .querySelector("#timer-columns")
          .insertBefore(timerWrap, lastTimerWrap);
      }
      let wrap = document.getElementById(newTimer.id);
      let start = wrap.querySelector("#t-start-pause");
      let reset = wrap.querySelector("#t-reset");
      let dele = wrap.querySelector("#t-delete");
      timerStartFun(start);
      timerResetFun(reset, start);
      timerDeleFun(dele, start);
    }
  };

  document.querySelector("#t-clean").onclick = function () {
    document.querySelectorAll(".timer").forEach((timer) => {
      let start = timer.querySelector("#t-start-pause");
      if (start.innerHTML !== "開始") {
        start.click();
      }
    });
    document.querySelector("#timer-columns").innerHTML = "";
    timerList = [];
    timerIdList = [];
  };

  document.querySelector("#s-start-pause").onclick = function () {
    if (document.querySelector("#s-start-pause").innerHTML === "開始") {
      let counter = new Worker("counter.js");
      counter.postMessage({ count: `${stopwatchCount}` });
      counter.onmessage = function (e) {
        let count = e.data.count;
        stopwatchPrinter(count);
      };
      document.querySelector("#s-start-pause").addEventListener(
        "click",
        () => {
          counter.terminate();
        },
        { once: true }
      );
      document.querySelector("#s-start-pause").innerHTML = "暫停";
    } else {
      document.querySelector("#s-start-pause").innerHTML = "開始";
    }
  };

  document.querySelector("#s-reset").onclick = function () {
    if (document.querySelector("#s-start-pause").innerHTML !== "開始") {
      document.querySelector("#s-start-pause").click();
    }
    function reset(id) {
      document.getElementById(id).innerHTML = "00";
    }
    stopwatchCount = 0;
    reset("s-tms");
    reset("s-sec");
    reset("s-min");
    reset("s-hrs");
  };

  document.querySelector("#s-record").onclick = function () {
    recordNum++;
    let lastRecordId = maxID(recordIdList);
    let lastRecordWrap = document.getElementById(lastRecordId);
    let tms = document.querySelector("#s-tms").innerHTML;
    let sec = document.querySelector("#s-sec").innerHTML;
    let min = document.querySelector("#s-min").innerHTML;
    let hrs = document.querySelector("#s-hrs").innerHTML;
    let newId = Date.now();
    recordIdList.push(newId);
    let newRecordWrap = document.createElement("div");
    newRecordWrap.setAttribute("class", "stopwatch");
    newRecordWrap.setAttribute("id", newId);
    newRecordWrap.innerHTML =
      '<div class="stopwatch" id="' +
      newId +
      '"><div class="record"><p>#' +
      recordNum +
      "&emsp;&emsp;" +
      hrs +
      " 時 " +
      min +
      " 分 " +
      sec +
      " 秒<span> " +
      tms +
      '</span></p></div><div class="record-controls"><button id="s-delete" data-id="' +
      newId +
      '">刪除</button></div></div>';
    if (document.querySelector("#stopwatch-records").innerHTML === "") {
      document.querySelector("#stopwatch-records").appendChild(newRecordWrap);
    } else {
      document
        .querySelector("#stopwatch-records")
        .insertBefore(newRecordWrap, lastRecordWrap);
    }
    let wrap = document.querySelector("#stopwatch-records");
    let dele = wrap.querySelector("#s-delete");
    recordDeleFun(dele);
  };

  document.querySelector("#s-clean").onclick = function () {
    document.querySelector("#stopwatch-records").innerHTML = "";
    recordNum = 0;
    recordIdList = [];
  };
});
