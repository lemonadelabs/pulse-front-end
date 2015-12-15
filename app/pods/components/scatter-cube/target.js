export default function Target (opts) {
  this.jSONloader = opts.jSONloader
  this.scene = opts.scene

  this.mesh = this.createMesh()
}

Target.prototype.createMesh = function() {
  var target = 'asdf'
  var self = this
  this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry, mat) {

    var material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
    target = new THREE.Mesh(geometry, material)

    // self.scene.add(target)
    // target.position.set(0,0,0)

    return target
  })

};