export default function data () {

  var testData = []
  for (var i = 0; i < 500; i++) {
    testData.push({
      'power' : Math.random(),
      'support': Math.random(),
      'vital' : Math.random(),
      // 'power' : 0,
      // 'support': 0,
      // 'vital' : 0,
      'name' : 'Ash',
      'image': 'http://orig13.deviantart.net/a634/f/2014/091/d/c/ash_ketchum_by_mighty355-d7cjdfg.png',
      'company' : 'freelance',
      'role' : 'Trainer',
      'tags' : 'Pokemon'
    })
  };

  return testData
}