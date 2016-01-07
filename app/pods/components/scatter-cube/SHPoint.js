export default function SHPoint (opts) {
  this.weeks = opts.weeks,

  this.mesh = this.createMesh(opts.timeFrame)
}

SHPoint.prototype.updateColor = function(cameraPosition) {

  var distance = cameraPosition.distanceTo(this.mesh.position)
  var decimal = distance/6
  // console.log()
  this.mesh.material.opacity = decimal * -1 + 1

};

SHPoint.prototype.createMesh = function(noOfWeeks) {
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

  // sets the position for each mesh
  var position = new THREE.Vector3();
  var x = (this.weeks[noOfWeeks].power) * 1.8  + 0.1
  var y = (this.weeks[noOfWeeks].support) * 1.8  + 0.1
  var z = (this.weeks[noOfWeeks].vital) * 1.8  + 0.1

  point.position.set(x, y, z)

  return point
}

SHPoint.prototype.animate = function(week) {
  var x = (this.weeks[week].power) * 1.8  + 0.1
  var y = (this.weeks[week].support) * 1.8  + 0.1
  var z = (this.weeks[week].vital) * 1.8  + 0.1

  var self = this
  var xTween = new TWEEN.Tween(this.mesh.position)
      .to({x: x, y: y, z: z}, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
}