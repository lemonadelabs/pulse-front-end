// TODO: investigate using import rather than passing things down throughout the application

import QuadrantCalculator from './quadrantCalculator';
import DangerZone from './dangerZone';
import AxisGuides from './axisGuides';
import LabelGroup from './labelGroup';
import PointCloud from './pointCloud';
import DistributionCloud from './distributionCloud';
import LineGroup from './lineGroup';
import Target from './target';
import HistoryTailGroup from './historyTailGroup';
import TweenController from './tweenController';
import NavController from './navController';
import NavArrows from './navArrows';
import environmentLoadAnimation from './environmentLoadAnimation'

/**
* @constructor
* @method Environment
* @param {Object} component ember scatter-cube component
*/
export default function Environment (component) {
  this.component = component
  this.container = document.getElementById( "container" );

  // sets up queues for event based functions
  this.onRenderFcts = []
  this.onPointClickFcts = []
  this.noSelectedStakeholderFcts = []
  this.onUpdateTimeFcts = []
  this.onMouseoverFcts = []
  this.onMouseoutFcts = []
  this.onQuadrantUpdateFxns = []

  this.nameBadgeVisible = false
  this.scene = new THREE.Scene()
  this.jSONloader = new THREE.JSONLoader()
  this.environmentLoadAnimation = environmentLoadAnimation.bind(this)
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////// Interaction With Component //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

Environment.prototype.init = function () {
  var self = this
  /////////////////////////// set up camera ///////////////////////////////////////
  this.initializeCamera()
  /////////////////////////// set up controls /////////////////////////////////////
  this.initializeControls()
  /////////////////////////// set up renderer /////////////////////////////////////
  this.initializeRenderer()
  this.initRendererPause()
  ///////////////////// On Window Resize //////////////////////////////////////////
  this.initWindowResize()
  ///////////////////////////////////// Dom Events ////////////////////////////////
  this.domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement)
  ///////////////////////////////////// Stats /////////////////////////////////////
  this.initStats()
  this.initRendererStats()


  this.fps = RunAtFps() //this is a bower component
  this.onRenderFcts.push( this.fps.update.bind(this.fps) ) // add the update fxn to the render loop

  this.initQuadrantCalculator()
  /////////////////////// Create Tween Controller ///////////////////////
  this.tweenController = new TweenController({ environment : this })

  // var axisHelper = new THREE.AxisHelper( 5 );
  // this.addObjectToScene( axisHelper );

  /////////////////////// render the scene ////////////////////////////////////////
  this.onRenderFcts.push(function(){
    self.renderer.render( self.scene, self.camera );
  })

}

Environment.prototype.setupScatterCube = function (opts) {
  this.project = opts.project
  this.fadeInOnLoad = []
  // these are the entities must load before fade in starts
  this.stillToLoad = ['cube', 'dangerZone']

  ////////////////////// create the cube ////////////////////////////////
  this.initCube()
  //////////////////// create axis guides ///////////////////////////////
  this.initAxisGuides()
  ///////////////////////// create danger zone //////////////////////////
  this.initDangerZone()
  ///////////////////////// create labelGroup ///////////////////////////
  this.initLabelGroup()
  ///////////////////// Create Target ///////////////////////////////////
  this.initTarget()
  /////////////////////////// nav ///////////////////////////////////////
  this.fps.runFunctionAtFps({
    toRun : this.initNav.bind(this)
  })
  ///////////////////// configure name-badge ////////////////////////////
  this.configureNameBadge()
  ///////////////////// Create history tail group ///////////////////////
  this.initHistoryTailGroup()

}

