export default function coordsFromSnapshot (snapshot) {
  var x, y, z
  if (typeof snapshot.x === 'number') {
    x = snapshot.x * 1.8  + 0.1
    y = snapshot.y * 1.8  + 0.1
    z = snapshot.z * 1.8  + 0.1
  } else if (typeof snapshot.get('power') === 'number') {
    x = snapshot.get('power') * 1.8  + 0.1
    y = snapshot.get('support') * 1.8  + 0.1
    z = snapshot.get('vital') * 1.8  + 0.1
  }
  return new THREE.Vector3(x,y,z)
}