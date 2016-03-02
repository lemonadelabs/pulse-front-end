import coordsFromSnapshot from './services/coordsFromSnapshot';

export default function SHPoint (opts) {
  this.focused = true
  this.id = opts.id
  this.mesh = this.createMesh(opts)
}

SHPoint.prototype.createMesh = function(opts) {
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.SphereGeometry(150, 8, 8);
  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)

  // transform the geometry
  geometry.applyMatrix(matrix)

  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 1,
    shading: THREE.FlatShading,
    color: 0x4AE3C4
  });

  var point = new THREE.Mesh( geometry, material );

  var snapshot = opts.snapshots.objectAt(opts.selectedTime - 1)

  point.position.copy(coordsFromSnapshot(snapshot))

  return point
}

SHPoint.prototype.updateColor = function(opts) {

  if (this.defocused) {
    this.mesh.material.opacity = 0.08
  } else {
    var distanceCameraSHPoint = opts.cameraPosition.distanceTo(this.mesh.position)

    var distanceCameraCenter = opts.cameraPosition.distanceTo(opts.controlsTarget) // between 1.7 and 5

    var cameraZoom = distanceCameraCenter - 1.7 // between 0 and 3.3

    var normalisedSHPointDistance = distanceCameraSHPoint - cameraZoom

    var zeroOneFloat = (normalisedSHPointDistance - 0.14) / 3.1188

    zeroOneFloat = zeroOneFloat * -1 + 1 // reverse direction of float
    zeroOneFloat = zeroOneFloat * 0.7 + 0.3 // limit the range

    this.mesh.material.opacity = zeroOneFloat
  }



};