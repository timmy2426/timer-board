self.onmessage = function (e) {
  let c = e.data.count;
  function counter() {
    c--;
    if (c >= 0) {
      self.postMessage({ count: c });
    } else {
      close();
    }
  }
  setInterval(counter, 10);
};
