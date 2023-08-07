var actions = require('actions');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                // prioritise the constructions that are closest to completion
                targets.sort((a, b) => {
                    const aProgress = a.progress / a.progressTotal;
                    const bProgress = b.progress / b.progressTotal;
                    return aProgress < bProgress;
                });
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
                creep.say(`🚧 ${targets[0].structureType}`);
            } else {
                // Nothing to build - drop energy on the ground
                creep.say('Idle');
                creep.memory.building = false;
                creep.drop(RESOURCE_ENERGY);
            }
	    }
	    else { 
            if(!actions.withdrawEnergy(creep)) {
                creep.say('🔄 harvest');
                actions.harvestEnergy(creep);
            }
	    }
	}
};

module.exports = roleBuilder;