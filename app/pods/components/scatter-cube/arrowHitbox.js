export default function arrowHitbox (opts) {
  var arrowType = opts.arrowType
  var rotation = opts.rotation
  var position = opts.position

  var hitboxMaterial = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0x7FFF00,
    transparent: true,
    // visible: false,
    side: THREE.DoubleSide,
    opacity: 0.5,
  });


  var matrix = new THREE.Matrix4()
  var quaternion = new THREE.Quaternion()
  quaternion.setFromEuler( rotation, false );
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)




  // if (arrowType === 'cornerArrows')  {
    var geometry = new THREE.PlaneGeometry(1/8, 1/4, 4, 4);
    var mesh = new THREE.Mesh(geometry, hitboxMaterial)
    mesh.applyMatrix(matrix)
    return mesh
  // } else if (arrowType === 'sideArrows') {
    // console.log('side')
    // return undefined
  // }
}