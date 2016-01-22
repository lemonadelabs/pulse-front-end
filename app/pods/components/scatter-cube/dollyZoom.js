export default function DollyZoom (opts) {
  this.camera = opts.camera

  this.controls = opts.controls
  this.tweenIncrementors = {}

}

DollyZoom.prototype.zoomOut = function(opts) {

  var self = this

  var camera = this.camera

  var initialPosition = camera.position.clone()
  var camDestination = opts.camDestination
  var focalPoint = new THREE.Vector3(1,1,2)
  this.initialFOV = camera.fov

  this.tweenIncrementors.cameraPosition = {
    x : initialPosition.x,
    y : initialPosition.y,
    z : initialPosition.z
  }  // make tween start at initial camera z


  var tween = new TWEEN.Tween(self.tweenIncrementors.cameraPosition)
      .to( {
        x : camDestination.x,
        y : camDestination.y,
        z : camDestination.z
      }, 10000)
      .easing(TWEEN.Easing.Exponential.In)
      .onStart( function () {console.log(camera.fov)})
      .onUpdate(function () {


        var x = self.tweenIncrementors.cameraPosition.x
        var y = self.tweenIncrementors.cameraPosition.y
        var z = self.tweenIncrementors.cameraPosition.z
        // camera.position.set(x,y,z)

        // find the distance between initial point and the current tween point
        // var distance = (camera.position.distanceTo(focalPoint))
        var distance = (initialPosition.distanceTo(focalPoint))
        var fov = self.zToFov(distance/10)

        var zOffset = self.convertFovToZ(fov) * 10
        console.log(zOffset)

        var distance = (camera.position.distanceTo(initialPosition) + zOffset)
        var fov = self.zToFov(distance/10)

        // var distance = (initialPosition.distanceTo(focalPoint))
        // put this into the fov function


        camera.fov = fov;
        camera.updateProjectionMatrix()

      })
      .start();





};

DollyZoom.prototype.zToFov = function(distance) {
  var camera = this.camera
  return 2 * Math.atan2( 1, 2 * camera.aspect * distance ) * ( 180 / Math.PI )
  // return 2 * Math.atan2( 1, 2 * camera.aspect * distance ) * ( this.initialFOV )
};

DollyZoom.prototype.convertFovToZ = function(fov) {
  var camera = this.camera
  return 1 / ( 2 * camera.aspect * Math.tan(fov / 2 * ( Math.PI / 180 ) ) );
};

// function zToFov() {
//   var camera = this.camera
//   return 2 * Math.atan2( 1, 2 * camera.aspect * fovZ ) * ( 180 / Math.PI )
// }

function fovToZ() {
}
