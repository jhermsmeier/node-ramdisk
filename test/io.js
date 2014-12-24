var assert = require( 'assert' )
var RamDisk = require( '../' )

describe( 'RamDisk', function() {
  
  var device = new RamDisk()
  var fromLBA = ( Math.random() * 7532 ) | 0
  
  // console.log( 'FROM LBA', fromLBA )
  
  describe( 'writeBlocks', function() {
    
    it( 'should be able to write to a ramdisk', function( done ) {
      var buffer = new Buffer( device.blockSize * 13 )
      buffer.write( 'A message. Hello. Goodbye.' )
      device.writeBlocks( fromLBA, buffer, done )
    })
    
  })
  
  describe( 'readBlocks', function() {
    
    it( 'should be able to read back what it wrote', function( done ) {
      var msg = 'A message. Hello. Goodbye.'
      device.readBlocks(
        fromLBA, null, null,
        function( error, buffer, bytesRead ) {
          // console.log( buffer.toString() )
          assert.ok( buffer.toString().indexOf( msg ) >= 0 )
          done( error )
        }
      )
    })
    
  })
  
})
