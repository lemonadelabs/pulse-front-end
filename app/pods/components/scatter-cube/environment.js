/* global THREE, THREEx, TWEEN, requestAnimationFrame */
import LabelGroup from './labelGroup';
import PointCloud from './pointCloud';
import ConnectingLine from './connectingLine';
// import data from './testData'
import data4Week from './testDataMultiWeek'


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

  environment.init = function () {

    var self = this

    this.container = document.getElementById( "container" );

    /////////////////////////// set up camera /////////////////////////////

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 10000 );
    this.camera.position.set(-1.5,1,3)

    /////////////////////////// set up controls /////////////////////////////

    this.controls = new THREE.OrbitControls( this.camera, this.container );
    this.controls.maxDistance = 5
    this.controls.minDistance = 0.5
    this.controls.zoomSpeed = 0.2
    this.controls.target.set(1,1,1)
    this.controls.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE };


    this.onRenderFcts.push(this.controls.update)

    /////////////////////////// set up scene /////////////////////////////

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setClearColor( 0x222628 );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.sortObjects = false;
    this.container.appendChild( this.renderer.domElement );

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

    function lookAtCameraUpdate (objects) {
      forEach(objects, function(object) {
        object.mesh.quaternion.copy( self.camera.quaternion )
      })
    }

    this.onRenderFcts.push(function () {
      lookAtCameraUpdate(labelGroup.labels)
    })

    ///////////////////// Create Target ////////////////////////

    this.jSONloader.load('./assets/geometries/selected-widget.json', function (geometry) {

      self.target = {}

      var material = new THREE.MeshBasicMaterial({shading: THREE.FlatShading, color: 0xffffff, side: THREE.DoubleSide});
      self.target.mesh = new THREE.Mesh(geometry, material)

      self.target.mesh.visible = false

      self.scene.add(self.target.mesh)

      self.onRenderFcts.push(function () { // billboarding
        self.target.mesh.quaternion.copy( self.camera.quaternion )
      })

      self.onPointClickFcts.push(updateTargetLocation)
      function updateTargetLocation (sHPoint) {
        self.target.mesh.visible = true
        self.target.mesh.position.copy(sHPoint.mesh.position)
      }


      // hide target
      self.noSelectedStakeholderFcts.push(hideTarget)
      function hideTarget () {
        self.target.mesh.visible = false
      }

    })


    ///////////////////// Create Point Cloud ////////////////////////

    var sHData = data4Week()
    this.pointCloud = new PointCloud({ data: sHData }) // todo make this more efficient, maybe share material between points, or find a more efficient way to render the clickTargets

    addObjectsToScene(this.pointCloud.sHPointClickTargets)
    addObjectsToScene(this.pointCloud.sHPoints)

    forEach(this.pointCloud.sHPointClickTargets, sHPointListner)

    this.onPointClickFcts.push(function (sHPoint) { // relay current sHPoint back to the parent component
      self.component.updateSelectedStakeholder(sHPoint)
    })

    function sHPointListner (sHPoint) {

      var mesh = sHPoint.mesh
      domEvents.addEventListener(mesh, 'click', function(){
        self.onPointClickFcts.forEach( function(onPointClickFct) {
          onPointClickFct(sHPoint)
        })
      }, false)
    }





    ///////////////////// Create Connecting Lines ////////////////////////

    this.connectingLines = []

    this.onPointClickFcts.push(removeConnectingLines)
    function removeConnectingLines () {
      removeObjectsFromScene(self.connectingLines)
      self.connectingLines = []
    }


    this.onPointClickFcts.push(drawConnections)
    function drawConnections (sHPoint) {
      var pointA = sHPoint
      var connections = self.pointCloud.sHPoints // change this to actual connection data
      forEach(connections, function (pointB) {

        var line = new ConnectingLine({
          // pass in material depending on the connection strength
          a: pointA.mesh.position,
          b: pointB.mesh.position
        })
        self.connectingLines.push(line)
      })
      addObjectsToScene(self.connectingLines)
    }

    this.noSelectedStakeholderFcts.push(hideConnections)
    function hideConnections() {
      removeObjectsFromScene(self.connectingLines)
    }



    ///////////////////// logic when stakeholder modal is closed ////////////////////////

    this.noSelectedStakeholder = function () {
      this.noSelectedStakeholderFcts.forEach( function(noSelectedStakeholderFct) {
        noSelectedStakeholderFct()
      })
    }

    // setInterval(function() { // for testing purposes, delete later
    //   self.component.updateSelectedStakeholder(undefined)
    // }, 4000)


    ///////////////////// Aimate Point Cloud Point Cloud ////////////////////////

    // setInterval(function () {
    //   var randomWeek = Math.floor(Math.random() * 4) + 1

    //   self.pointCloud.updatePositions(randomWeek)
    // }, 4000)


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