export default function environmentLoadAnimation() {
  var self = this

  if (this.stillToLoad.length === 0) { // if all meshes are loaded
    self.fps.runFunctionAtFps({
      toRun : loadFxn.bind(this),
    })
  }
}

function loadFxn () {
  var self = this

  var tweens = []

  this.component.set('loaded', true);

  // loop through meshes to be faded in
  _.forEach(this.fadeInOnLoad, function (mesh) {
    var destinationOpacity = mesh.material.opacity // this is the opacity the material is instatiated with
    var destinationTransparency = mesh.material.transparent // this is the transparency the material is instatiated with

    mesh.material.opacity = 0
    var proxy = {opacity: 0} // some materials throw warnings when their properties are tweened directly. This proxy solves that.
    var tween = new TWEEN.Tween(proxy)
    .to( { opacity : destinationOpacity }, 300 )
    .easing(TWEEN.Easing.Linear.None)
    .onStart(function () {
      mesh.material.transparent = true // make material transparent at begining of fade
      self.addObjectToScene(mesh)
    })
    .onUpdate(function () {
      mesh.material.opacity = proxy.opacity // set property via proxy
    })
    .onComplete(function () {
      mesh.material.transparent = destinationTransparency // make material non-transparent at end of fade
    })
    tweens.push(tween)
  })
  _.forEach(tweens, function (tween) { tween.start() }) // start all tweens
}
