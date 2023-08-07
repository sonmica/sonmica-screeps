var storeEnergy = require('actions.storeEnergy');
var harvestEnergy = require('actions.harvestEnergy');

var actions = {
    storeEnergy: function(creep) {
        storeEnergy.do(creep);
    },
    harvestEnergy: function(creep) {
        harvestEnergy.do(creep);
    }
}

module.exports = actions;