/**
* init stakeholder points and associated interactions
*
* @method initPointCloud
* @param {Object} opts
*   @param {Object} opts.project
*   @param {Array} opts.stakeholders
*   @param {Number} opts.selectedTime
*/
Environment.prototype.initPointCloud = function (opts) {
  var self = this
  var stakeholders = opts.stakeholders
  this.oldTime = opts.selectedTime

  ///////////////////// Create Point Cloud ////////////////////////
  this.pointCloud = new PointCloud({
    stakeholders: stakeholders,
    selectedTime: opts.selectedTime,
  })

  this.fps.runFunctionAtFps({
    toRun : self.pointCloud.startupAnimation.bind(self.pointCloud),
    args : { addObjectToScene : self.addObjectToScene.bind(self) } // args for `toRun` fxn
  })

  // add click targets that are invisible and a little bit bigger than the dots, for ease of clicking.
  this.addObjectsToScene(self.pointCloud.sHPointClickTargets)

  // turn cursor into hand when hovering the sHPoints
  var $scatterCube = $('.scatter-cube')
  this.onMouseoverFcts.push( function () {
    $scatterCube.addClass('threejs-hover')
  })
  this.onMouseoutFcts.push( function () {
    $scatterCube.removeClass('threejs-hover')
  })


  var addListenerSHPoint = function (sHPoint) { // sets up event listners to execute fxn queues
    var mesh = sHPoint.mesh
    self.domEvents.addEventListener(mesh, 'click', function(){
      self.onPointClickFcts.forEach( function(onPointClickFct) {
        onPointClickFct(sHPoint)
      })
    }, false)

    self.domEvents.addEventListener(mesh, 'mouseover', function(){
      self.onMouseoverFcts.forEach( function(onMouseoverFct) {
        onMouseoverFct(sHPoint)
      })
    }, false)

    self.domEvents.addEventListener(mesh, 'mouseout', function(){
      self.onMouseoutFcts.forEach( function(onMouseoutFct) {
        onMouseoutFct(sHPoint)
      })
    }, false)
  }
  _.forEach(this.pointCloud.sHPointClickTargets, addListenerSHPoint)

  // sets Environment.focussedPoint to be the point that the user clicks on
  this.onPointClickFcts.push( function (sHPoint) {
    self.focussedPoint = sHPoint
  })

  // resets Environment.focussedPoint
  this.noSelectedStakeholderFcts.push( function () {
    self.focussedPoint = undefined
  })

  this.onPointClickFcts.push(function (sHPoint) { // relay current sHPoint back to the parent component
    self.component.updateSelectedStakeholder(sHPoint)
  })

  this.onRenderFcts.push( function () { // updates the opacity of the points to imply depth
    _.forEach(self.pointCloud.sHPoints, function (sHPoint) {
      sHPoint.updateColor({
        cameraPosition : self.camera.position,
        controlsTarget : self.controls.target
      })
    })
  })


  this.onUpdateTimeFcts.push(this.animateViewWithTime.bind(this))
  this.onPointClickFcts.push(this.animateViewWithSelectedStakeholder.bind(this))

  if (!this.lineGroup) {
    console.error("linegroup isn't defined yet")
  }
  // potential `race condition` if this gets run before linegroup is intantiated
  this.lineGroup.archiveSHPoints(this.pointCloud.sHPointClickTargets) // give point information to the lineGroup

}

/**
* initializes the relationship connections
* @method initConnections
* @param {Object} opts
*   @param {Function} opts.getConnections ajax promise that returns connections data onComplete
*/
Environment.prototype.initConnections = function (opts) {
  var self = this

  /////////////////// Create Connecting Lines ////////////////////////
  this.removeConnectingLines = function() { // reset fxn for linegroup
    this.removeObjectsFromScene(this.lineGroup.primaryConnections)
    this.lineGroup.primaryConnections = []
  }

  this.lineGroup = new LineGroup({
    getConnections : opts.getConnections,
    addObjectsToScene : self.addObjectsToScene.bind(self),
    fadeInConnections : self.tweenController.fadeInConnections.bind(self.tweenController),
    removeConnectingLines : self.removeConnectingLines.bind(self)
  })

  this.noSelectedStakeholderFcts.push( function () {
    // fade out connections and then remove them
    if (self.component.connectionView) {
      _.last(self.tweenController.fadeOutConnections({
        duration : 300,
        easing : TWEEN.Easing.Quadratic.In
      }))
      .onComplete( function () {
        self.removeConnectingLines()
      })
    }
  })

  this.onRenderFcts.push(function () {
    self.lineGroup.update()
  })
}


