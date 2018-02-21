const ui = ($ => {
  const dom = {
    decimal: $('#decimal'),
    b36: $('#b36'),
    play: $('#play'),
    pause: $('#pause'),
    digits: Array.from($('article table').querySelectorAll('tr')).slice(1),
    timezone: $('#timezone')
  };

  const todate = number => new Date(1000 * number);
  const toWholeSecond = date => new Date(Math.round(date.getTime() / 1000) * 1000);
  const toDig = number => number.toString().padStart(2, 0);
  const toDateString = date => `${date.getFullYear()}-${toDig(date.getMonth()+1)}-${toDig(date.getDate())}`
                      + ` ${toDig(date.getHours())}:${toDig(date.getMinutes())}:${toDig(date.getSeconds())}`;
  const fromdate = date => Math.floor(date.getTime() / 1000);
  const tob36 = number => number.toString(36).padStart(6, 0);
  const fromb36 = number => parseInt(number.substring(0, 6), 36);
  const state = {
    playing: null,
    time: null,
  };

  const refresh = time => {
    state.time = toWholeSecond(time || new Date());
    dom.decimal.value = toDateString(state.time);
    const b36 = dom.b36.value = tob36(fromdate(state.time));
    for (let i = 0; i < 6; i++) {
      const digit = b36[i];
      const prefix = b36.substring(0, i+1);
      const start = todate(fromb36(prefix + '0'.repeat(5-i)));
      const end = todate(fromb36(prefix + 'z'.repeat(5-i)) + 1);
      const cells = dom.digits[i].querySelectorAll('td');
      cells[0].innerText = digit;
      cells[1].innerText = toDateString(start);
      cells[2].innerText = toDateString(end);
    }
  };

  const buttonToggle = state => {
    dom.play.style.display = state ? 'none' : '';
    dom.pause.style.display = state ? '' : 'none';
    dom.decimal.readOnly = dom.b36.readOnly = !!state;
  }

  const play = () => buttonToggle(state.playing = state.playing || setInterval(refresh, 1000)) || refresh();
  const stop = () => buttonToggle(state.playing = state.playing && clearInterval(state.playing));

  dom.play.onclick = play;
  dom.decimal.onclick = dom.b36.onclick = dom.pause.onclick = stop;
  dom.decimal.onchange = dom.b36.onchange = function () {
    const time = this.id === 'decimal' ? new Date(this.value) : todate(fromb36(this.value));
    refresh(time);
  }

  play();

  return {
    dom,
    refresh,
    play,
    stop,
    state
  };
})(document.querySelector.bind(document));
