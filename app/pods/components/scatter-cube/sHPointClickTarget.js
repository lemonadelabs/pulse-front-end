import coordsFromSnapshot from './services/coordsFromSnapshot';

export default function SHPointClickTarget (opts) {

  this.snapshots = opts.snapshots
  this.id = opts.id
  this.name = opts.name
  this.image = opts.image
  this.organisation = opts.organisation
  this.role = opts.role
  this.tags = opts.tags
  this.curveLocation = 1

  this.curve = this.createCurve()
  this.mesh = this.createMesh(opts)
}

SHPointClickTarget.prototype.createCurve = function() {
  var snapshots = this.snapshots
  var points = []

  snapshots.forEach(function (snapshot) {
    points.push( coordsFromSnapshot(snapshot) )
  })
  return new THREE.CatmullRomCurve3( points )
};

SHPointClickTarget.prototype.createMesh = function(opts) {
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

  var snapshot = opts.snapshots.objectAt(opts.selectedTime - 1)

  point.position.copy(coordsFromSnapshot(snapshot))

  return point
}