Environment.prototype.render = function () {
  var self = this
  var lastTimeMsec = null
  requestAnimationFrame(function animate(nowMsec){

    // save rafId for pause function
    self.renderer.rafId = requestAnimationFrame( animate );
    self.stats.begin()

    // measure time for update fxns
    // we update with respect to time rather than framerate so that animations don't slow down when the framerate drops
    lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
    var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
    lastTimeMsec  = nowMsec

    // call each update function
    self.onRenderFcts.forEach(function(onRenderFct){
      onRenderFct(deltaMsec/1000, nowMsec/1000)
    })

    // update TWEEN functions
    TWEEN.update(nowMsec);

    self.stats.end()
  })
}

///////////////////// logic when stakeholder modal is closed ////////////////////////
Environment.prototype.noSelectedStakeholder = function () {
  this.noSelectedStakeholderFcts.forEach( function(noSelectedStakeholderFct) {
    noSelectedStakeholderFct()
  })
}

///////////////////// when timeseries component changes ////////////////////////
Environment.prototype.updateTime = function (time) {
  var oldTime = this.currentWeek
  this.currentWeek = time

  if ( this.pointCloud ) {
    this.onUpdateTimeFcts.forEach( function( onUpdateTimeFct ) {
      // we pass old time because some of the animations need to know where they came from
      onUpdateTimeFct(time, oldTime)
    })
  }
}

Environment.prototype.connectionViewUpdated = function () {
  var self = this
  this.triggerRender() // ensure renderer is rendering

  if (this.component.connectionView) { // called from the scatterCube componenet. Property is set in the viewMode component.
    this.lineGroup.drawConnections({
      sHPoint : this.focussedPoint,
      currentWeek : this.currentWeek,
      projectId : this.project.get('id')
    })
  } else { // for turning OFF the connectionView
    // fade out connections
    var tweens = this.tweenController.fadeOutConnections({
      duration : 300,
      easing : TWEEN.Easing.Quadratic.In
    })
    if (!_.isEmpty(tweens)) {
    // TODO change to `( tweens.length > 0 )` and test
      // once faded out, remove them
      _.last(tweens).onComplete(function () {
        self.removeConnectingLines()
      })
    }
  }
}

Environment.prototype.distributionViewUpdated = function () {
  this.triggerRender() // ensure renderer is rendering
  if (this.component.distributionView) {  // called from the scatterCube componenet. Property is set in the viewMode component.
    this.tweenController.buildDistroCloud()
  } else {
    this.tweenController.removeDistroCloud()
  }
}

Environment.prototype.historyViewUpdated = function () {
  var self = this
  this.triggerRender() // ensure renderer is rendering

  if (this.component.historyView) {  // called from the scatterCube componenet. Property is set in the viewMode component.
    this.tweenController.buildHistorytails(this.focussedPoint)
  } else {
    this.tweenController.removeHistoryTails().onComplete(function () {
      self.removeObjectsFromScene(self.historyTailGroup.historyTails)
    })
  }
}

/**
* calls pointCloud fxn which foccusses stakeholder as selected in the `stakeholders` modal
* @method foccussedStakeholdersUpdated
* @param {Object} opts
*   @param {Object} opts.focussedStakeholders stakeholders with id as key
*/
Environment.prototype.foccussedStakeholdersUpdated = function(opts) {
  this.triggerRender() // ensure renderer is rendering
  this.pointCloud.focusPoints(opts)
}

// this handles animation with time change for all of the different combinations of view options
Environment.prototype.animateViewWithTime = function (time, oldTime) {
  this.triggerRender() // ensure renderer is rendering
  // the UI is viewing connection view, distribution view, and the stakeholder modal is showing
  if (this.component.connectionView && this.component.distributionView && this.focussedPoint) {
    this.tweenController.updateTimeRelationDistroViews(time, oldTime)
    // the UI is viewing connection view, and the stakeholder modal is showing
  } else if (this.component.connectionView && this.focussedPoint) {
    this.tweenController.updateTimeRelationView(time, oldTime)
    // the UI is viewing distribution view, and the stakeholder modal is showing
  } else if (this.component.distributionView && this.focussedPoint) {
    this.tweenController.updateTimeDistroView(time, oldTime)
    // the UI is viewing the stakeholder modal
  } else if (this.focussedPoint) { // no views but with selected stakeholder
    this.tweenController.updateTimeNoViewsWithFocus(time, oldTime)
  } else { // no views, and no selected stakeholder
    this.tweenController.updateSHPoints({
      time : time,
      oldTime : oldTime,
      easing : TWEEN.Easing.Exponential.Out,
      duration : 1500
    })
  }
}

