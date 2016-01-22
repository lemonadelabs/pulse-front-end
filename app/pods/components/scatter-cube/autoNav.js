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
    camDestination: new THREE.Vector3(1,1,1504.2)
  })

}


