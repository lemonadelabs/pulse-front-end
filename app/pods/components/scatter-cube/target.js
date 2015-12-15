export default function Target (opts) {
  this.jSONloader = opts.jSONloader
  this.scene = opts.scene

  this.mesh = this.createMesh()
}

Target.prototype.createMesh = function() {
  var self = this
  this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry, mat) {

    var material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
    var target = new THREE.Mesh(geometry, material)

    self.scene.add(target)
    console.log(target)
    // target.position.set(0,0,0)

  })

};