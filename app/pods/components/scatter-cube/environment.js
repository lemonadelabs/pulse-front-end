/* global THREE, THREEx, TWEEN, requestAnimationFrame */
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

  environment.lineGroup = {}

  environment.init = function (opts) {

    var self = this

    this.stakeholders = opts.stakeholders
    this.relationships = opts.relationships
    console.log(this.relationships.length)

    this.container = document.getElementById( "container" );

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.0001, 1000 );
    this.camera.position.set(-1.5,1,3)

    /////////////////////////// set up controls /////////////////////////////

    this.controls = new THREE.OrbitControls( this.camera, this.container );
    this.controls.maxDistance = 5
    this.controls.minDistance = 0.5
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
        console.log(self.target.mesh)
        self.target.mesh.visible = false
      }
    })

    ///////////////////// Create Connecting Lines ////////////////////////

    this.lineGroup = new LineGroup({
      connections: self.relationships
    })

    this.onPointClickFcts.push(removeConnectingLines)
    function removeConnectingLines () {
      removeObjectsFromScene(self.lineGroup.primaryConnections)
      self.lineGroup.primaryConnections = []
    }

    this.onPointClickFcts.push( function (sHPoint) {
      var currentWeek = 1
      self.lineGroup.drawConnections(sHPoint, currentWeek)
    })

    this.onPointClickFcts.push( function () {
      addObjectsToScene(self.lineGroup.primaryConnections)
    })

    this.onRenderFcts.push(function () {
      self.lineGroup.update()
    })

    this.noSelectedStakeholderFcts.push(hideConnections)
    function hideConnections() {
      removeObjectsFromScene(self.lineGroup.primaryConnections)
    }

    ///////////////////// Create Point Cloud ////////////////////////

    this.pointCloud = new PointCloud({
      data: self.stakeholders,
      lineGroup: self.lineGroup,
      environment: this
    }) // todo make this more efficient, maybe share material between points, or find a more efficient way to render the clickTargets

    // this.lineGroup.connections = self.pointCloud.sHPointClickTargets // replace this with proper data!!

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

    setInterval(function () {
      var randomWeek = Math.floor(Math.random() * 4) + 1

      self.pointCloud.updatePositions(randomWeek)
    }, 4000)






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