/* global THREE, chroma */

export default function ConnectingLine (opts) {
  this.pointA = opts.pointA
  this.pointB = opts.pointB

  this.mesh = this.createMesh(opts)

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
    transparent: true,
    opacity: color.alpha()
  });
};

ConnectingLine.prototype.createMesh = function(opts) {
  var geometry = new THREE.Geometry();
  geometry.dynamic = true

  geometry.vertices.push(this.pointA.mesh.position);
  geometry.vertices.push(this.pointB.mesh.position);

  var line = new THREE.Line(geometry, this.createMaterial(opts.strength))
  return line
};

ConnectingLine.prototype.updateVertices = function() {
  this.mesh.geometry.verticesNeedUpdate = true
};
