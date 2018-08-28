const Heap = class {
  constructor(max = false) {
    this.data = [];
    this.operator = max ? -1 : 1
  }

  insert(key, value) {
    this.data.push({key, value});
    for (let i = this.data.length - 1; i > 0; i >>= 1) {
      if (this.operator*this.data[i].key < this.operator*this.data[i>>1].key)
        [this.data[i], this.data[i>>1]] = [this.data[i>>1], this.data[i]];
      else return;
    }
  }

  getRoot() {
    return this.data[0];
  }

  size() {
    return this.data.length;
  }

  replaceRoot(key, value) {
    const root = this.data[0];
    this.data[0] = {key, value};
    let i = 1;
    while (i < this.data.length) {
      const right = !!this.data[i+1] && this.data[i].key*this.operator > this.data[i+1].key*this.operator;
      if (this.data[i+right].key*this.operator < this.data[i>>1].key*this.operator) {
        [this.data[i+right], this.data[i>>1]] = [this.data[i>>1], this.data[i+right]];
      }
      else return root;
      i = ((i+right)<<1) + 1;
    }
    return root;
  }

  removeRoot() {
    const last = this.data.pop();
    return this.replaceRoot(last.key, last.value);
  }
};
