export default function arrowHitbox (opts) {
  var arrowType = opts.arrowType
  var rotation = opts.rotation
  var position = opts.position

  var matrix = new THREE.Matrix4()
  var quaternion = new THREE.Quaternion()
  quaternion.setFromEuler( rotation, false );
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)

  if (arrowType === 'cornerArrows')  {
    var geometry = new THREE.PlaneGeometry(1/8, 1/4, 4, 4);
    var mesh = new THREE.Mesh(geometry, opts.material)
    mesh.applyMatrix(matrix)
    return mesh
  } else if (arrowType === 'sideArrows') {
    var geometry = new THREE.PlaneGeometry(0.08, 0.29, 4, 4);
    var mesh = new THREE.Mesh(geometry, opts.material)
    mesh.applyMatrix(matrix)
    return mesh
  }
}