import arrowHitbox from './arrowHitbox'


/**
* instantiates the navigtional arrows with hitbox and subscribes to interaction event listners
*
* @method NavArrows
* @param {Object} opts
*   @param {Object} opts.scene
*   @param {Object} opts.jSONloader
*   @param {Object} opts.navController
*   @param {Number} opts.initialQuadrant
*   @param {Functon} opts.navControllerUpdate
*/

export default function NavArrows (opts) {

  this.navControllerUpdate = opts.navControllerUpdate
  this.arrowsLoaded = 0
  this.initialQuadrant = opts.initialQuadrant
  this.sideArrows = []
  this.cornerArrows = []

  this.scene = opts.scene

  this.jSONloader = opts.jSONloader

  this.hitBoxMaterial = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    visible: false,
    side: THREE.DoubleSide,
    // if you wish to see the hitboxes, uncomment these lines...
    // visible: true,
    // transparent : true ,
    // opacity : 0.4,
  });

  // locations of all the nav arrows
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

  // location of all the hitboxes
  this.hitboxPosition = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft : new THREE.Vector3(-0.22,-0.22,2.02),
    vitalHiLoPowerRight : new THREE.Vector3(-0.02,-0.22,2.22),

    powerHiHiVitalLeft : new THREE.Vector3(2.12,-0.22,2.32),
    powerHiHiVitalRight : new THREE.Vector3(2.32, -0.22, 2.12),

    vitalLoHiPowerLeft : new THREE.Vector3(2.32, -0.22, -0.12),
    vitalLoHiPowerRight : new THREE.Vector3(2.12, -0.22, -0.32),

    powerLoLovitalLeft : new THREE.Vector3(-0.12, -0.22, -0.32),
    powerLoLovitalRight : new THREE.Vector3(-0.32, -0.22, -0.12),
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    // (power, support , vital)
    sidePowerHiLoSupportLeft : new THREE.Vector3(1.88, -0.3, 0),
    sidePowerHiLoSupportRight : new THREE.Vector3(0.12, -0.3, 0),

    sideVitalLoHiSupportLeft : new THREE.Vector3(0, -0.3, 1.88),
    sideVitalLoHiSupportRight : new THREE.Vector3(0, -0.3, 0.12),

    sidePowerLoHiSupportLeft : new THREE.Vector3(0.12, -0.3, 2),
    sidePowerLoHiSupportRight : new THREE.Vector3(1.88, -0.3, 2),

    sideVitalHiLoSupportLeft : new THREE.Vector3(2, -0.3, 1.88),
    sideVitalHiLoSupportRight : new THREE.Vector3(2, -0.3, 0.12),
  }

  // rotational information for the arrows
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

  // rotational information for the hitboxes
  this.hitboxRotation = {
    ///////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// corners /////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    vitalHiLoPowerLeft : new THREE.Euler( Math.PI / 2, 0, 0, 'XYZ' ),
    vitalHiLoPowerRight : new THREE.Euler( Math.PI / 2, 0, Math.PI / 2, 'XYZ' ),

    powerHiHiVitalLeft : new THREE.Euler( Math.PI / 2, 0, Math.PI / 2, 'XYZ' ),
    powerHiHiVitalRight : new THREE.Euler( Math.PI / 2, 0, 0, 'XYZ' ),

    vitalLoHiPowerLeft : new THREE.Euler( Math.PI / 2, 0, 0, 'XYZ' ),
    vitalLoHiPowerRight : new THREE.Euler( Math.PI / 2, 0, Math.PI / 2, 'XYZ' ),

    powerLoLovitalLeft : new THREE.Euler( Math.PI / 2, 0, Math.PI / 2, 'XYZ' ) ,
    powerLoLovitalRight : new THREE.Euler( Math.PI / 2, 0, 0, 'XYZ' ) ,

    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////// sides //////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    sidePowerHiLoSupportLeft : new THREE.Euler( 0, 0, Math.PI / 2, 'XYZ' ),
    sidePowerHiLoSupportRight : new THREE.Euler( 0, 0, Math.PI / 2, 'XYZ' ),

    sideVitalLoHiSupportLeft : new THREE.Euler( Math.PI / 2, Math.PI / 2,  0, 'XYZ' ),
    sideVitalLoHiSupportRight : new THREE.Euler( Math.PI / 2, Math.PI / 2, 0, 'XYZ' ),

    sidePowerLoHiSupportLeft : new THREE.Euler( 0, 0, Math.PI / 2, 'XYZ' ),
    sidePowerLoHiSupportRight : new THREE.Euler( 0, 0, Math.PI / 2, 'XYZ' ),

    sideVitalHiLoSupportLeft : new THREE.Euler( Math.PI / 2, Math.PI / 2, 0, 'XYZ' ),
    sideVitalHiLoSupportRight : new THREE.Euler( Math.PI / 2, Math.PI / 2, 0, 'XYZ' ),
  }

  // mapping to point to which function in nav controller to execute on click
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
  this.createArrow({ name : 'powerLoLovitalLeft', quadrant : 0 })
  this.createArrow({ name : 'powerLoLovitalRight', quadrant : 0 })

  this.createArrow({ name : 'vitalLoHiPowerLeft', quadrant : 1 })
  this.createArrow({ name : 'vitalLoHiPowerRight', quadrant : 1 })

  this.createArrow({ name : 'powerHiHiVitalLeft', quadrant : 2 })
  this.createArrow({ name : 'powerHiHiVitalRight', quadrant : 2 })

  this.createArrow({ name : 'vitalHiLoPowerLeft', quadrant : 3 })
  this.createArrow({ name : 'vitalHiLoPowerRight', quadrant : 3 })
  // ///////////////////////////////////////////////////////////////////////////
  // ////////////////////////////////// sides //////////////////////////////////
  // ///////////////////////////////////////////////////////////////////////////
  this.createArrow({ name : 'sidePowerHiLoSupportLeft' })
  this.createArrow({ name : 'sidePowerHiLoSupportRight' })

  this.createArrow({ name : 'sideVitalLoHiSupportLeft' })
  this.createArrow({ name : 'sideVitalLoHiSupportRight' })

  this.createArrow({ name : 'sidePowerLoHiSupportLeft' })
  this.createArrow({ name : 'sidePowerLoHiSupportRight' })

  this.createArrow({ name : 'sideVitalHiLoSupportLeft' })
  this.createArrow({ name : 'sideVitalHiLoSupportRight' })

}

