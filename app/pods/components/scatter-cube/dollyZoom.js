export default function DollyZoom (opts) {
  this.camera = opts.camera

  this.controls = opts.controls
  this.tweenIncrementors = {}

}

DollyZoom.prototype.zoomOut = function(opts) {

  var self = this

  var camera = this.camera

  var zDestination = opts.z
  this.tweenIncrementors.zPosition = camera.position.z // make tween start at initial camera z

  var tween = new TWEEN.Tween(self.tweenIncrementors)
      .to( {
        zDestination : zDestination
      }, 3000)
      .easing(TWEEN.Easing.Exponential.In)
      .onUpdate(function () {
        camera.position.set(1,1,(self.tweenIncrementors.zPosition ))
        var fov = self.zToFov(self.tweenIncrementors.zPosition/10)

        camera.fov = fov;
        camera.updateProjectionMatrix()
      })
      .start();





};

DollyZoom.prototype.zToFov = function(fovZ) {
  var camera = this.camera
  return 2 * Math.atan2( 1, 2 * camera.aspect * fovZ ) * ( 180 / Math.PI )
};

// function zToFov() {
//   var camera = this.camera
//   return 2 * Math.atan2( 1, 2 * camera.aspect * fovZ ) * ( 180 / Math.PI )
// }

function fovToZ() {
}