Environment.prototype.animateViewWithSelectedStakeholder = function (sHPoint) { // executed when the user click a stakeholder point
   if (this.component.connectionView && this.component.distributionView) { // also takes care of history view
    this.tweenController.updateSelectedStakeholderAllViews(sHPoint)
  } else if (this.component.connectionView) { // also takes care of history view
    this.tweenController.updateSelectedStakeholderConnectionView(sHPoint)
  } else if (this.component.distributionView) { // also takes care of history view
    this.tweenController.updateSelectedStakeholderDistroView(sHPoint)
  } else if (this.component.historyView) {
    this.tweenController.updateHistoryTail(sHPoint)
  } else {
    this.target.updatePosition(sHPoint)
  }
}

/////////////////////////////////////////////////////////////////////
///////////////////////////// init fxns /////////////////////////////
/////////////////////////////////////////////////////////////////////


Environment.prototype.initializeCamera = function () {
  this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.0001, 10000 );
  this.camera.position.set(4.5,1.5,-1.6)
}

Environment.prototype.initializeControls = function () {
  this.controls = new THREE.OrbitControls( this.camera, this.container );
  // this.controls.maxDistance = 5
  this.controls.minDistance = 1.7
  this.controls.zoomSpeed = 0.2
  this.controls.target.set(1,1,1)
  this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };
  this.controls.enableKeys = false

  this.onRenderFcts.push(this.controls.update)
}

Environment.prototype.initializeRenderer = function () {
  var self = this
  // create renderer, reference in Environment
  this.renderer = new THREE.WebGLRenderer( { antialias: true } );
  this.renderer.setClearColor( 0x222628 );
  this.renderer.setPixelRatio( window.devicePixelRatio );
  this.renderer.setSize( window.innerWidth, window.innerHeight );
  this.renderer.sortObjects = false;
  this.renderer.rendering = true
  this.container.appendChild( this.renderer.domElement );
}

Environment.prototype.initRendererPause = function() {
  var self = this
  ///////////////////////////  renderer start and stop /////////////////////////////
  // raf id is the id of the current requestAnimationFrame. This is set in the raf loop. The raf loop is defined in Environment.render.
  this.renderer.pauseRender = function () {
    cancelAnimationFrame(this.rafId)
    this.rendering = false
    console.log('pause')
  }
  this.renderer.resumeRender = function () {
    this.rendering = true
    self.render() // Environment.render()
    console.log('resume')
  }

  this.renderer.resetTimeout = function () {
    clearTimeout(self.renderTimer)
    self.renderTimer = setTimeout(function () {
      self.renderer.pauseRender()
      self.renderTimer = null
    }, 3000)
  }

  // this gets called on every interaction, and calls renderer.resetTimeout
  // this is the only publicly accessed method
  this.triggerRender = function () {
    if (!this.renderer.rendering) { this.renderer.resumeRender()  } // resume the render
    this.renderer.resetTimeout()
  }

  // bind triggerRender to interactions
  $('.scatter-cube').on('mousemove', function () {
    self.triggerRender()
  })
  // bind triggerRender to interactions
  $('.scatter-cube').on('mouseup', function () {
    self.triggerRender()
  })
  // bind triggerRender to interactions
  this.controls.domElement.addEventListener( 'mousewheel', function () {
    self.triggerRender()
  }, false );

  setTimeout(function () { // this should be called when the page is completely loaded. It starts the auto render-pause system
    self.renderer.resetTimeout()
  }, 3000)

};

Environment.prototype.initWindowResize = function () {
  this.windowResize = new THREEx.WindowResize(this.renderer, this.camera)
  window.addEventListener('resize', this.triggerRender.bind(this), false)
}

