import Label from './label'

export default function LabelGroup (opts) {
  this.objLoader = new THREE.ObjectLoader()
  this.scene = opts.scene
  this.camera = opts.camera

  this.labels = []
  this.quadrant = null

  this.prevQuadrant = undefined

}

LabelGroup.prototype.createLabels = function() {
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
  })
};

LabelGroup.prototype.initLocation = function(quadrant) {
  _.forEach(this.labels, function (label) {
    label.initLocation(quadrant)
  })
};

LabelGroup.prototype.animateLabels = function(quadrant) {
  var self = this
  _.forEach(this.labels, function (label) {
    label.updateLocation(quadrant)
  })
};

