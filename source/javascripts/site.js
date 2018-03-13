($$ => {
  for (let x of $$('time')) {
    const time = moment(x.dateTime);
    x.title = time.format('YYYY-MM-DD HH:mm:ss ZZ');
    x.innerText = time.fromNow();
    x.onclick = function() {
      this.innerText = this.innerText == this.title ? time.fromNow() : this.title;
    }
  }
})(document.querySelectorAll.bind(document));
