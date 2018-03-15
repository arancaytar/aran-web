($$ => {
  const storage = window.localStorage;

  const click = function() {
    const abs = !!+(storage.absoluteTimes = +!+storage.absoluteTimes);
    update(abs, $$('time'));
  };

  const update = (abs, times) => {
    for (let x of times) {
      const time = moment(x.dateTime);
      x.innerText = abs ? x.title : time.fromNow();
    }
  };

  const init = () => {
    const times = $$('time');
    for (let x of times) {
      const time = moment(x.dateTime);
      x.title = time.format('YYYY-MM-DD HH:mm:ss ZZ');
      x.onclick = click;
    }
    update(!!+storage.absoluteTimes, times);
  };
  init();

})(document.querySelectorAll.bind(document));
