var actions = require('creepActions');

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

        // State Management
        if(creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
            creep.say('Storing');
        }
        if(!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
            creep.say('Collecting');
        }

        // Actions
        if(creep.memory.collecting) {
            var closestSource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            if(closestSource) {
                if(creep.pickup(closestSource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource, {visualizePath: {stroke: '#ffaa00'}});
                }
            } else {
                creep.say('🔄Storing');
                creep.memory.collecting = false;
            }
        } else {
            actions.storeEnergy(creep);
        }
	}
};

module.exports = roleCarrier;