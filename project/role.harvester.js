var actions = require('actions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            actions.harvestEnergy(creep);
        }
        else {
            actions.storeEnergy(creep);
        }
	}
};

module.exports = roleHarvester;