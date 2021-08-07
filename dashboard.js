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
  let dataNum = 0;
  let dataIdList = [];

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

  function printer(id, count) {
    let c = count;
    let s = Math.floor(c / 100);
    let sec = s % 60;
    let min = Math.floor((s / 60) % 60);
    let hrs = Math.floor((s / 3600) % 100);
    document.querySelector(`#sec-${id}`).innerHTML = doubleDigit(sec);
    document.querySelector(`#min-${id}`).innerHTML = doubleDigit(min);
    document.querySelector(`#hrs-${id}`).innerHTML = doubleDigit(hrs);
    timerList[timerIdList.indexOf(parseInt(id))].count = count;
  }

  function startFun(start) {
    start.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = timerIdList.indexOf(parseInt(btn));
      if (start.innerHTML === "開始") {
        let counter = new Worker("counter.js");
        // let counter = new Worker("https://tadralling.com/counter.js");
        counter.postMessage({ count: `${timerList[index].count}` });
        counter.onmessage = function (e) {
          let count = e.data.count;
          printer(btn, count);
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

  function resetFun(reset, start) {
    reset.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = timerIdList.indexOf(parseInt(btn));
      if (start.innerHTML !== "開始") {
        start.click();
      }
      timerList[index].count = 0;
      document.querySelector(`#sec-${btn}`).innerHTML = "00";
      document.querySelector(`#min-${btn}`).innerHTML = "00";
      document.querySelector(`#hrs-${btn}`).innerHTML = "00";
    });
  }

  function deleFun(dele, start) {
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

  function dataDeleFun(dele) {
    dele.addEventListener("click", (e) => {
      let btn = e.target.dataset.id;
      let index = dataIdList.indexOf(parseInt(btn));
      let dataDele = document.getElementById(btn);
      dataIdList.splice(index, 1);
      dataDele.remove();
    });
  }

  if (localStorage.getItem("timerList") !== null || undefined) {
    timerList = JSON.parse(localStorage.getItem("timerList"));
    timerIdList = JSON.parse(localStorage.getItem("timerIdList"));
    document.querySelector("#record-area").innerHTML =
      localStorage.getItem("timerHTML");
    document.querySelectorAll(".timer").forEach((timer) => {
      let start = timer.querySelector("#start-pause");
      let reset = timer.querySelector("#reset");
      let dele = timer.querySelector("#delete");
      startFun(start);
      resetFun(reset, start);
      deleFun(dele, start);
    });
  }

  if (localStorage.getItem("stopwatchCount") !== null || undefined) {
    stopwatchCount = localStorage.getItem("stopwatchCount");
    dataNum = localStorage.getItem("dataNum");
    dataIdList = JSON.parse(localStorage.getItem("dataIdList"));
    document.querySelector("#stopwatch-records").innerHTML =
      localStorage.getItem("dataHTML");
    document.querySelectorAll(".stopwatch").forEach((stopwatch) => {
      let dele = stopwatch.querySelector("#s-delete");
      dataDeleFun(dele);
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
      let start = timer.querySelector("#start-pause");
      if (start.innerHTML !== "開始") {
        start.innerHTML = "開始";
      }
    });
    let timerHTML = document.querySelector("#record-area");
    localStorage.setItem("timerList", JSON.stringify(timerList));
    localStorage.setItem("timerIdList", JSON.stringify(timerIdList));
    localStorage.setItem("timerHTML", timerHTML.innerHTML);
    let dataHTML = document.querySelector("#stopwatch-records");
    localStorage.setItem("dataIdList", JSON.stringify(dataIdList));
    localStorage.setItem("stopwatchCount", stopwatchCount);
    localStorage.setItem("dataNum", dataNum);
    localStorage.setItem("dataHTML", dataHTML.innerHTML);
  });

  document.querySelector("#typing-area").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.querySelector("#build").click();
    }
  });

  document.querySelector("#build").onclick = function () {
    if (document.querySelector("#typing-area").value !== "") {
      let lastTimerId = maxID(timerIdList);
      let lastTimerWrap = document.getElementById(lastTimerId);
      let name = document.querySelector("#typing-area").value;
      document.querySelector("#typing-area").value = "";
      let newTimer = new Timer(name);
      timerList.push(newTimer);
      timerIdList.push(newTimer.id);
      let timerWrap = document.createElement("div");
      timerWrap.setAttribute("class", "timer");
      timerWrap.setAttribute("id", newTimer.id);
      timerWrap.innerHTML =
        '<div class="timer-title"><span>' +
        newTimer.name +
        '</span></div><div class="timer-times"><span id="hrs-' +
        newTimer.id +
        '">00</span> 時 <span id="min-' +
        newTimer.id +
        '">00</span> 分 <span id="sec-' +
        newTimer.id +
        '">00</span> 秒 </div><div class="timer-controls"><button id="start-pause" data-id="' +
        newTimer.id +
        '">開始</button><button id="reset" data-id="' +
        newTimer.id +
        '">歸零</button><button id="delete" data-id="' +
        newTimer.id +
        '">刪除</button></div>';
      if (document.querySelector("#record-area").innerHTML === "") {
        document.querySelector("#record-area").appendChild(timerWrap);
      } else {
        document
          .querySelector("#record-area")
          .insertBefore(timerWrap, lastTimerWrap);
      }
      let wrap = document.getElementById(newTimer.id);
      let start = wrap.querySelector("#start-pause");
      let reset = wrap.querySelector("#reset");
      let dele = wrap.querySelector("#delete");
      startFun(start);
      resetFun(reset, start);
      deleFun(dele, start);
    }
  };

  document.querySelector("#clean").onclick = function () {
    document.querySelectorAll(".timer").forEach((timer) => {
      let start = timer.querySelector("#start-pause");
      if (start.innerHTML !== "開始") {
        start.click();
      }
    });
    document.querySelector("#record-area").innerHTML = "";
    timerList = [];
    timerIdList = [];
  };

  document.querySelector("#s-start-pause").onclick = function () {
    if (document.querySelector("#s-start-pause").innerHTML === "開始") {
      let counter = new Worker("counter.js");
      // let counter = new Worker("https://tadralling.com/counter.js");
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
    dataNum++;
    let lastDataId = maxID(dataIdList);
    let lastDataWrap = document.getElementById(lastDataId);
    let tms = document.querySelector("#s-tms").innerHTML;
    let sec = document.querySelector("#s-sec").innerHTML;
    let min = document.querySelector("#s-min").innerHTML;
    let hrs = document.querySelector("#s-hrs").innerHTML;
    let newId = Date.now();
    dataIdList.push(newId);
    let newRecordsWrap = document.createElement("div");
    newRecordsWrap.setAttribute("class", "stopwatch");
    newRecordsWrap.setAttribute("id", newId);
    newRecordsWrap.innerHTML =
      '<div class="stopwatch-data"><span>第' +
      dataNum +
      "次紀錄： " +
      hrs +
      " 時 " +
      min +
      " 分 " +
      sec +
      " 秒 " +
      tms +
      '</span></div><div class="data-controls"><button id="s-delete" data-id="' +
      newId +
      '">刪除</button></div>';
    if (document.querySelector("#stopwatch-records").innerHTML === "") {
      document.querySelector("#stopwatch-records").appendChild(newRecordsWrap);
    } else {
      document
        .querySelector("#stopwatch-records")
        .insertBefore(newRecordsWrap, lastDataWrap);
    }
    let wrap = document.querySelector("#stopwatch-records");
    let dele = wrap.querySelector("#s-delete");
    dataDeleFun(dele);
  };

  document.querySelector("#s-clean").onclick = function () {
    document.querySelector("#stopwatch-records").innerHTML = "";
    dataNum = 0;
    dataIdList = [];
  };
});
