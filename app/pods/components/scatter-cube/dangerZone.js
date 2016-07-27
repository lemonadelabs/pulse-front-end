export default function DangerZone(opts) {
  this.mesh = this.createMesh(opts.geometry)
  this.mesh.name = 'dangerZone'
}

DangerZone.prototype.createMesh = function(geometry) {
  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xFF2143,
    side: THREE.FrontSide,
    transparent: true,
    opacity: 0.5,
  });
  var dangerZone = new THREE.Mesh(geometry, material)

  // Blenders coordinate system is different to three.js, resulting in a geometry that is flipped.
  // the following code is to turn the geom into a mirror image of itself
  // http://stackoverflow.com/a/19632221/5522700
  var mS = (new THREE.Matrix4()).identity();
  //set -1 to the corresponding axis
  // mS.elements[10] = -1;
  // mS.elements[0] = -1;
  mS.elements[5] = -1;

  dangerZone.applyMatrix(mS);

  dangerZone.position.set(0,2,2)


  return dangerZone
};