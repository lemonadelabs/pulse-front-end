export default function NavArrows (opts) {

  this.sideArrows = []
  this.cornerArrows = []

  this.scene = opts.scene

  this.jSONloader = opts.jSONloader

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

    sideVitalHiLoSupportLeft : new THREE.Vector3(2, -0.3, 1.2),
    sideVitalHiLoSupportRight : new THREE.Vector3(2, -0.3, 0.8),
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

    sideVitalHiLoSupportLeft : Math.PI / 2,
    sideVitalHiLoSupportRight : -Math.PI / 2,
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

    sidePowerLoHiSupportLeft : function () { opts.navController.vitalXpowerPerspectiveHiLo() },
    sidePowerLoHiSupportRight : function () { opts.navController.powerXvitalPerspectiveHiHi() },

    sideVitalHiLoSupportLeft : function () { opts.navController.powerXvitalPerspectiveHiHi() },
    sideVitalHiLoSupportRight : function () { opts.navController.vitalXpowerPerspectiveLoHi() },

  }
  // INSTANTIATE OBJECTS
  ///////////////////////////////////////////////////////////////////////////
  ///////////////////////////////// corners /////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  this.vitalHiLoPowerLeft = this.createArrow({ name : 'vitalHiLoPowerLeft' })
  this.vitalHiLoPowerRight = this.createArrow({ name : 'vitalHiLoPowerRight' })

  this.powerHiHiVitalLeft = this.createArrow({ name : 'powerHiHiVitalLeft' })
  this.powerHiHiVitalRight = this.createArrow({ name : 'powerHiHiVitalRight' })

  this.vitalLoHiPowerLeft = this.createArrow({ name : 'vitalLoHiPowerLeft' })
  this.vitalLoHiPowerRight = this.createArrow({ name : 'vitalLoHiPowerRight' })

  this.powerLoLovitalLeft = this.createArrow({ name : 'powerLoLovitalLeft' })
  this.powerLoLovitalRight = this.createArrow({ name : 'powerLoLovitalRight' })
  ///////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// sides //////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////
  this.sidePowerHiLoSupportLeft = this.createArrow({ name : 'sidePowerHiLoSupportLeft' })
  this.sidePowerHiLoSupportRight = this.createArrow({ name : 'sidePowerHiLoSupportRight' })

  this.sideVitalLoHiSupportLeft = this.createArrow({ name : 'sideVitalLoHiSupportLeft' })
  this.sideVitalLoHiSupportRight = this.createArrow({ name : 'sideVitalLoHiSupportRight' })

  this.sidePowerLoHiSupportLeft = this.createArrow({ name : 'sidePowerLoHiSupportLeft' })
  this.sidePowerLoHiSupportRight = this.createArrow({ name : 'sidePowerLoHiSupportRight' })

  this.sideVitalHiLoSupportLeft = this.createArrow({ name : 'sideVitalHiLoSupportLeft' })
  this.sideVitalHiLoSupportRight = this.createArrow({ name : 'sideVitalHiLoSupportRight' })

}


NavArrows.prototype.createArrow = function(opts) {
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

  var arrowType
  var path
  if (_.endsWith(name, 'Left')) {
    path = './assets/geometries/rotationArrowsLeft.json'
    arrowType = 'cornerArrows'
  } else if (_.endsWith(name, 'Right')) {
    path = './assets/geometries/rotationArrowsRight.json'
    arrowType = 'cornerArrows'
  }

  if (_.startsWith(name, 'side')) {
    path = './assets/geometries/rotationArrowFlat.json'
    arrowType = 'sideArrows'
  }

  // var path = ( _.endsWith(name, 'Left')) ? './assets/geometries/rotationArrowsLeft.json' :  './assets/geometries/rotationArrowsRight.json' ;
  // if (_.startsWith(name, 'side')) {
  //   path = './assets/geometries/rotationArrowFlat.json'
  // }

  self.jSONloader.load(path, function (geometry) {
    // var geometry = new THREE.PlaneGeometry(0.2, 0.05, 1, 1) // this is where we will user the objectLoader

    // geometry.scale(0.7,0.7,0.7)

    var arrow = {}
    arrow.mesh = new THREE.Mesh(geometry, material)


    arrow.mesh.position.set( self.coords[name].x, self.coords[name].y, self.coords[name].z )

    arrow.mesh.rotateY(self.rotation[name])

    self.scene.add(arrow.mesh)

    self.domEvents.addEventListener(arrow.mesh, 'click', function(){
      self.navControlls[name]()
    }, false)

    self[arrowType].push(arrow)
  })


};


