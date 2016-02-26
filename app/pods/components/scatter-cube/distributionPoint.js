export default function DistributionPoint (opts) {
  this.destination = new THREE.Vector3(opts.vote.power, opts.vote.support, opts.vote.vital)
  this.mesh = this.createMesh(opts)
}

DistributionPoint.prototype.createMesh = function(opts) {
  var matrix = new THREE.Matrix4();
  var geometry = new THREE.SphereGeometry(150, 8, 8);
  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)
  // transform the geometry
  geometry.applyMatrix(matrix)
  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.5,
    shading: THREE.FlatShading,
    color: 0xffffff
  });
  var point = new THREE.Mesh( geometry, material );
  point.position.copy(opts.sHPoint.mesh.position)

  return point
};

DistributionPoint.prototype.updateColor = function(cameraPosition) {

  var distanceCameraSHPoint = cameraPosition.distanceTo(this.mesh.position)

  var center = new THREE.Vector3(1,1,1)

  var distanceCameraCenter = cameraPosition.distanceTo(center) // between 1.7 and 5

  var cameraZoom = distanceCameraCenter - 1.7 // between 0 and 3.3

  var normalisedSHPointDistance = distanceCameraSHPoint - cameraZoom

  var zeroOneFloat = (normalisedSHPointDistance - 0.14) / 3.1188

  zeroOneFloat = zeroOneFloat * -1 + 1 // reverse direction of float
  zeroOneFloat = zeroOneFloat * 0.7 + 0.3 // limit the range

  this.mesh.material.opacity = zeroOneFloat

};