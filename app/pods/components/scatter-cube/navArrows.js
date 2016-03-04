import NavArrowAnimator from './navArrowAnimator';

export default function NavArrows (opts) {

  this.arrowsLoaded = 0
  this.initialQuadrant = opts.initialQuadrant
  this.sideArrows = []
  this.cornerArrows = []

  this.scene = opts.scene

  this.jSONloader = opts.jSONloader

  this.domEvents = opts.domEvents

  this.position = {
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
    sidePowerHiLoSupportLeft : new THREE.Vector3(1.74, -0.3, 0),
    sidePowerHiLoSupportRight : new THREE.Vector3(0.26, -0.3, 0),

    sideVitalLoHiSupportLeft : new THREE.Vector3(0, -0.3, 1.74),
    sideVitalLoHiSupportRight : new THREE.Vector3(0, -0.3, 0.26),

    sidePowerLoHiSupportLeft : new THREE.Vector3(0.26, -0.3, 2),
    sidePowerLoHiSupportRight : new THREE.Vector3(1.74, -0.3, 2),

    sideVitalHiLoSupportLeft : new THREE.Vector3(2, -0.3, 1.74),
    sideVitalHiLoSupportRight : new THREE.Vector3(2, -0.3, 0.26),
  }

  this.rotation = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft : new THREE.Euler( 0, -Math.PI / 2, 0, 'XYZ' ),
    vitalHiLoPowerRight : new THREE.Euler( 0, -Math.PI / 2, 0, 'XYZ' ),

    powerHiHiVitalLeft : new THREE.Euler( 0, 0, 0, 'XYZ' ),
    powerHiHiVitalRight : new THREE.Euler( 0, 0, 0, 'XYZ' ),

    vitalLoHiPowerLeft : new THREE.Euler( 0, Math.PI / 2, 0, 'XYZ' ),
    vitalLoHiPowerRight : new THREE.Euler( 0, Math.PI / 2, 0, 'XYZ' ),

    powerLoLovitalLeft : new THREE.Euler( 0, Math.PI, 0, 'XYZ' ) ,
    powerLoLovitalRight : new THREE.Euler( 0, Math.PI, 0, 'XYZ' ) ,

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    sidePowerHiLoSupportLeft : new THREE.Euler( -Math.PI / 2, Math.PI, 0, 'XYZ' ),
    sidePowerHiLoSupportRight : new THREE.Euler( -Math.PI / 2, 0, 0, 'XYZ' ),

    sideVitalLoHiSupportLeft : new THREE.Euler( Math.PI / 2, Math.PI,  -Math.PI / 2, 'XYZ' ),
    sideVitalLoHiSupportRight : new THREE.Euler( Math.PI / 2, 0, Math.PI / 2, 'XYZ' ),

    sidePowerLoHiSupportLeft : new THREE.Euler( Math.PI / 2, Math.PI, Math.PI, 'XYZ' ),
    sidePowerLoHiSupportRight : new THREE.Euler( - Math.PI / 2, Math.PI, 0, 'XYZ' ),

    sideVitalHiLoSupportLeft : new THREE.Euler( Math.PI / 2, 0, -Math.PI / 2, 'XYZ' ),
    sideVitalHiLoSupportRight : new THREE.Euler( Math.PI / 2, Math.PI, Math.PI / 2, 'XYZ' ),
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
  this.powerLoLovitalLeft = this.createArrow({ name : 'powerLoLovitalLeft', quadrant : 0 })
  this.powerLoLovitalRight = this.createArrow({ name : 'powerLoLovitalRight', quadrant : 0 })

  this.vitalLoHiPowerLeft = this.createArrow({ name : 'vitalLoHiPowerLeft', quadrant : 1 })
  this.vitalLoHiPowerRight = this.createArrow({ name : 'vitalLoHiPowerRight', quadrant : 1 })

  this.powerHiHiVitalLeft = this.createArrow({ name : 'powerHiHiVitalLeft', quadrant : 2 })
  this.powerHiHiVitalRight = this.createArrow({ name : 'powerHiHiVitalRight', quadrant : 2 })

  this.vitalHiLoPowerLeft = this.createArrow({ name : 'vitalHiLoPowerLeft', quadrant : 3 })
  this.vitalHiLoPowerRight = this.createArrow({ name : 'vitalHiLoPowerRight', quadrant : 3 })
  // ///////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////// sides //////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////
  this.sidePowerHiLoSupportLeft = this.createArrow({ name : 'sidePowerHiLoSupportLeft' })
  this.sidePowerHiLoSupportRight = this.createArrow({ name : 'sidePowerHiLoSupportRight' })

  this.sideVitalLoHiSupportLeft = this.createArrow({ name : 'sideVitalLoHiSupportLeft' })
  this.sideVitalLoHiSupportRight = this.createArrow({ name : 'sideVitalLoHiSupportRight' })

  this.sidePowerLoHiSupportLeft = this.createArrow({ name : 'sidePowerLoHiSupportLeft' })
  this.sidePowerLoHiSupportRight = this.createArrow({ name : 'sidePowerLoHiSupportRight' })

  this.sideVitalHiLoSupportLeft = this.createArrow({ name : 'sideVitalHiLoSupportLeft' })
  this.sideVitalHiLoSupportRight = this.createArrow({ name : 'sideVitalHiLoSupportRight' })

  this.navArrowAnimator = new NavArrowAnimator({cornerArrows : this.cornerArrows})
}

NavArrows.prototype.createArrow = function(opts) {
  var self = this
  var name = opts.name

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    // transparent: false,
    visible: false,
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


  self.jSONloader.load(path, function (geometry) {

    var arrow = {}
    arrow.tweenCounter = {}
    arrow.quadrant = opts.quadrant
    arrow.mesh = new THREE.Mesh(geometry, material)
    arrow.mesh.name = name

    var matrix = new THREE.Matrix4()

    var rotation = self.rotation[name] // new THREE.Euler( 0, 0, 0, 'XYZ' );
    var quaternion = new THREE.Quaternion()
    quaternion.setFromEuler( rotation, false );
    matrix.makeRotationFromQuaternion(quaternion)

    var position = self.position[name] // new THREE.Vector3(1,1,1);
    matrix.setPosition(position)

    arrow.mesh.applyMatrix(matrix)

    self.scene.add(arrow.mesh)

    self.domEvents.addEventListener(arrow.mesh, 'click', function(){
      self.navControlls[name]()
    }, false)

    if (arrowType === 'sideArrows') {
      arrow.mesh.visible = false
    }

    self[arrowType].push(arrow)

    self.domEvents.addEventListener(arrow.mesh, 'mouseover', function(){
      $('.scatter-cube').addClass('threejs-hover')
    }, false)

    self.domEvents.addEventListener(arrow.mesh, 'mouseout', function(){
      $('.scatter-cube').removeClass('threejs-hover')
    }, false)

    self.arrowsLoaded += 1
    if (self.arrowsLoaded === 16) { self.navArrowAnimator.update({ quadrant : self.initialQuadrant }) }
  })


};


