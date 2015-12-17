export default function Target (opts) {
  this.mesh = this.createMesh(opts.geometry)
}

Target.prototype.createMesh = function(geometry) {
  var material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
  var mesh = new THREE.Mesh(geometry, material)
  mesh.visible = false
  return mesh
};

Target.prototype.updatePosition = function(sHPoint) {
  console.log(sHPoint)
  this.mesh.position.copy(sHPoint.mesh.position)
  this.mesh.visible = true
};