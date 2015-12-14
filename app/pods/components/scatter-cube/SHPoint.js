export default function SHPoint (opts) {
  this.power = opts.power,
  this.support = opts.support,
  this.vital = opts.vital,
  this.name = opts.name,
  this.image = opts.image,
  this.company = opts.company,
  this.role = opts.role,
  this.tags = opts.tags,

  this.mesh = this.createMesh()
}

SHPoint.prototype.createMesh = function() {
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.SphereGeometry(150, 8, 8);

  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)

  // transform the geometry
  geometry.applyMatrix(matrix)

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0x4AE3C4
  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  var position = new THREE.Vector3();
  var x = (this.power) * 1.8  + 0.1
  var y = (this.support) * 1.8  + 0.1
  var z = (this.vital) * 1.8  + 0.1

  point.position.set(x, y, z)

  return point
};

SHPoint.prototype.animate = function() {
  var x = (this.power) * 1.8  + 0.1
  var y = (this.support) * 1.8  + 0.1
  var z = (this.vital) * 1.8  + 0.1

  var self = this
  var xTween = new TWEEN.Tween(this.mesh.position)
      .to({x: x, y: y, z: z}, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();
};