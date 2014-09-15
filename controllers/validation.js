function cat() {
    var head = _.first(arguments);
    if (head)
        return head.concat.apply(head, _.rest(arguments));
    else
        return [];
}

 function checker(/* validators */) {
    var validators = _.toArray(arguments);

    return function(obj) {
        return _.reduce(validators, function(errs, check) {
            if (check(obj))
                return errs
            else
                return _.chain(errs).push(check.message).value();
        }, []);
    };
}

function validator(message, fun) {
    var f = function(/* args */) {
        return fun.apply(fun, arguments);
    };

    f.message = message;
    return f;
}

function hasKeys(/* keys */) {
    var KEYS = _.toArray(arguments);
    var fun = function(obj) {
        return _.every(KEYS, function(k) {
            return _.has(obj, k);
        });
    };
    fun.message = cat(["Must have values for keys:"], KEYS).join(" ");
    return fun;
}

//function hasKeys(/* keys */) {
//    var KEYS = _.toArray(arguments);
//
//    var fun = function(obj) {
//        var missingKeys = _.reject(KEYS, function(k) {
//            return _.has(obj, k);
//        });
//        this.message = cat(["Missing values for keys:"], missingKeys).join(" ");
//        return (missingKeys.length === 0);
//    };
//
//    //fun.message = cat(["Must have values for keys:"], KEYS).join(" ");
//    return fun;
//}

function createInputErrorResponse(res, errors) {
    res.statusCode = 400;
    res.json(errors);
}

module.exports = {
    checker: checker,
    validator: validator,
    hasKeys: hasKeys,
    createInputErrorResponse: createInputErrorResponse
};
