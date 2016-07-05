export default function arrowHitbox (opts) {
  var arrowType = opts.arrowType
  var rotation = opts.rotation
  var position = opts.position

  var matrix = new THREE.Matrix4()
  var quaternion = new THREE.Quaternion()
  quaternion.setFromEuler( rotation, false );
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)

  var geometry, mesh
  if (arrowType === 'cornerArrows')  {
    geometry = new THREE.PlaneGeometry(0.15, 1/4, 4, 4);
    mesh = new THREE.Mesh(geometry, opts.material)
    mesh.applyMatrix(matrix)
    return mesh
  } else if (arrowType === 'sideArrows') {
    geometry = new THREE.PlaneGeometry(0.13, 0.3, 4, 4);
    mesh = new THREE.Mesh(geometry, opts.material)
    mesh.applyMatrix(matrix)
    return mesh
  }
}