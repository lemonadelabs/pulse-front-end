/* global THREE, THREEx, TWEEN, requestAnimationFrame */
import DangerZone from './dangerZone';
import AxisGuides from './axisGuides';
import LabelGroup from './labelGroup';
import PointCloud from './pointCloud';
import LineGroup from './lineGroup';
import Target from './target';
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

    // this.onPointClickFcts.push( function (sHPoint) { // makes camera focus on selected point
    //   self.controls.target.copy(sHPoint.mesh.position)
    // })

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

    ///////////////////////////////////// Axis Helper ////////////////////////////////////////

    // Add axis helper to show axis in x (red) and y (green) z (blue) direction, remove later
    // var axisHelper = new THREE.AxisHelper( 10000 );
    // this.scene.add( axisHelper );

    //////////////////////////////////// initialize json loader ////////////////////////////////////////////////

    this.jSONloader = new THREE.JSONLoader()

    //////////////////////////////////// create the cube ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry) {
      var cubeMaterial = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
      var cube = new THREE.Mesh(geometry, cubeMaterial)
      self.scene.add(cube)
    })

    //////////////////////////////////// create axis guides ////////////////////////////////////////////////

    this.axisGuides = new AxisGuides()
    // to add the plain crosshairs in
    this.axisGuides.createMeshes({})
    addObjectsToScene(this.axisGuides.lines)


    // code for moving axis to match sHPoint
    // this.onPointClickFcts.push(function (sHPoint) {
    //   removeObjectsFromScene(self.axisGuides.lines)
    //   self.axisGuides.currentSHPoint = sHPoint
    //   self.axisGuides.createMeshes()
    //   addObjectsToScene(self.axisGuides.lines)
    // })

    // this.noSelectedStakeholderFcts.push( function (sHPoint) {
    //   self.axisGuides.currentSHPoint = undefined
    //   removeObjectsFromScene(self.axisGuides.lines)
    //   // to add the plain crosshairs in
    //   // self.axisGuides.createMeshes({})
    //   // addObjectsToScene(self.axisGuides.lines)
    // })

    //////////////////////////////////// create danger zone ////////////////////////////////////////////////

    this.jSONloader.load('./assets/geometries/danger-zone.json', function (geometry, materials) {
      self.dangerZone = new DangerZone({
        geometry : geometry
      })
      addObjectToScene(self.dangerZone)
    })


    //////////////////////////////////// create labelGroup ////////////////////////////////////////////////

    var labelGroup = new LabelGroup({
      scene: this.scene,
      camera: this.camera
    })

    labelGroup.createLabels()

    this.onRenderFcts.push(function () {
      labelGroup.updateLocation(self.camera.position)
    })

    this.onRenderFcts.push(function () {
      billboardObjects(labelGroup.labels)
    })

    ///////////////////// Create Target ////////////////////////

    this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry) {

      self.target = new Target ({
        geometry : geometry
      })

      addObjectToScene(self.target)

      self.onPointClickFcts.push(function (sHPoint) {
        self.target.updatePosition(sHPoint)
      })

      self.onRenderFcts.push(function () {
        billboardObject(self.target)
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

    this.noSelectedStakeholderFcts.push(removeConnectingLines)

    function removeConnectingLines () {
      removeObjectsFromScene(self.lineGroup.primaryConnections)
      self.lineGroup.primaryConnections = []
    }

    this.onPointClickFcts.push( function (sHPoint) {
      var currentWeek = self.metaData[0].timeFrame
      removeConnectingLines()
      self.lineGroup.drawConnections(sHPoint, self.currentWeek)
      addObjectsToScene(self.lineGroup.primaryConnections)
    })

    this.onRenderFcts.push(function () {
      self.lineGroup.update()
    })

    this.onUpdateTimeFcts.push(function (time) {
      if (self.focussedPoint) {
        removeConnectingLines()
        self.lineGroup.drawConnections(self.focussedPoint, time)
        addObjectsToScene(self.lineGroup.primaryConnections)
      }
    })

    ///////////////////// Create Point Cloud ////////////////////////

    this.pointCloud = new PointCloud({
      data: self.stakeholders,
      timeFrame: self.metaData[0].timeFrame,
      lineGroup: self.lineGroup,
      environment: this
    }) // todo make this more efficient, maybe share material between points, or find a more efficient way to render the clickTargets

    this.lineGroup.archiveSHPoints(this.pointCloud.sHPointClickTargets) // give point information to the lineGroup

    addObjectsToScene(this.pointCloud.sHPointClickTargets)
    addObjectsToScene(this.pointCloud.sHPoints)

    forEach(this.pointCloud.sHPointClickTargets, addListnerSHPoint) // apply event listner to points

    this.onPointClickFcts.push( function (sHPoint) {
      self.focussedPoint = sHPoint
    })

    this.noSelectedStakeholderFcts.push( function () {
      self.focussedPoint = undefined
    })

    this.onPointClickFcts.push(function (sHPoint) { // relay current sHPoint back to the parent component
      self.component.updateSelectedStakeholder(sHPoint)
    })


    ///////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////// UTILITIES ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    //////////////////// processing for when you click a point ////////////////////////

    function addListnerSHPoint (sHPoint) {  // apply event listner to points
      var mesh = sHPoint.mesh
      domEvents.addEventListener(mesh, 'click', function(){
        self.onPointClickFcts.forEach( function(onPointClickFct) {
          onPointClickFct(sHPoint)
        })
      }, false)
    }

    ///////////////////////// adding & removing objects from scene /////////////////////////////////

    function addObjectToScene (object) {
      self.scene.add(object.mesh)
    }

    function addObjectsToScene(objects) {
      forEach(objects, addObjectToScene)
    }

    function removeObjectFromScene(object) {
      self.scene.remove( object.mesh )
    }

    function removeObjectsFromScene (objects) {
      forEach( objects, removeObjectFromScene )
    }

    //////////////////////////////////// billboarding ////////////////////////////////////////////////

    function billboardObjects (objects) {
      forEach(objects, function(object) {
        billboardObject(object)
      })
    }

    function billboardObject(object) {
      object.mesh.quaternion.copy( self.camera.quaternion )
    }

    ///////////////////// logic when stakeholder modal is closed ////////////////////////

    this.noSelectedStakeholder = function () {
      this.noSelectedStakeholderFcts.forEach( function(noSelectedStakeholderFct) {
        noSelectedStakeholderFct()
      })
    }

    ///////////////////// Aimate Point Cloud Point Cloud ////////////////////////

    this.onUpdateTimeFcts.push( function (time) {
      self.pointCloud.updatePositions(time)
    })

    this.updateTime = function (time) {
      self.currentWeek = time
      this.onUpdateTimeFcts.forEach( function(onUpdateTimeFct) {
        onUpdateTimeFct(time)
      })
    }

    //////////////////////////////////////////////////////////////////////////////
    //    render the scene            //
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