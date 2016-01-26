export default function NavArrows (opts) {

  this.arrows = []

  this.scene = opts.scene

  this.jsonLoader = opts.jsonLoader

  this.domEvents = opts.domEvents

  this.coords = {
    // , support ,
    VitalHiLoPowerLeft : new THREE.Vector3(-0.3,-0.2,2),
    VitalHiLoPowerRight : new THREE.Vector3(0,-0.2,2.3),

    PowerHiHiVitalLeft : new THREE.Vector3(1,0,1),
    PowerHiHiVitalRight : new THREE.Vector3(1,0,1),
  }

  this.rotation = {
    VitalHiLoPowerLeft : - Math.PI / 4,
    VitalHiLoPowerRight : - Math.PI / 4,

    PowerHiHiVitalLeft : Math.PI / 4,
    PowerHiHiVitalRight : Math.PI / 4,
  }

  this.navControlls = {
    VitalHiLoPowerLeft: function () {
      opts.navController.vitalXsupportOrthographicLoHo()
    },

    VitalHiLoPowerRight : function () {
      opts.navController.powerXsupportOrthographicLoHi()
    }
  }

  this.VitalHiLoPowerLeft = this.createCornerArrow({
    name : 'VitalHiLoPowerLeft'
  })
  this.VitalHiLoPowerRight = this.createCornerArrow({
    name : 'VitalHiLoPowerRight'
  })


  this.PowerHiHiVitalLeft = this.createCornerArrow({
    name : 'PowerHiHiVitalLeft'
  })
  this.PowerHiHiVitalRight = this.createCornerArrow({
    name : 'PowerHiHiVitalRight'
  })




}


NavArrows.prototype.createCornerArrow = function(opts) {
  var self = this
  var name = opts.name

  console.log(name)

  var material = new THREE.MeshBasicMaterial({
    shading: THREE.FlatShading,
    color: 0xffffff,
    transparent: true,
    side: THREE.DoubleSide
    // opacity: 0,
    // depthTest: false // makes the labels render in front of the danger zone
  });

  var geometry = new THREE.PlaneGeometry(0.2, 0.05, 1, 1) // this is where we will user the objectLoader

  if ( _.endsWith(name, 'Left') ) {

  } else {

  }

  var mesh = new THREE.Mesh(geometry, material)

  mesh.position.set( this.coords[name].x, this.coords[name].y, this.coords[name].z )

  mesh.rotateY(this.rotation[name])

  this.scene.add(mesh)

  this.domEvents.addEventListener(mesh, 'click', function(){
    self.navControlls[name]()
  }, false)



};

NavArrows.prototype.CreateSideArrow = function(opts) {
  var name = opts.name
  var coords = this.coords[name]
};


