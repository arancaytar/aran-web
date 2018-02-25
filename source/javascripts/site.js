($$ => {
  for (let x of $$('span.time[data-time]')) {
    const time = moment(+x.getAttribute('data-time')*1000);
    x.title = time.format('YYYY-MM-DD HH:mm:ss ZZ');
    x.innerText = time.fromNow();
  }
})(document.querySelectorAll.bind(document));
