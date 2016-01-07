export default function AxisGuideLine (opts) {

  this.mesh = this.createMesh(opts)
}

AxisGuideLine.prototype.createMesh = function(opts) {

  var geometry = new THREE.Geometry();

  _.forEach(opts.vertices, function (vert) {
    geometry.vertices.push(vert);
  })

  var line = new THREE.Line(geometry, opts.material)
  return line
};