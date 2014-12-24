var assert = require( 'assert' )
var RamDisk = require( '../' )

describe( 'RAMDISK', function() {
  
  describe( 'contructor', function() {
    
    it( 'should work with default options', function() {
      var device = new RamDisk()
      assert.ok( device instanceof RamDisk )
    })
    
  })
  
})
