// based on https://github.com/caesarion/scratch4tuio

var Tuio = require('./tuio.js');

module.exports = (function() { 'use strict';

    // define helper functions that work on the input of the blocks ----------------------------------------

    // coordinate conversion from tuio to scratch coordinates.
    // @param: xCoordinate -> the x-coordinate value. It is a number
    // between 0 and 1 (e.g. a procentage rate). 0 means total left, 1 means total right.
    // @result: the x value in scratch coordinates. A value between -240 (total left) and + 240 (total right)
    var convertXToScratchCoordinate = function(xCoordinate) {
        return Math.round(-240.0 + 480.0 * xCoordinate);
    };
    // coordinate conversion from tuio to scratch coordinates.
    // @param: yCoordinate --> the y-coordinate value. It is a number between 0 and 1
    // (e.g. a procentage rate). 0 means top, 1 means bottom
    // @result: the y value in scratch coordinates. A value between +180 (top) and -180 (bottom)
    var convertYToScratchCoordinate = function(yCoordinate) {
        return Math.round(180.0 - 360.0 * yCoordinate);
    };
    // end helper functions ----------------------------------------

    // initialize tuio client ------------------------------------------------------------------------------------------

    // list of all tuio cursors
    var tuioCursors = {};

    // true, when a cursor was added
    var isCursorAdded = false;

    // true, when a cursor was removed
    var isCursorRemoved = false;

    // references the latest tuio cursor
    var latestTuioCursor = null;

    // list of counters that holds for every symbol-id the update count
    // the counters are used to return false after the update-hat-block returned true two times.
    // Necessary for the continous execution of the update-hat-block's program stack.
    var trueUpdateCount = {};

    // the microseconds until an event expires (e.g. is not used any more)
    var expiringMicroseconds = 50000;

    // init socket.io client on port 5000 --------------------------------------------------------------------------
    var client = new Tuio.Client({
        host: 'http://localhost:5000'
    });

    // set the behavior of what should happen when a certain event occurs: -------------------------------------

    var onAddTuioCursor = function(addCursor) {
        tuioCursors[addCursor.sessionId] = addCursor;
        latestTuioCursor = addCursor;
        isCursorAdded = true;
    };

    var onUpdateTuioCursor = function(updateCursor) {
    };

    var onRemoveTuioCursor = function(removeCursor) {
        tuioCursors[removeCursor.sessionId] = null;
        isCursorRemoved = true;
    };

    var onRefresh = function(/*time*/) {
    };

    // bind the defined behavior to the events: --------------------------------------------------------------
    client.on('addTuioCursor', onAddTuioCursor);
    client.on('updateTuioCursor', onUpdateTuioCursor);
    client.on('removeTuioCursor', onRemoveTuioCursor);
    client.on('refresh', onRefresh);

    // try to connect the client to the helper-application server:
    // if there is no connection possible, the event based socket.io client assures to reconnect as soon as
    // the server is available
    client.connect();
    // end client initialisation -----------------------------------------------------------------------------------

    // Expose extension interface to module.exports
    return {
        // begin definition of block behavior ---------------------------------------------------------------------

        addCursorHatBlock: function() {
            if (isCursorAdded) {
        			isCursorAdded = false;
               return true;
            } else {
            	return false;
            }
        },

        removeCursorHatBlock: function() {
            if (isCursorRemoved) {
        			isCursorRemoved = false;
               return true;
            } else {
            	return false;
            }
        },


        // this method returns the sessionID of the latest added cursor
        getLatestTuioCursor: function() {
            return latestTuioCursor.sessionId;
        },

        // this method returns the cursor with sessionId id
        // @param: id ... cursor sessionId
        getTuioCursorWithID: function(id) {
            return tuioCursors[id];
        },

        // the method defines the behavior of the tuio-attribute-block. Returns the value of the
        // given attribute with attribtueName 
        getTuioAttribute: function(attributeName, id) {
            var menus = this.descriptor.menus;
            // switch between the selecte menu entry and return accordingly
            switch (attributeName) {
                case menus.cursorAttributes[0]: // Position X
                    return convertXToScratchCoordinate(tuioCursors[id].xPos);
                case menus.cursorAttributes[1]: // Position Y
                    return convertYToScratchCoordinate(tuioCursors[id].yPos);
            }
        },
        
        // the methood checks, if the cursor with sessionId id is already removed
        // @param: id ... cursor sessionId
        isTuioCursorWithIdRemoved: function(id) {
        	  if (tuioCursors[id] == null) {
        	  	return true;
        	  	} else {
        	  		return false;
        	  	}
        },
        // end block behavior definitions ----------------------------------------------------------------------------------

        // defined the shutdown behavior of the extension
        _shutdown: function() {
            console.log('Shutting down...');
            // client.socket.emit('disconnect');
            // client.onDisconnect();
            client.disconnect();
        },

        // standard answer
        _getStatus: function() {
            if (client.isConnected()) {
                return {status: 2, msg: 'Ready'};
            } else {
                return {status: 1, msg: 'No connection to dispatcher'};
            }
        }
    };
})();
