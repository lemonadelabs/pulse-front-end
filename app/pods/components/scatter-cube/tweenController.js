export default function TweenController (opts) {
  this.environment = opts.environment
}

TweenController.prototype.distroCloudBirth = function(currentWeek) {
  var self = this

  var points = this.environment.distributionCloud.distributionPoints

  var data = self.environment.distributionCloud.data[currentWeek]

  for (var i = 0; i < points.length; i++) {
    var x = (data[i].power) * 1.8  + 0.1
    var y = (data[i].support) * 1.8  + 0.1
    var z = (data[i].vital) * 1.8  + 0.1

    var xTween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      // .onUpdate(function () {
      // })
      // .onComplete(function () {
      // })
      .start();
  };
};