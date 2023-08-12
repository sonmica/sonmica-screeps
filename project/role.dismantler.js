var actions = require('actions');

var roleDismantler = {

    /** @param {Creep} creep **/
    /** @param {Structure} structure **/
    run: function(creep, structure) {
        if(creep.memory.dismantling && creep.store.getFreeCapacity() === 0) {
            creep.memory.dismantling === false;
            creep.say('🔄 Full');
        }
	    if(!creep.memory.dismantling && creep.store[RESOURCE_ENERGY] === 0) {
	        creep.memory.dismantling = true;
	        creep.say('🚧 Dismantle');
	    }

	    if(creep.memory.dismantling) {
            if(creep.dismantle(structure) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structure, {visualizePathStyle: {stroke: '#FFAA00'}});
            }
	    }
	    else {
            actions.storeEnergy(creep);
	    }
	}
};

module.exports = roleDismantler;