Environment.prototype.initStats = function () {
  this.stats = new Stats();
  this.stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb
  // align top-left
  this.stats.domElement.style.position = 'absolute';
  this.stats.domElement.style.left = '0px';
  this.stats.domElement.style.top = '0px';
  document.body.appendChild( this.stats.domElement );
  var $stats = $(this.stats.domElement)
  $stats.hide()
  $(document).on('keypress', function (e) {  // hide/show on `s` or `S` keypress
    if ( e.keyCode === 115 || e.keyCode === 83) {
      $stats.toggle()
    }
  })
}

Environment.prototype.initRendererStats = function  () {
  var self = this
  this.rendererStats = new THREEx.RendererStats() // https://github.com/jeromeetienne/threex.rendererstats

  this.rendererStats.domElement.style.position = 'absolute'
  this.rendererStats.domElement.style.right = '0px'
  this.rendererStats.domElement.style.top   = '0px'
  document.body.appendChild( this.rendererStats.domElement )

  var $rendererStats = $(this.rendererStats.domElement)
  $rendererStats.hide()

  this.onRenderFcts.push(function () {
    self.rendererStats.update(self.renderer);
  })

  $(document).on('keypress', function (e) { // hide/show on `s` or `S` keypress
    if ( e.keyCode === 115 || e.keyCode === 83) {
      $rendererStats.toggle()
    }
  })
}

Environment.prototype.initQuadrantCalculator = function() {
  var self = this

  // executes each onQuadrantUpdate fxn when the current quadrant changes
  var onQuadrantUpdate = function (quadrant) {
    self.onQuadrantUpdateFxns.forEach(function (onQuadrantUpdateFxn) {
      onQuadrantUpdateFxn(quadrant)
    })
  }

  this.quadrantCalculator = new QuadrantCalculator({
    cameraPosition : self.camera.position,
    onQuadrantUpdate : onQuadrantUpdate
  })
  this.onRenderFcts.push(this.quadrantCalculator.update.bind(this.quadrantCalculator))
};

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////// scatercube init fxns //////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

Environment.prototype.initCube = function () {
  var self = this
  this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry) {
    var cubeMaterial = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
    var cube = new THREE.Mesh(geometry, cubeMaterial)
    cube.name = 'cube'
    self.fadeInOnLoad.push(cube)
    // removes placeholder from `stillToLoad` array
    _.pull(self.stillToLoad, 'cube')
    self.environmentLoadAnimation()
  })
}

Environment.prototype.initAxisGuides = function() {
  this.axisGuides = new AxisGuides()
  this.fadeInOnLoad.push(this.axisGuides)
};

Environment.prototype.initDangerZone = function () {
  var self = this
  this.jSONloader.load('./assets/geometries/danger-zone.json', function (geometry) {
    self.dangerZone = new DangerZone({
      geometry : geometry
    })
    self.fadeInOnLoad.push(self.dangerZone.mesh)
    _.pull(self.stillToLoad, 'dangerZone')
    self.environmentLoadAnimation()
  })
}

Environment.prototype.initLabelGroup = function () {
  var self = this
  this.labelGroup = new LabelGroup({
    scene: this.scene // pass scene so that meshes can be added
  })
  this.labelGroup.createLabels({
    initialQuadrant : this.quadrantCalculator.quadrant,
    runFunctionAtFps : this.fps.runFunctionAtFps.bind(this.fps)
  })

  this.onQuadrantUpdateFxns.push(this.labelGroup.animateLabels.bind(this.labelGroup))

  this.onRenderFcts.push(function () {
    self.billboardObjects(self.labelGroup.labels)
  })
}

Environment.prototype.initTarget = function () {
  var self = this
  this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry) {

    self.target = new Target ({
      geometry : geometry
    })

    self.addObjectToScene(self.target)

    // add to the queue of functions that are executed on render
    self.onRenderFcts.push(function () {
      self.billboardObject(self.target)
    })

    // add to the queue of functions that are executed when the stakeholder modal is closed
    self.noSelectedStakeholderFcts.push(hideTarget)
    function hideTarget () {
      self.target.mesh.visible = false
    }
  })
}

