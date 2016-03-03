import Label from './label'

export default function LabelGroup (opts) {
  this.objLoader = new THREE.ObjectLoader()
  this.scene = opts.scene

  this.labels = []

}

LabelGroup.prototype.createLabels = function(opts) {
  var self = this
  this.objLoader.load("./assets/geometries/labels.json", function (labelScene) {
    for (var i = 0; i < 9; i++) {
      var child = labelScene.children[0]
      child.material = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: false // makes the labels render in front of the danger zone
      });

      var label = new Label({
        mesh: child,
        name: child.name
      })
      self.labels.push(label)
      self.scene.add(label.mesh)
    }
    self.animateLabels(opts.initialQuadrant)
  })
};

LabelGroup.prototype.animateLabels = function(quadrant) {
  _.forEach(this.labels, function (label) {
    label.updateLocation(quadrant)
  })
};

