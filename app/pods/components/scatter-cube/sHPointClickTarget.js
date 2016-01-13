export default function SHPointClickTarget (opts) {
  this.weeks = opts.weeks,
  this.id = opts.id,
  this.name = opts.name,
  this.image = opts.image,
  this.organisation = opts.organisation,
  this.role = opts.role,
  this.tags = opts.tags,

  this.mesh = this.createMesh(opts.timeFrame)
}

SHPointClickTarget.prototype.createMesh = function(noOfWeeks) {
  var self = this
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.SphereGeometry(400, 6, 6);

  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)

  // transform the geometry
  geometry.applyMatrix(matrix)

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0x4AE3C4,
    visible: false
  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  var position = new THREE.Vector3();
  var x = (this.weeks[noOfWeeks].power) * 1.8  + 0.1
  var y = (this.weeks[noOfWeeks].support) * 1.8  + 0.1
  var z = (this.weeks[noOfWeeks].vital) * 1.8  + 0.1

  point.position.set(x, y, z)


  return point
}