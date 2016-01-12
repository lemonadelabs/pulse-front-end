export default function DistributionPoint (opts) {
  // this.data = opts.data
  this.selectedStakeholder = opts.selectedStakeholder
  // this.currentWeek = opts.currentWeek

  this.mesh = this.createMesh()
}

DistributionPoint.prototype.createMesh = function() {

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
    // color: 0x42f06a
    // color: 0x42b5f0
    // color: 0xb02834
    // color: 0xff8213
    // color: 0xc900e0
    // color: 0xff0082
    color: 0xffffff

  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  // var x = (this.data.power) * 1.8  + 0.1
  // var y = (this.data.support) * 1.8  + 0.1
  // var z = (this.data.vital) * 1.8  + 0.1


  // var position = new THREE.Vector3();
  // var weekData = this.selectedStakeholder.weeks[this.currentWeek] // initialize with the same posion as the sHPoint
  // var x = (weekData.power) * 1.8  + 0.1
  // var y = (weekData.support) * 1.8  + 0.1
  // var z = (weekData.vital) * 1.8  + 0.1

  // point.position.set(x, y, z)

  point.position.copy(this.selectedStakeholder.mesh.position)

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