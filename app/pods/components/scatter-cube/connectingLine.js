/* global THREE */

export default function ConnectingLine (opts) {
  this.pointA = opts.pointA
  this.pointB = opts.pointB

  this.material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1 });
  this.mesh = this.createMesh()

  // this.debug()
}

ConnectingLine.prototype.createMesh = function() {
  var geometry = new THREE.Geometry();
  geometry.dynamic = true

  geometry.vertices.push(this.pointA.mesh.position);
  geometry.vertices.push(this.pointB.mesh.position);

  var line = new THREE.Line(geometry, this.material)
  return line
};

ConnectingLine.prototype.updateVertices = function() {
  this.mesh.geometry.verticesNeedUpdate = true
};

ConnectingLine.prototype.debug = function() {
  var self = this
  setInterval(function() {
    if (self.pointB.name === 'Adrian Schnall') {
      console.log(self.pointB.name)
      console.log(self.mesh.geometry.vertices)
      console.log('********')
    }
  }, 4000)
  return undefined
};