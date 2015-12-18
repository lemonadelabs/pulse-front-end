export default function SHPointClickTarget (opts) {
  this.weeks = opts.weeks,
  this.id = opts.id,
  this.name = opts.name,
  this.image = opts.image,
  this.organisation = opts.organisation,
  this.role = opts.role,
  this.tags = opts.tags,
  this.lineGroup = opts.lineGroup,
  this.environment = opts.environment,

  this.mesh = this.createMesh()
}

SHPointClickTarget.prototype.createMesh = function() {
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.SphereGeometry(400, 6, 6);

  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)

  // transform the geometry
  geometry.applyMatrix(matrix)

  var material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    shading: THREE.FlatShading,
    color: 0x4AE3C4
  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  var position = new THREE.Vector3();
  var x = (this.weeks[1].power) * 1.8  + 0.1
  var y = (this.weeks[1].support) * 1.8  + 0.1
  var z = (this.weeks[1].vital) * 1.8  + 0.1

  point.position.set(x, y, z)

  return point
}

SHPointClickTarget.prototype.animate = function(week) {
  var x = (this.weeks[week].power) * 1.8  + 0.1
  var y = (this.weeks[week].support) * 1.8  + 0.1
  var z = (this.weeks[week].vital) * 1.8  + 0.1

  var self = this
  var xTween = new TWEEN.Tween(this.mesh.position)
      .to({x: x, y: y, z: z}, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function () {
        self.lineGroup.needsUpdate = true // make the lines follow the points
        if (self.environment.focussedPoint) { self.environment.target.updatePosition(self.environment.focussedPoint) } // make the target follow the point
      })
      .onComplete(function () {
        self.lineGroup.needsUpdate = false
      })
      .start();
}