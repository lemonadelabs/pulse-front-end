/* global THREE, chroma */

/**
* draws a line between two sHPoints to represent realationship and strength of the relationship
* @method ConnectingLine
* @param {Object} opts
*   @param {Object} opts.pointA sHPoint
*   @param {Object} opts.pointB sHPoint
*   @param {Number} opts.strength
*/



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

  return new THREE.MeshBasicMaterial({
    color: createRGBString(color),
    transparent: true,
    opacity: color.alpha()
  });
};

function createRGBString(color) {
  return `rgb(${Math.round( color.rgb()[0] )},${Math.round( color.rgb()[1] )},${Math.round( color.rgb()[2] )})`
}



ConnectingLine.prototype.createMesh = function(opts) {
  var geometry = new THREE.Geometry();

  // To enable us to update vertex coordinates of the geometry
  // https://github.com/mrdoob/three.js/issues/1091#issuecomment-3468124
  geometry.dynamic = true

  geometry.vertices.push(this.pointA.mesh.position);
  geometry.vertices.push(this.pointB.mesh.position);

  var line = new THREE.Line(geometry, this.createMaterial(opts.strength))
  return line
};

ConnectingLine.prototype.updateVertices = function() {
  this.mesh.geometry.verticesNeedUpdate = true
};
