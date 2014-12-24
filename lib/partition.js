/**
 * Partition Constructor
 * @return {Partition}
 */
function Partition( device, options ) {
  
  if( !(this instanceof Partition) )
    return new Partition( device, options )
  
  this.device = device
  
  this.firstLBA = options.firstLBA || 0
  this.lastLBA = options.lastLBA || -1
  
}

/**
 * Partition Prototype
 * @type {Object}
 */
Partition.prototype = {
  
  constructor: Partition,
  
  __OOB: function( lba ) {
    return lba < this.firstLBA ||
      lba > this.lastLBA
  },
  
  get blockSize() {
    return this.device.blockSize
  },
  
  get sectors() {
    return this.lastLBA - this.firstLBA
  },
  
  get size() {
    return this.sectors * this.blockSize
  },
  
  readBlocks: function( from, to, buffer, callback ) {
    
    callback = callback.bind( this )
    
    from = from + this.firstLBA
    to = to + this.firstLBA
    
    if( this.__OOB( from ) || this.__OOB( to ) ) {
      var msg = 'Block address out of bounds: ' +
        '['+from+','+to+'] not in range ' +
        '['+this.firstLBA+','+this.lastLBA+']'
      return callback( new Error( msg ) )
    }
    
    this.device.readBlocks( from, to, buffer, callback )
    
    return this
    
  },
  
  writeBlocks: function( from, data, callback ) {
    
    callback = callback.bind( this )
    
    from = from + this.firstLBA
    
    if( this.__OOB( from ) ) {
      var msg = 'Block address out of bounds: ' +
        '['+from+','+to+'] not in range ' +
        '['+this.firstLBA+','+this.lastLBA+']'
      return callback( new Error( msg ) )
    }
    
    this.device.writeBlocks( from, data, callback )
    
    return this
    
  },
  
}

// Exports
module.exports = Partition
