var assert = require( 'assert' )
var RamDisk = require( '../' )

describe( 'RamDisk', function() {
  
  describe( 'contructor', function() {
    
    it( 'should work with default options', function() {
      var device = new RamDisk()
      assert.ok( device instanceof RamDisk )
    })
    
    it( 'should throw if blockSize != power of 2', function() {
      assert.throws( function() {
        var device = new RamDisk({ blockSize: 123 })
      })
    })
    
    it( 'should throw if clusterSize != multiple of blockSize', function() {
      assert.throws( function() {
        var device = new RamDisk({ clusterSize: 256 })
      })
      assert.throws( function() {
        var device = new RamDisk({ clusterSize: 1230 })
      })
    })
    
    it( 'should throw if size < clusterSize', function() {
      assert.throws( function() {
        var device = new RamDisk({ size: 2048 })
      })
    })
    
    it( 'should throw if size exceeds INT_MAX', function() {
      assert.throws( function() {
        var device = new RamDisk({ size: Math.pow( 2, 64 ) })
      })
    })
    
  })
  
})
