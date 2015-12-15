export default function ConnectingLine (opts) {
  this.a = opts.a
  this.b = opts.b

  this.material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
  this.mesh = this.createMesh()
}

ConnectingLine.prototype.createMesh = function() {
  console.log(this.a)
  console.log(this.b)
  var geometry = new THREE.Geometry();
  geometry.vertices.push(this.a);
  geometry.vertices.push(this.b);
  var line = new THREE.Line(geometry, this.material)
  return line
};