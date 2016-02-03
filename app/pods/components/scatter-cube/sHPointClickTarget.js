export default function SHPointClickTarget (opts) {
  this.weeks = opts.weeks
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
  var data = this.weeks
  var points = []

  _.forEach(data, function (point) {
    var x = point.power * 1.8  + 0.1
    var y = point.support * 1.8  + 0.1
    var z = point.vital * 1.8  + 0.1
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
    visible: false
  });

  var point = new THREE.Mesh( geometry, material );

  // sets the position for each mesh
  var x = this.weeks[noOfWeeks].power * 1.8  + 0.1
  var y = this.weeks[noOfWeeks].support * 1.8  + 0.1
  var z = this.weeks[noOfWeeks].vital * 1.8  + 0.1

  point.position.set(x, y, z)


  return point
}