/* global THREE, THREEx, TWEEN, requestAnimationFrame */
import DangerZone from './dangerZone';
import AxisGuides from './axisGuides';
import LabelGroup from './labelGroup';
import PointCloud from './pointCloud';
import DistributionCloud from './distributionCloud';
import LineGroup from './lineGroup';
import Target from './target';
import TweenController from './tweenController';
import data4Week from '../../../mockData/testDataMultiWeek'
import getProjects from '../../../mockData/getProjects'


export default function environment (component) {
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
  environment.currentWeek = undefined



  environment.lineGroup = {}

  environment.init = function (opts) {

    var self = this

    this.stakeholders = opts.stakeholders
    this.relationships = opts.relationships
    this.metaData = opts.metadata

    this.currentWeek = this.metaData[0].timeFrame

    this.container = document.getElementById( "container" );

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 1000 );
    this.camera.position.set(-1.5,1,3)

    /////////////////////////// set up controls /////////////////////////////

    this.controls = new THREE.OrbitControls( this.camera, this.container );
    this.controls.maxDistance = 5
    this.controls.minDistance = 1.7
    this.controls.zoomSpeed = 0.2
    this.controls.target.set(1,1,1)
    this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };

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

    var windowResize = new THREEx.WindowResize(this.renderer, this.camera)

    ///////////////////////////////////// Dom Events ////////////////////////////////////////

    var domEvents = new THREEx.DomEvents(this.camera, this.renderer.domElement)

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
      self.currentWeek = time
      this.onUpdateTimeFcts.forEach( function(onUpdateTimeFct) {
        onUpdateTimeFct(time)
      })
    }

    /////////////////////// Create Tween Controller ///////////////////////

    this.tweenController = new TweenController({
      environment : this
    })

    this.onUpdateTimeFcts.push(function (time) {
      if (self.component.connectionView && self.component.distributionView && self.focussedPoint) {
        self.tweenController.updateTimeRelationDistroViews(time)
      } else if (self.component.connectionView && self.focussedPoint) {
        self.tweenController.updateTimeRelationView(time)
      } else if (self.component.distributionView && self.focussedPoint) {
        self.tweenController.updateTimeDistroView(time)
      } else if (self.focussedPoint) { // no views but with selected stakeholder
        self.tweenController.updateTimeNoViewsWithFocus(time)
      } else { // no viewsm no selected stakeholder
        self.tweenController.updateSHPoints({
          time : time,
          easing : TWEEN.Easing.Exponential.Out,
          duration : 1500
        })
      }
    })

    this.onPointClickFcts.push(function (sHPoint) {
      if (self.component.connectionView && self.component.distributionView) {
        self.tweenController.updateSelectedStakeholderDistroConnectionsViews(sHPoint)
      } else if (self.component.connectionView) {
        self.tweenController.updateSelectedStakeholderConnectionView(sHPoint)
      } else if (self.component.distributionView) {
        self.tweenController.updateSelectedStakeholderDistroView(sHPoint)
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

    }

    //////////////////////////////////// create the cube ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry) {
      var cubeMaterial = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
      var cube = new THREE.Mesh(geometry, cubeMaterial)
      self.scene.add(cube)
    })

    //////////////////////////////////// create axis guides ////////////////////////////////////////////////

    this.axisGuides = new AxisGuides()
    this.addObjectsToScene(this.axisGuides.lines)

    //////////////////////////////////// create danger zone ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/danger-zone.json', function (geometry, materials) {
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
      self.removeConnectingLines()
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
      domEvents.addEventListener(mesh, 'click', function(){
        self.onPointClickFcts.forEach( function(onPointClickFct) {
          onPointClickFct(sHPoint)
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

    //////////////////////////////////////////////////////////////////////////////
    //                         render the scene                                 //
    //////////////////////////////////////////////////////////////////////////////

    this.onRenderFcts.push(function(){
      self.renderer.render( self.scene, self.camera );
    })

  }

  environment.render = function () {

    var self = this
    var lastTimeMsec = null
    requestAnimationFrame(function animate(nowMsec){

      // keep looping
      requestAnimationFrame( animate );

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
    })
  }

  return environment
}

function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}
