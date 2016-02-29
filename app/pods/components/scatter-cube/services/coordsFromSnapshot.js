export default function coordsFromSnapshot (snapshot) {
  var x = snapshot.get('power') * 1.8  + 0.1
  var y = snapshot.get('support') * 1.8  + 0.1
  var z = snapshot.get('vital') * 1.8  + 0.1
  return new THREE.Vector3(x,y,z)
}