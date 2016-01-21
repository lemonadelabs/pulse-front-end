import DollyZoom from './dollyZoom';

export default function AutoNav (opts) {
  this.environment = opts.environment

  this.dollyZoom = this.initDollyZoom()
}

AutoNav.prototype.initDollyZoom = function() {
  var self = this

  return new DollyZoom({
    camera : self.environment.camera,
    controls : self.environment.controls,
  })
};

AutoNav.prototype.powerXsupport = function() {
  this.dollyZoom.zoomOut({
    z: 1500,

  })

}


