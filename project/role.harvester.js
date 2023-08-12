var actions = require('creepActions');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.store.getFreeCapacity() > 0) {
            if(!actions.harvestEnergy(creep)) {
                actions.storeEnergy(creep);
            };
        }
        else {
            actions.storeEnergy(creep);
        }
	}
};

module.exports = roleHarvester;