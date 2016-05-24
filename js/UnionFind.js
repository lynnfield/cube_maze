
function UnionFind(size) {
  this.id = new Array(size);
  this.sizes = new Array(size);

  for (var i = 0; i < size; ++ i) {
    this.id[i] = i;
    this.sizes[i] = 1;
  }

  function root(parent) {
    while(parent != this.id[parent]) {
      this.id[parent] = this.id[this.id[parent]];
      parent = this.id[parent];
    }
    return parent;
  }

  this.union = function (p, q) {
    var pRoot = root.call(this, p);
    var qRoot = root.call(this, q);

    if (pRoot == qRoot) return;

    if (this.sizes[pRoot] < this.sizes[qRoot]) {
      this.id[pRoot] = qRoot;
      this.sizes[qRoot] += this.sizes[pRoot];
    } else {
      this.id[qRoot] = pRoot;
      this.sizes[pRoot] += this.sizes[qRoot];
    }
  }

  this.connected = function (p, q) {
    return root.call(this, p) == root.call(this, q);
  }
}
