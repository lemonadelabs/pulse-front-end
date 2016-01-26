export default function NavArrows (opts) {

  this.arrows = []

  this.scene = opts.scene

  this.jSONloader = opts.jSONloader
  console.log(opts)

  this.domEvents = opts.domEvents

  this.coords = {
    // (power, support , vital)
    VitalHiLoPowerLeft : new THREE.Vector3(-0.3,-0.2,2),
    VitalHiLoPowerRight : new THREE.Vector3(0,-0.2,2.3),

    PowerHiHiVitalLeft : new THREE.Vector3(2,-0.2,2.3),
    PowerHiHiVitalRight : new THREE.Vector3(2.3, -0.2, 2),
  }

  this.rotation = {
    VitalHiLoPowerLeft : - Math.PI / 4,
    VitalHiLoPowerRight : - Math.PI / 4,

    PowerHiHiVitalLeft : Math.PI / 4,
    PowerHiHiVitalRight : Math.PI / 4,
  }

  this.navControlls = {
    VitalHiLoPowerLeft: function () {
      opts.navController.vitalXsupportOrthographicLoHo()
    },
    VitalHiLoPowerRight : function () {
      opts.navController.powerXsupportOrthographicLoHi()
    },

    PowerHiHiVitalLeft : function () {
      opts.navController.powerXsupportOrthographicLoHi()
    },
    PowerHiHiVitalRight : function () {
      opts.navController.vitalXsupportOrthographicHiLo()
    },

  }

  this.VitalHiLoPowerLeft = this.createCornerArrow({
    name : 'VitalHiLoPowerLeft'
  })
  this.VitalHiLoPowerRight = this.createCornerArrow({
    name : 'VitalHiLoPowerRight'
  })


  this.PowerHiHiVitalLeft = this.createCornerArrow({
    name : 'PowerHiHiVitalLeft'
  })
  this.PowerHiHiVitalRight = this.createCornerArrow({
    name : 'PowerHiHiVitalRight'
  })




}


NavArrows.prototype.createCornerArrow = function(opts) {
  var self = this
  var name = opts.name

  console.log(name)

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    transparent: true,
    side: THREE.DoubleSide
    // opacity: 0,
    // depthTest: false // makes the labels render in front of the danger zone
  });

    self.jSONloader.load('./assets/geometries/rotationArrowFlat.json', function (geometry) {
      var geometry = new THREE.PlaneGeometry(0.2, 0.05, 1, 1) // this is where we will user the objectLoader
      var arrow = new THREE.Mesh(geometry, material)

      arrow.position.set( self.coords[name].x, self.coords[name].y, self.coords[name].z )

      arrow.rotateY(self.rotation[name])

      self.scene.add(arrow)

      self.domEvents.addEventListener(arrow, 'click', function(){
        self.navControlls[name]()
      }, false)

    })








  // var mesh = new THREE.Mesh(geometry, material)





};

NavArrows.prototype.CreateSideArrow = function(opts) {
  var name = opts.name
  var coords = this.coords[name]
};