/**
*
*
* @method createArrow
* @param {Object} opts
*   @param {String} opts.name
*   @param {Number} opts.quadrant
*/
NavArrows.prototype.createArrow = function(opts) {
  var self = this
  var name = opts.name

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    visible: false,
    side: THREE.DoubleSide
  });

  var arrowType, direction, path
  if (_.endsWith(name, 'Left')) {
    path = './assets/geometries/rotationArrowsLeft.json'
    arrowType = 'cornerArrows'
    direction = 'left'
  } else if (_.endsWith(name, 'Right')) {
    path = './assets/geometries/rotationArrowsRight.json'
    arrowType = 'cornerArrows'
    direction = 'right'
  }

  if (_.startsWith(name, 'side')) {
    path = './assets/geometries/rotationArrowFlat.json'
    arrowType = 'sideArrows'
  }


  // load geometry from json, make meshes for arrow and hitbox, position arrows appropriately, add to scene.
  // Store reference to arrow in NavArrows, using the name as key.
  self.jSONloader.load(path, function (geometry) {

    var arrow = {}
    arrow.tweenCounter = {}
    arrow.quadrant = opts.quadrant
    arrow.mesh = new THREE.Mesh(geometry, material)
    arrow.mesh.name = name


    var matrix = new THREE.Matrix4()

    // pull rotation from object defined in constructor
    var rotation = self.rotation[name] // new THREE.Euler( 0, 0, 0, 'XYZ' );
    var quaternion = new THREE.Quaternion()
    quaternion.setFromEuler( rotation, false );
    matrix.makeRotationFromQuaternion(quaternion)

    // pull position from object defined in constructor
    var position = self.position[name] // new THREE.Vector3(1,1,1);
    matrix.setPosition(position)

    arrow.mesh.applyMatrix(matrix)

    arrow.hitBox = arrowHitbox({
      arrowType : arrowType,
      rotation : self.hitboxRotation[name],
      position : self.hitboxPosition[name],
      material : self.hitBoxMaterial
    })
    arrow.hitBox.name = name
    arrow.hitBox.onClickFxn = self.navControlls[name]

    self.scene.add(arrow.hitBox)
    self.scene.add(arrow.mesh)
    self[arrowType].push(arrow)

    self.arrowsLoaded += 1
    if (self.arrowsLoaded === 16) { self.navControllerUpdate({ quadrant : self.initialQuadrant }) }
    self[name] = arrow
  })
};


