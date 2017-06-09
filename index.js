var DEBUG = true;

var msgHandlers = {};

function addMsgHandler(msg, func, caller, pri) {
    if (!msgHandlers[msg]) msgHandlers[ msg ] = [];

    caller = 'object' == typeof caller ? caller : null;
    pri = parseInt(pri) ? parseInt(pri) : 0;
    msgHandlers[ msg ].push({
        'func' : func,
        'pri' : pri
    });
    msgHandlers[ msg ].sort( function(a, b) {
        return b.pri - a.pri;
    });
}

function callMsgHandler(msg, args) {
    if ('object' == typeof msgHandlers[msg] && msgHandlers[msg]) {
        msgHandlers[msg].forEach(function(h) {
            try {
                h.func.apply(null, args);
            } catch (e) {
                if (DEBUG) console.log('error in messsage handler:', e);
            }
        });
    }
}

function isMsgHandlerRegistered(msg, func) {
    var ret = false;

    if (msgHandlers[ msg ]) {
        ret = msgHandlers[ msg ].some(function(mh) {
            return mh.func === func;
        });
    }

    return ret;
}

function removeMsgHandler(msg, func) {
    var ret = false;

    if ('object' == typeof msgHandlers[msg]) {
        var mh;

        for (var i = msgHandlers[msg].length - 1; i >= 0; i--) {
            mh = msgHandlers[msg][i];

            if (mh.func === func) {
                msgHandlers[msg].splice(i, 1);

                ret = true;
            }
        }

        if (!msgHandlers[msg].length) delete msgHandlers[msg];
    }

    return ret;
}

var msger = {
    sub: function(msg, func, caller, pri) {
        if ( isMsgHandlerRegistered(msg, func) ) return;

        addMsgHandler(msg, func, caller, pri);
    },

    pub: function(msg) {
        callMsgHandler(msg, [].splice.call(arguments, 1));
    },

    del: function(msg, func) {
        removeMsgHandler(msg, func);
    }
};

export default msger;
