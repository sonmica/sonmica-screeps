var storeEnergy = require('actions.storeEnergy');
var harvestEnergy = require('actions.harvestEnergy');
var withdrawEnergy = require('actions.withdrawEnergy');

var creepActions = {
    storeEnergy: function(creep) {
        storeEnergy.do(creep);
    },
    harvestEnergy: function(creep) {
        harvestEnergy.do(creep);
    },
    withdrawEnergy: function(creep) {
        withdrawEnergy.do(creep);
    }
}

module.exports = creepActions;