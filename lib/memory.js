/**
 * Memory Constructor
 * @return {Memory}
 */
function Memory() {
  
  if( !(this instanceof Memory) )
    return new Memory()
  
  this.clusters = new Array( this.clusterCount )
  
  Object.defineProperty( this, 'clusters', {
    enumerable: false
  })
  
}

/**
 * Memory Prototype
 * @type {Object}
 */
Memory.prototype = {
  
  constructor: Memory,
  
  getClusterAddress: function( lba ) {
    return ( lba / this.sectorsPerCluster ) | 0
  },
  
  allocate: function( clusterNumber ) {
    if( this.clusters[ clusterNumber ] != null )
      return
    this.clusters[ clusterNumber ] =
      new Buffer( this.clusterSize )
    if( this.zerofill )
      this.clusters[ clusterNumber ].fill( 0 )
    return this
  },
  
  allocateRange: function( from, to ) {
    for( var i = from; i <= to; i++ )
      this.allocate( i )
    return this
  },
  
  read: function( fromLBA, toLBA, buffer ) {
    
    var sizeof = ( toLBA - fromLBA ) * this.blockSize
    
    buffer = buffer || new Buffer( sizeof )
    buffer.fill( 0 )
    
    var startCluster = this.getClusterAddress( fromLBA )
    var startOffset = fromLBA % this.sectorsPerCluster
    var endCluster = this.getClusterAddress( toLBA )
    var endOffset = toLBA % this.sectorsPerCluster
    var clusters = endCluster - startCluster
    
    for( var i = 0; i <= clusters; i++ ) {
      var n = startCluster + i
      if( this.clusters[n] != null ) {
        if( n === startCluster ) {
          this.clusters[n].copy( buffer, 0, startOffset * this.blockSize )
        } else if( n === endCluster ) {
          this.clusters[n].copy( buffer, i * this.clusterSize, 0, endOffset * this.blockSize )
        } else {
          this.clusters[n].copy( buffer, i * this.clusterSize )
        }
      }
    }
    
    return buffer
    
  },
  
  write: function( fromLBA, buffer ) {
    
    var toLBA = fromLBA + ( buffer.length / this.blockSize )
    var startCluster = this.getClusterAddress( fromLBA )
    var startOffset = fromLBA % this.sectorsPerCluster
    var endCluster = this.getClusterAddress( toLBA )
    // var endOffset = toLBA % this.sectorsPerCluster
    var clusters = endCluster - startCluster
    
    this.allocateRange( startCluster, endCluster )
    
    for( var i = 0; i < clusters; i++ ) {
      var n = startCluster + i
      if( n === startCluster ) {
        buffer.copy( this.clusters[n], startOffset * this.blockSize )
      } else {
        buffer.copy( this.clusters[n], 0, i * this.clusterSize )
      }
    }
    
    return buffer.length
    
  },
  
  free: function( clusterNumber ) {
    this.clusters[ clusterNumber ] = void 0
    delete this.clusters[ clusterNumber ]
    return this
  },
  
  freeRange: function( from, to ) {
    for( var i = from; i < to; i++ )
      this.free( i )
    return this
  },
  
  reset: function() {
    this.clusters.length = 0
    this.clusters = new Array( this.clusterCount )
    return this
  },
  
}

// Exports
module.exports = Memory
