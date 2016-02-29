export default function DangerZone(opts) {
  this.mesh = this.createMesh(opts.geometry)
  this.mesh.name = 'dangerZone'
}

DangerZone.prototype.createMesh = function(geometry) {
  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xFF2143,
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.5,
  });
  var dangerZone = new THREE.Mesh(geometry, material)

  var mS = (new THREE.Matrix4()).identity(); // http://stackoverflow.com/a/19632221/5522700
  //set -1 to the corresponding axis
  // mS.elements[10] = -1;
  // mS.elements[0] = -1;
  mS.elements[5] = -1;

  dangerZone.applyMatrix(mS);

  dangerZone.position.set(0,2,2)


  return dangerZone
};