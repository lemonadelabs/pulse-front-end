export default function NavArrowAnimator (opts) {
  this.tweens = {}
  this.cornerArrows = opts.cornerArrows


}

NavArrowAnimator.prototype.update = function(opts) {
  var self = this
  var quadrant = opts.quadrant
  var cornerArrows = this.cornerArrows
  var toFadeOut = []
  var toFadeIn = []
  _.forEach(cornerArrows, function (arrow) {
    if (arrow.quadrant !== opts.quadrant && arrow.mesh.material.visible) {
      toFadeOut.push(arrow)
    }
    if (arrow.quadrant === opts.quadrant) {
      toFadeIn.push(arrow)
    }
  })

  _.forEach(toFadeIn, function (arrow) {
    self.fadeInArrow({ arrow : arrow })
  })

  _.forEach(toFadeOut, function (arrow) {
    self.fadeOutArrow({ arrow : arrow })
  })
};

NavArrowAnimator.prototype.fadeInArrow = function(opts) {
  var self = this
  var arrow = opts.arrow
  var name = arrow.mesh.name

  var cachedTween
  if (cachedTween = self.tweens[name]) {
    cachedTween.stop()
    delete self.tweens[name]
  }

  var material = arrow.mesh.material
  // arrow.tweenCounter.opacity = material.opacity
  var fadeInTween = new TWEEN.Tween(arrow.tweenCounter)
  .to({opacity: 1.0}, 300)
  .easing(TWEEN.Easing.Exponential.In)
  .onStart(function () {
    material.transparent = true
    material.visible = true
  })
  .onUpdate(function () {
    material.opacity = arrow.tweenCounter.opacity
  })
  .onComplete(function () {
    material.transparent = false
    delete self.tweens[name]
  })
  this.tweens[name] = fadeInTween
  fadeInTween.start()
};

NavArrowAnimator.prototype.fadeOutArrow = function(opts) {
  var self = this
  var arrow = opts.arrow
  var name = arrow.mesh.name

  var cachedTween
  if (cachedTween = self.tweens[name]) {
    cachedTween.stop()
    delete self.tweens[name]
  }

  var material = arrow.mesh.material
  arrow.tweenCounter.opacity = material.opacity
  var fadeOutTween = new TWEEN.Tween(arrow.tweenCounter)
      .to({opacity: 0.0}, 250)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(function () {
        material.transparent = true
      })
      .onUpdate(function () {
        material.opacity = arrow.tweenCounter.opacity
      })
      .onComplete(function () {
        material.transparent = false
        material.visible = false
        delete self.tweens[name]
      })
  this.tweens[name] = fadeOutTween
  fadeOutTween.start();
};
