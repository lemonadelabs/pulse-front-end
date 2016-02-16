export default function SHPointClickTarget (opts) {
  // this.weeks = opts.weeks
  this.snapshots = opts.snapshots
  this.id = opts.id
  this.name = opts.name
  this.image = opts.image
  this.organisation = opts.organisation
  this.role = opts.role
  this.tags = opts.tags
  this.curveLocation = 1

  this.curve = this.createCurve()
  this.mesh = this.createMesh(opts.timeFrame)
}

SHPointClickTarget.prototype.createCurve = function() {
  var snapshots = this.snapshots
  var points = []

  snapshots.forEach(function (snapshot) {
    var x = snapshot.get('power') * 1.8  + 0.1
    var y = snapshot.get('support') * 1.8  + 0.1
    var z = snapshot.get('vital') * 1.8  + 0.1
    points.push( new THREE.Vector3( x, y, z ) )
  })
  return new THREE.CatmullRomCurve3( points )
};

SHPointClickTarget.prototype.createMesh = function(noOfWeeks) {
  var matrix = new THREE.Matrix4();

  var geometry = new THREE.SphereGeometry(400, 6, 6);

  // sets the scale for each mesh
  var scale = new THREE.Vector3(0.00008,0.00008,0.00008);
  matrix.scale(scale)

  // transform the geometry
  geometry.applyMatrix(matrix)

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    visible: true
    // visible: false
  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  var x = this.snapshots.objectAt(noOfWeeks - 1).get('power') * 1.8  + 0.1
  var y = this.snapshots.objectAt(noOfWeeks - 1).get('support') * 1.8  + 0.1
  var z = this.snapshots.objectAt(noOfWeeks - 1).get('vital') * 1.8  + 0.1

  point.position.set(x, y, z)


  return point
}