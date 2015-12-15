import LabelGroup from './labelGroup';
import PointCloud from './pointCloud';
import Target from './target';
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

    this.jSONloader.load('./assets/geometries/axis-cube.json', function (geometry, mat) {
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

    var target = new Target({
      jSONloader: this.jSONloader,
      scene: this.scene
    })

    ///////////////////// Create Point Cloud ////////////////////////

    var sHData = data4Week()
    var pointCloud = new PointCloud({ data: sHData })

    forEach(pointCloud.sHPoints, addToScene)

    forEach(pointCloud.sHPoints, sHPointListner)

    function addToScene (object) {
      self.scene.add(object.mesh)
    }

    function sHPointListner (sHPoint) {
      var mesh = sHPoint.mesh
      domEvents.addEventListener(mesh, 'click', function(event){
        self.component.updateSelectedStakeholder(sHPoint)

        // move/show the target!!

      }, false)
    }

    ///////////////////// Aimate Point Cloud Point Cloud ////////////////////////

    // setInterval(function () {
    //   var randomWeek = Math.floor(Math.random() * 4) + 1

    //   pointCloud.updatePositions(randomWeek)
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
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}