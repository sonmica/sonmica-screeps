var actions = require('actions.storeEnergy');

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {
        /* STATES
         * - EMPTY
         * - CARRYING
         * - FULL
         * ROOM STATES
         * - RESOURCE_ENERGY on the ground
         * - No RESOURCE_ENERGY on the ground
         */
	    if(creep.store.getFreeCapacity() > 0) {
            creep.say("Collecting");
            var sources = creep.room.find(FIND_DROPPED_RESOURCES);
            if(sources.length > 0) {    
                if(creep.pickup(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.say("Storing");
                    var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType === STRUCTURE_EXTENSION ||
                                        structure.structureType === STRUCTURE_SPAWN ||
                                        structure.structureType === STRUCTURE_TOWER ||
                                        structure.structureType === STRUCTURE_CONTAINER) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });
                    // TODO: priority ordering
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
            }
        }
        else {
            actions.storeEnergy(creep);
        }
	}
};

module.exports = roleCarrier;