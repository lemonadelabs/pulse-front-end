/* global THREE, chroma */

export default function ConnectingLine (opts) {
  this.pointA = opts.pointA
  this.pointB = opts.pointB

  this.material = this.createMaterial(opts.strength)
  this.mesh = this.createMesh()

  // this.debug()
}

ConnectingLine.prototype.createMaterial = function(strength) {
  var color;

  if (strength >= 0) {
    // positive
    color = 'rgba(0, 255, 95, 1)'
  } else {
    // negative
    color = 'rgba(255, 0, 104, 1)'
    strength = strength * -1
  }
  color = chroma.interpolate('rgba(255,255,255,0.3)', color, strength)
  // color = color.replace('#', '0x')

  return new THREE.MeshBasicMaterial({
    color: color.css(),
    linewidth: 1,
    transparent: true,
    opacity: color.alpha()
  });
};

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
