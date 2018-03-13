($$ => {
  for (let x of $$('time')) {
    const time = moment(x.dateTime);
    x.title = time.format('YYYY-MM-DD HH:mm:ss ZZ');
    x.innerText = time.fromNow();
  }
})(document.querySelectorAll.bind(document));