Environment.prototype.configureNameBadge = function () {
  var self = this
  this.onMouseoverFcts.push(function (sHPoint) {
    // add to onMouseOver queue
    self.nameBadgeVisible = true
    self.component.updateHoveredStakeholder(sHPoint)
    $('.name-badge').show()
  })

  this.onMouseoutFcts.push(function () {
    // executed when cursor leaves sHPoint
    var $nameBadge = $('.name-badge')
    if ($nameBadge.html().trim() === self.component.hoveredStakeholder.name.trim()) { // this if statement is serving an edge-case with zooming
      $nameBadge.hide()
      self.nameBadgeVisible = false
    }
  })

  this.onRenderFcts.push( function () {
    if ( self.nameBadgeVisible ) {
      // put namebadge in the right place
      var position = THREEx.ObjCoord.cssPosition(self.component.hoveredStakeholder.mesh, self.camera, self.renderer)

      var left = ( position.x + 10 ) + 'px'
      var top = ( position.y - 28 ) + 'px'

      $('.name-badge').css({top : top, left : left});
    }
  })
}

/**
* @method initDistributionCloud
* @param {Object} opts
*   @param {Function} opts.getVotes ajax request that returns vote information onCompete
*/
Environment.prototype.initDistributionCloud = function (opts) {
  var self = this
  this.distributionCloud = new DistributionCloud( { getVotes : opts.getVotes } )

  this.onRenderFcts.push( function () { // update opacity of point to indicate depth
    if (self.component.distributionView && self.focussedPoint) {
      _.forEach(self.distributionCloud.distributionPoints, function (distributionPoint) {
        // dont update if they are being animated!!
        if(!self.distributionCloud.transitioning) { distributionPoint.updateColor(self.camera.position) }
      })
    }
  })

  this.noSelectedStakeholderFcts.push(function () {
    if (self.component.distributionView) {
      self.tweenController.removeDistroCloud()
    }
  })
}

Environment.prototype.initHistoryTailGroup = function () {
  var self = this
  this.historyTailGroup = new HistoryTailGroup()
  // gets executed when there is no selected stakeholder
  this.noSelectedStakeholderFcts.push( function () {
    if (self.component.historyView) { // checking to see if historyView is active
      self.tweenController.removeHistoryTails().onComplete(function () { // fade out tails
        self.removeObjectsFromScene(self.historyTailGroup.historyTails) // remove from scene
      })
    }
  })
}

Environment.prototype.initNav = function () {
  var self = this

  this.navController = new NavController( { environment : this } )
  this.navArrows = new NavArrows({
    scene : this.scene,
    jSONloader : this.jSONloader,
    navController : this.navController,
    initialQuadrant: self.quadrantCalculator.quadrant,
    navControllerUpdate : self.navController.update.bind(self.navController) // bind to its own context
  })
  this.navController.cornerArrows = this.navArrows.cornerArrows

  this.onQuadrantUpdateFxns.push(function (quadrant) {
    // don't bother updating when the view is in orthographic mode
    if (self.camera.position.distanceTo(self.controls.target) < 50) {
      self.navController.update({ quadrant : quadrant })
    }
  })
}


///////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// UTILITIES ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

///////////////////////// adding & removing objects from scene /////////////////////////////////

Environment.prototype.addObjectsToScene = function (objects) {
  _.forEach(objects, this.addObjectToScene.bind(this))
}

Environment.prototype.addObjectToScene = function (object) {
  if (object.mesh) {
    this.scene.add(object.mesh)
  } else {
    this.scene.add(object)
  }
}

Environment.prototype.removeObjectFromScene = function (object) {
  this.scene.remove( object.mesh )
}

Environment.prototype.removeObjectsFromScene = function (objects) {
  _.forEach( objects, this.removeObjectFromScene.bind(this) )
}

//////////////////////////////////// billboarding ////////////////////////////////////////////////

Environment.prototype.billboardObjects = function (objects) {
  _.forEach(objects, this.billboardObject.bind(this))
}

Environment.prototype.billboardObject = function (object) {
  // copies the rotation from the camera and applies it to the mesh
  object.mesh.quaternion.copy( this.camera.quaternion )
}
