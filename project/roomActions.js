var sortStructuresByHealth = require('actions.sortStructuresByHealth');

var roomActions = {
    sortStructuresByHealth(structures) {
        sortStructuresByHealth.sort(structures);
    }
}

module.exports = roomActions;