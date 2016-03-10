export default function environmentLoadAnimation() {
  var self = this
  if (_.isEmpty(this.stillToLoad)) {

    self.fps.runFunctionAtFps({
      toRun : loadFxn.bind(this),
      targetFramerate : 70
    })

    function loadFxn () {
      var tweens = []
      _.forEach(this.fadeInOnLoad, function (mesh) {
        var destinationOpacity = mesh.material.opacity
        var destinationTransparency = mesh.material.transparent

        mesh.material.opacity = 0
        var counter = {opacity: 0}
        var tween = new TWEEN.Tween(counter)
        .to( { opacity : destinationOpacity }, 300 )
        .easing(TWEEN.Easing.Linear.None)
        .onStart(function () {
          mesh.material.transparent = true
          self.addObjectToScene(mesh)
        })
        .onUpdate(function () {
          mesh.material.opacity = counter.opacity
        })
        .onComplete(function () {
          mesh.material.transparent = destinationTransparency
        })
        tweens.push(tween)
      })
      _.forEach(tweens, function (tween) { tween.start() })
    }
  }
}
