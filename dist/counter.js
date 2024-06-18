self.onmessage = function (e) {
  let c = e.data.count;
  function counter() {
    c++;
    self.postMessage({ count: `${c}` });
  }
  setInterval(counter, 10);
};
