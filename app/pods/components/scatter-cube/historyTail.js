export default function HistoryTail (opts) {
  this.sHPoint = opts.sHPoint

  this.mesh = this.createMesh()
}

HistoryTail.prototype.createMesh = function() {

  var curve = this.sHPoint.curve // path information is stored in the sHPointClickTarget

  var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    shading: THREE.FlatShading,
    color: 0x1f6054,
    transparent : true,
    opacity : 0
  })

  var taper = function ( u ) { return u }

  var tube = new THREE.TubeGeometry(curve, 100, 0.012, 8, false, taper );
  var tubeObject = new THREE.Mesh(tube, material)

  return tubeObject
}