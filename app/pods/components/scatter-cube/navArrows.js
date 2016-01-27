export default function NavArrows (opts) {

  this.arrows = []

  this.scene = opts.scene

  this.jSONloader = opts.jSONloader
  console.log(opts)

  this.domEvents = opts.domEvents

  this.coords = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft : new THREE.Vector3(0.1,-0.22,1.9),
    vitalHiLoPowerRight : new THREE.Vector3(0.1,-0.22,1.9),

    powerHiHiVitalLeft : new THREE.Vector3(2,-0.22,2),
    powerHiHiVitalRight : new THREE.Vector3(2, -0.22, 2),

    vitalLoHiPowerLeft : new THREE.Vector3(2, -0.22, 0),
    vitalLoHiPowerRight : new THREE.Vector3(2, -0.22, 0),

    powerLoLovitalLeft : new THREE.Vector3(0, -0.22, 0),
    powerLoLovitalRight : new THREE.Vector3(0, -0.22, 0),
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    // (power, support , vital)
    sidePowerHiLoSupportLeft : new THREE.Vector3(1.2, -0.3, 0),
    sidePowerHiLoSupportRight : new THREE.Vector3(0.8, -0.3, 0),

    sideVitalLoHiSupportLeft : new THREE.Vector3(0, -0.3, 1.2),
    sideVitalLoHiSupportRight : new THREE.Vector3(0, -0.3, 0.8),

    sidePowerLoHiSupportLeft : new THREE.Vector3(0.8, -0.3, 2),
    sidePowerLoHiSupportRight : new THREE.Vector3(1.2, -0.3, 2),
  }

  this.rotation = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft : - Math.PI / 2,
    vitalHiLoPowerRight : - Math.PI / 2,

    powerHiHiVitalLeft : 0,
    powerHiHiVitalRight : 0,

    vitalLoHiPowerLeft : Math.PI / 2,
    vitalLoHiPowerRight : Math.PI / 2,

    powerLoLovitalLeft : Math.PI,
    powerLoLovitalRight : Math.PI,

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    sidePowerHiLoSupportLeft : Math.PI,
    sidePowerHiLoSupportRight : 0,

    sideVitalLoHiSupportLeft : Math.PI / 2,
    sideVitalLoHiSupportRight : -Math.PI / 2,

    sidePowerLoHiSupportLeft : 0,
    sidePowerLoHiSupportRight : Math.PI,
  }

  this.navControlls = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft: function () { opts.navController.vitalXsupportOrthographicLoHo() },
    vitalHiLoPowerRight : function () { opts.navController.powerXsupportOrthographicLoHi() },

    powerHiHiVitalLeft : function () { opts.navController.powerXsupportOrthographicLoHi() },
    powerHiHiVitalRight : function () { opts.navController.vitalXsupportOrthographicHiLo() },

    vitalLoHiPowerLeft : function () { opts.navController.vitalXsupportOrthographicHiLo() },
    vitalLoHiPowerRight : function () { opts.navController.powerXsupportOrthographicHiLo() },

    powerLoLovitalLeft : function () { opts.navController.powerXsupportOrthographicHiLo() },
    powerLoLovitalRight : function () { opts.navController.vitalXsupportOrthographicLoHo() },
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    sidePowerHiLoSupportLeft : function () { opts.navController.vitalXpowerPerspectiveLoHi() },
    sidePowerHiLoSupportRight : function () { opts.navController.powerXvitalPerspectiveLoLo() },

    sideVitalLoHiSupportLeft : function () { opts.navController.vitalXpowerPerspectiveHiLo() },
    sideVitalLoHiSupportRight : function () { opts.navController.powerXvitalPerspectiveLoLo() },

    sidePowerLoHiSupportLeft : function () { opts.navController.powerXvitalPerspectiveHiHi() },
    sidePowerLoHiSupportRight : function () { opts.navController.vitalXpowerPerspectiveHiLo() },

  }
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// corners /////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  this.vitalHiLoPowerLeft = this.createCornerArrow({ name : 'vitalHiLoPowerLeft' })
  this.vitalHiLoPowerRight = this.createCornerArrow({ name : 'vitalHiLoPowerRight' })

  this.powerHiHiVitalLeft = this.createCornerArrow({ name : 'powerHiHiVitalLeft' })
  this.powerHiHiVitalRight = this.createCornerArrow({ name : 'powerHiHiVitalRight' })

  this.vitalLoHiPowerLeft = this.createCornerArrow({ name : 'vitalLoHiPowerLeft' })
  this.vitalLoHiPowerRight = this.createCornerArrow({ name : 'vitalLoHiPowerRight' })

  this.powerLoLovitalLeft = this.createCornerArrow({ name : 'powerLoLovitalLeft' })
  this.powerLoLovitalRight = this.createCornerArrow({ name : 'powerLoLovitalRight' })
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// sides //////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  this.sidePowerHiLoSupportLeft = this.createCornerArrow({ name : 'sidePowerHiLoSupportLeft' })
  this.sidePowerHiLoSupportRight = this.createCornerArrow({ name : 'sidePowerHiLoSupportRight' })

  this.sideVitalLoHiSupportLeft = this.createCornerArrow({ name : 'sideVitalLoHiSupportLeft' })
  this.sideVitalLoHiSupportRight = this.createCornerArrow({ name : 'sideVitalLoHiSupportRight' })

  sidePowerLoHiSupportLeft : this.createCornerArrow({ name : 'sidePowerLoHiSupportLeft' })
  sidePowerLoHiSupportRight : this.createCornerArrow({ name : 'sidePowerLoHiSupportRight' })

}


// NavArrows.prototype.createSideArrows = function(opts) {
//   var self = this
//   var name = opts.name

//   var material = new THREE.MeshBasicMaterial({
//     shading: THREE.FlatShading,
//     color: 0xffffff,
//     transparent: true,
//     side: THREE.DoubleSide
//     // opacity: 0,
//     // depthTest: false // makes the labels render in front of the danger zone
//   });

//   var path = './assets/geometries/rotationArrowFlat.json'

//   self.jSONloader.load(path, function (geometry) {
//     // var geometry = new THREE.PlaneGeometry(0.2, 0.05, 1, 1) // this is where we will user the objectLoader

//     // geometry.scale(0.7,0.7,0.7)

//     var arrow = new THREE.Mesh(geometry, material)

//     arrow.position.set( self.coords[name].x, self.coords[name].y, self.coords[name].z )


//     arrow.rotateY(self.rotation[name])

//     self.scene.add(arrow)

//     self.domEvents.addEventListener(arrow, 'click', function(){
//       self.navControlls[name]()
//     }, false)
// };

NavArrows.prototype.createCornerArrow = function(opts) {
  var self = this
  var name = opts.name

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    transparent: true,
    side: THREE.DoubleSide
    // opacity: 0,
    // depthTest: false // makes the labels render in front of the danger zone
  });

  var path = ( _.endsWith(name, 'Left')) ? './assets/geometries/rotationArrowsLeft.json' :  './assets/geometries/rotationArrowsRight.json' ;
  if (_.startsWith(name, 'side')) {
    path = './assets/geometries/rotationArrowFlat.json'
  }

  self.jSONloader.load(path, function (geometry) {
    // var geometry = new THREE.PlaneGeometry(0.2, 0.05, 1, 1) // this is where we will user the objectLoader

    // geometry.scale(0.7,0.7,0.7)

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


