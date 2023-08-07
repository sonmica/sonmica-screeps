var actions = require('actions');

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
                    actions.storeEnergy(creep);
                }
            }
        }
        else {
            actions.storeEnergy(creep);
        }
	}
};

module.exports = roleCarrier;