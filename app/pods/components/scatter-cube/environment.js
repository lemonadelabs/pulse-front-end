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

// TODO: figure out if this is the right way to define and export out environment
export default function (component) {
  var environment = {}
  environment.component = component
  environment.container = undefined
  environment.camera = undefined
  environment.controls = undefined
  environment.scene = undefined
  environment.renderer  = undefined
  environment.onRenderFcts = []
  environment.onPointClickFcts = []
  environment.noSelectedStakeholderFcts = []
  environment.onUpdateTimeFcts = []
  environment.onMouseoverFcts = []
  environment.onMouseoutFcts = []
  environment.currentWeek = undefined
  environment.rafId = undefined
  environment.rendering = true

  environment.nameBadgeVisible = false



  environment.lineGroup = {}

  environment.init = function (opts) {

    var self = this

    this.stakeholders = opts.stakeholders
    this.relationships = opts.relationships
    this.metaData = opts.metadata

    this.currentWeek = this.metaData[0].timeFrame

    this.container = document.getElementById( "container" );

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.0001, 10000 );

    this.camera.position.set(4.5,1.5,-1.6)

    this.camera.tweenDestinations = {}

    /////////////////////////// set up controls /////////////////////////////

    this.controls = new THREE.OrbitControls( this.camera, this.container );
    // this.controls.maxDistance = 5
    // this.controls.minDistance = 1.7
    this.controls.zoomSpeed = 0.2
    this.controls.target.set(1,1,1)
    this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };
    // this.controls.enabled = false

    this.onRenderFcts.push(this.controls.update)

    /////////////////////////// set up scene /////////////////////////////

    this.scene = new THREE.Scene();

    /////////////////////////// set up renderer /////////////////////////////

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0x222628 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.sortObjects = false;
    this.container.appendChild( this.renderer.domElement );

    ///////////////////// On Window Resize ////////////////////////

    this.windowResize = new THREEx.WindowResize(this.renderer, this.camera)

    ///////////////////////////////////// Dom Events ////////////////////////////////////////

    this.domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement)

    ///////////////////////////////////// Stats ////////////////////////////////////////

    this.stats = new Stats();

    this.stats.setMode( 0 ); // 0: fps, 1: ms, 2: mb

    // align top-left
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.top = '0px';
    document.body.appendChild( this.stats.domElement );
    var $stats = $(this.stats.domElement)

    $stats.hide()

    this.onRenderFcts.push(function () {
      self.stats.begin();
      self.stats.end();
    })

    var rendererStats   = new THREEx.RendererStats()

    rendererStats.domElement.style.position = 'absolute'
    rendererStats.domElement.style.right = '0px'
    rendererStats.domElement.style.top   = '0px'
    document.body.appendChild( rendererStats.domElement )

    var $rendererStats = $(rendererStats.domElement)
    $rendererStats.hide()


    this.onRenderFcts.push(function () {
      rendererStats.update(self.renderer);
    })

    $(document).on('keypress', function (e) {
      if ( e.keyCode === 115 || e.keyCode === 83) {
        $stats.toggle()
        $rendererStats.toggle()
      }
    })


    //////////////////////////////////// initialize json loader ////////////////////////////////////////////////

    this.jSONloader = new THREE.JSONLoader()

    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// UTILITIES ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    ///////////////////////// adding & removing objects from scene /////////////////////////////////

    this.addObjectsToScene = function (objects) {
      forEach(objects, self.addObjectToScene)
    }

    this.addObjectToScene = function (object) {
      self.scene.add(object.mesh)
    }

    this.removeObjectFromScene = function (object) {
      self.scene.remove( object.mesh )
    }

    this.removeObjectsFromScene = function (objects) { // duplicate of ebove function
      forEach( objects, self.removeObjectFromScene )
    }

    //////////////////////////////////// billboarding ////////////////////////////////////////////////

    this.billboardObjects = function (objects) {
      forEach(objects, function(object) {
        self.billboardObject(object)
      })
    }

    this.billboardObject = function (object) {
      object.mesh.quaternion.copy( self.camera.quaternion )
    }

    ///////////////////// logic when stakeholder modal is closed ////////////////////////

    this.noSelectedStakeholder = function () {
      this.noSelectedStakeholderFcts.forEach( function(noSelectedStakeholderFct) {
        noSelectedStakeholderFct()
      })
    }

    this.updateTime = function (time) {
      var oldTime = self.currentWeek
      self.currentWeek = time
      this.onUpdateTimeFcts.forEach( function(onUpdateTimeFct) {
        onUpdateTimeFct(time, oldTime)
      })
    }

    /////////////////////// Create Tween Controller ///////////////////////

    this.tweenController = new TweenController({
      environment : this
    })

    this.onUpdateTimeFcts.push(function (time, oldTime) {
      if (self.component.connectionView && self.component.distributionView && self.focussedPoint) {
        self.tweenController.updateTimeRelationDistroViews(time, oldTime)
      } else if (self.component.connectionView && self.focussedPoint) {
        self.tweenController.updateTimeRelationView(time, oldTime)
      } else if (self.component.distributionView && self.focussedPoint) {
        self.tweenController.updateTimeDistroView(time, oldTime)
      } else if (self.focussedPoint) { // no views but with selected stakeholder
        self.tweenController.updateTimeNoViewsWithFocus(time, oldTime)
      } else { // no viewsm no selected stakeholder
        self.tweenController.updateSHPoints({
          time : time,
          oldTime : oldTime,
          easing : TWEEN.Easing.Exponential.Out,
          duration : 1500
        })
      }
    })

    this.onPointClickFcts.push(function (sHPoint) {
      if (self.component.connectionView && self.component.distributionView) { // also takes care of history view
        self.tweenController.updateSelectedStakeholderAllViews(sHPoint)
      } else if (self.component.connectionView) { // also takes care of history view
        self.tweenController.updateSelectedStakeholderConnectionView(sHPoint)
      } else if (self.component.distributionView) { // also takes care of history view
        self.tweenController.updateSelectedStakeholderDistroView(sHPoint)
      } else if (self.component.historyView) {
        self.tweenController.updateHistoryTail(sHPoint)
      } else {
        self.target.updatePosition(sHPoint)
      }
    })

    this.noSelectedStakeholderFcts.push(function () {
      if (self.component.distributionView) {
        self.tweenController.removeDistroCloud()
      }
    })

    /////////////////////// Toggle component view modes ///////////////////////

    this.connectionViewUpdated = function () {
      if (this.component.connectionView) {
        self.lineGroup.drawConnections(this.focussedPoint, this.currentWeek)
        self.addObjectsToScene(this.lineGroup.primaryConnections)
        self.tweenController.fadeInConnections({
          duration : 300,
          easing : TWEEN.Easing.Quadratic.Out
        })
      } else {
        var tweens = self.tweenController.fadeOutConnections({
          duration : 300,
          easing : TWEEN.Easing.Quadratic.In
        })
        if (!_.isEmpty(tweens)) {
          _.last(tweens).onComplete(function () {
            self.removeConnectingLines()
          })
        }
      }
    }

    this.distributionViewUpdated = function () {
      if (this.component.distributionView) {
        self.tweenController.buildDistroCloud()
      } else {
        this.tweenController.removeDistroCloud()
      }
    }

    this.historyViewUpdated = function () {
      if (this.component.historyView) {
        self.tweenController.buildHistorytails(self.focussedPoint)
      } else {
        self.tweenController.removeHistoryTails().onComplete(function () {
          self.removeObjectsFromScene(self.historyTailGroup.historyTails)
        })
      }
    }

    //////////////////////////////////// create the cube ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry) {
      var cubeMaterial = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
      var cube = new THREE.Mesh(geometry, cubeMaterial)
      self.scene.add(cube)
    })

    //////////////////////////////////// create axis guides ////////////////////////////////////////////////

    this.axisGuides = new AxisGuides()
    console.log(this.axisGuides.lines)
    this.addObjectsToScene(this.axisGuides.lines)

    //////////////////////////////////// create danger zone ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/danger-zone.json', function (geometry) {
      self.dangerZone = new DangerZone({
        geometry : geometry
      })
      self.addObjectToScene(self.dangerZone)
    })


    //////////////////////////////////// create labelGroup ////////////////////////////////////////////////

    this.labelGroup = new LabelGroup({
      scene: this.scene,
      camera: this.camera
    })

    this.labelGroup.createLabels()

    this.onRenderFcts.push(function () {
      self.labelGroup.updateLocation(self.camera.position)
    })

    this.onRenderFcts.push(function () {
      self.billboardObjects(self.labelGroup.labels)
    })

    ///////////////////// Create Target ////////////////////////

    this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry) {

      self.target = new Target ({
        geometry : geometry
      })

      self.addObjectToScene(self.target)

      self.onRenderFcts.push(function () {
        self.billboardObject(self.target)
      })

      // hide target
      self.noSelectedStakeholderFcts.push(hideTarget)
      function hideTarget () {
        self.target.mesh.visible = false
      }
    })

    ///////////////////// Create Connecting Lines ////////////////////////

    this.lineGroup = new LineGroup({
      connections: self.relationships
    })

    this.noSelectedStakeholderFcts.push( function () {
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

    this.removeConnectingLines = function() {
      self.removeObjectsFromScene(self.lineGroup.primaryConnections)
      self.lineGroup.primaryConnections = []
    }

    this.onRenderFcts.push(function () {
      self.lineGroup.update()
    })

    ///////////////////// Create Point Cloud ////////////////////////

    this.pointCloud = new PointCloud({
      data: self.stakeholders,
      timeFrame: self.metaData[0].timeFrame,
    })

    this.lineGroup.archiveSHPoints(this.pointCloud.sHPointClickTargets) // give point information to the lineGroup

    this.addObjectsToScene(this.pointCloud.sHPointClickTargets)
    this.addObjectsToScene(this.pointCloud.sHPoints)


    this.addListnerSHPoint = function (sHPoint) {
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
    forEach(this.pointCloud.sHPointClickTargets, self.addListnerSHPoint) // apply event listner to points


    this.onPointClickFcts.push( function (sHPoint) {
      self.focussedPoint = sHPoint
    })

    this.noSelectedStakeholderFcts.push( function () {
      self.focussedPoint = undefined
    })

    this.onPointClickFcts.push(function (sHPoint) { // relay current sHPoint back to the parent component
      self.component.updateSelectedStakeholder(sHPoint)
    })

    ///////////////////// name-badge on hover ////////////////////////

    this.onMouseoverFcts.push(function (sHPoint) {
      self.nameBadgeVisible = true
      self.component.updateHoveredStakeholder(sHPoint)

      $('.name-badge').show()
    })

    this.onMouseoutFcts.push(function () {
      var $nameBadge = $('.name-badge')
      if ($nameBadge.html().trim() === self.component.hoveredStakeholder.name.trim()) {
        $nameBadge.hide()
        self.nameBadgeVisible = false
      }
    })

    this.onRenderFcts.push( function () {
      if ( self.nameBadgeVisible ) {
        var position = THREEx.ObjCoord.cssPosition(self.component.hoveredStakeholder.mesh, self.camera, self.renderer)

        var left = ( position.x + 10 ) + 'px'
        var top = ( position.y - 28 ) + 'px'

        $('.name-badge').css({top : top, left : left});
      }
    })


    this.onRenderFcts.push( function () {
      forEach(self.pointCloud.sHPoints, function (sHPoint) {
        sHPoint.updateColor(self.camera.position)
      })
    })

    ///////////////////// Create distribution Cloud ////////////////////////

    this.distributionCloud = new DistributionCloud()

    this.onRenderFcts.push( function () { // update color of point
      if (self.component.distributionView && self.focussedPoint) {
        forEach(self.distributionCloud.distributionPoints, function (distributionPoint) {
          // dont update if they are being animated!!
          if(!self.distributionCloud.transitioning) { distributionPoint.updateColor(self.camera.position) }
        })
      }
    })

    ///////////////////// Create history tail group ////////////////////////

    this.historyTailGroup = new HistoryTailGroup()

    this.noSelectedStakeholderFcts.push(function () {
      if (self.component.historyView) {
        self.tweenController.removeHistoryTails().onComplete(function () {
          self.removeObjectsFromScene(self.historyTailGroup.historyTails)
        })
      }
    })

    //////////////////////////////////////////////////////////////////////////////
    //                         render the scene                                 //
    //////////////////////////////////////////////////////////////////////////////

    this.onRenderFcts.push(function(){
      self.renderer.render( self.scene, self.camera );
    })



    // //////////////////////////////// pause render ////////////////////////////////

    // this.pauseRender = function () {
    //   // self.controls.enabled = false
    //   cancelAnimationFrame(self.rafId)
    //   self.rendering = false
    //   console.log('pause')
    // }
    // this.resumeRender = function () {
    //   // self.controls.enabled = true
    //   self.rendering = true
    //   self.render()
    //   console.log('resume')
    // }

    // this.oldCameraPosition = {
    //   x: undefined,
    //   y: undefined,
    //   z: undefined
    // }

    // setInterval(function () {
    //   if ( self.rendering === true && _.isEqual( self.oldCameraPosition.x, self.camera.position.x ) ) {
    //     self.pauseRender()
    //   }

    //   if ( self.rendering === false && !_.isEqual( self.oldCameraPosition.x, self.camera.position.x ) ) {
    //     self.resumeRender()
    //   }

    //   self.oldCameraPosition.x = self.camera.position.x
    //   // self.oldCameraPosition.y = self.camera.position.y
    //   // self.oldCameraPosition.z = self.camera.position.z

    // }, 100)

    // // this.pauseRender()

    /////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////// autoNav ////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    this.navController = new NavController({
      environment : self
    })

    this.navArrows = new NavArrows({
      scene : self.scene,
      jSONloader : self.jSONloader,
      navController : self.navController,
      domEvents : self.domEvents
    })

    // setTimeout(function () {
    //   self.navController.fadeOutArrows({
    //     duration : 1000,
    //     easing : TWEEN.Easing.Quadratic.In,
    //     arrowType: 'sideArrows'
    //   })
    // }, 1000)

    // setTimeout(function () {
    //   self.navController.fadeInArrows({
    //     duration : 1000,
    //     easing : TWEEN.Easing.Quadratic.Out,
    //     arrowType: 'sideArrows'
    //   })
    // }, 3000)



    $(document).on('keypress', function (e) {
      if ( e.keyCode === 122) { self.navController.powerXsupportOrthographicLoHi() } // z
      if ( e.keyCode === 120) { self.navController.powerXvitalPerspectiveHiHi() } // x
      if ( e.keyCode === 99) { self.navController.vitalXsupportOrthographicHiLo() } // c
      if ( e.keyCode === 118) { self.navController.vitalXpowerPerspectiveLoHi() } // v
      if ( e.keyCode === 98) { self.navController.powerXsupportOrthographicHiLo() } // b
      if ( e.keyCode === 110) { self.navController.powerXvitalPerspectiveLoLo() } // n
      if ( e.keyCode === 109) { self.navController.vitalXsupportOrthographicLoHo() } // m
      if ( e.keyCode === 44) { self.navController.vitalXpowerPerspectiveHiLo() } // ,
    })
  }



  environment.render = function () {

    var self = this
    var lastTimeMsec = null
    requestAnimationFrame(function animate(nowMsec){

      // keep looping
      self.rafId = requestAnimationFrame( animate );

      // measure time
      lastTimeMsec  = lastTimeMsec || nowMsec-1000/60
      var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
      lastTimeMsec  = nowMsec

      // call each update function
      self.onRenderFcts.forEach(function(onRenderFct){
        onRenderFct(deltaMsec/1000, nowMsec/1000)
      })

      // update TWEEN functions
      TWEEN.update(nowMsec);

      // console.log(self.camera.position)

    })
  }

  return environment
}

function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}
