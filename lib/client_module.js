if (Meteor.isServer) {
	getProjectId = function() {
		var u;
		if (this.userId)
			u = Meteor.users.findOne({_id: this.userId});
		return (u && u.project) ? u.project._id : '';
	};
}
if (Meteor.isClient) {
	getProject = function() {
		var u = Meteor.user();
		return (u && u.project) ? u.project : {};
	};
	getProjectId = function() {
		var u = Meteor.user();
		return (u && u.project) ? u.project._id : '';
	};
	getProjectTitle = function() {
		var u = Meteor.user();
		return (u && u.project) ? u.project.title : '';
	};
	getProjectOwnerId = function() {
		var u = Meteor.user();
		return (u && u.project) ? u.project.userId : '';
	};
	setProject = function(project) {
		var u = Meteor.user();
		if (!u)
			return false;

		Meteor.call('updateUserProject', project, function(error) {
			if(error){
				throwError(error.reason);
			}
		});

		return true;
	};

	/*
	 COMMON CLIENT module
	 */
    Meteor.MyClientModule = (function () {
        var oPublic = {};
        var debug = false; // change me to true to get log performance to console
	    var snark = ["hi ho", "yo", "blah, blah, blah", "$#!*", "when pigs fly", "good grief", "dude"];

		/*
		 APP CONFIG PARMS
		 */
	    oPublic.appConfig = {
		    pageLimit: 10, pageLimitMid: 10, pageLimitMax: 10,
		    panelLimit: 5, panelLimitMid: 400, panelLimitMax: 1000
	    };

	    /*
	     * Get a random snarky text snippet
	     */
	    oPublic.getRandomSnarkText = function() {
		    var i = Math.floor(Random.fraction() * snark.length);
		    return snark[i];
	    };

	    oPublic.toString = function(myobject) {
		    if (typeof myobject === 'undefined')
		        return "undefined";
		    if (myobject === null)
			    return "null";
//		    var s = "";
//		    for(var propertyName in myobject) {
//			    s += propertyName + ":'" + myobject[propertyName] + "', ";
//		    }
		    //return s.substring(0, s.length-2);
		    return JSON.stringify(myobject);
	    };

	    /*
	     * Scroll to top of page FAST
	     */
	    oPublic.scrollToTopOfPageFast = function() {
		    $('html, body').animate({ scrollTop: 0 }, 'fast');
	    };

	    oPublic.scrollToBottomOfPageFast = function(selector, animationSpeed) {
		    animationSpeed = (animationSpeed) ? animationSpeed : 1000;
		    if (selector)
		        $("html, body").animate({ scrollTop: $(selector).offset().top - 60 }, animationSpeed);
	    };

        // Returns an event map that handles the "escape" and "return" keys and
        // "blur" events on a text input (given by selector) and interprets them
        // as "ok" or "cancel"
        oPublic.okCancelEvents = function (selector, callbacks) {
            var ok = callbacks.ok || function () {
            };
            var cancel = callbacks.cancel || function () {
            };

            var events = {};
            events['keyup ' + selector + ', keydown ' + selector + ', focusout ' + selector] =
                function (evt) {
                    if (evt.type === "keydown" && evt.which === 27) {
                        // escape = cancel
                        cancel.call(this, evt);

                    } else if (evt.type === "keyup" && evt.which === 13 ||
                        evt.type === "focusout") {
                        // blur/return/enter = ok/submit if non-empty
                        var value = String(evt.target.value || "");
                        if (value)
                            ok.call(this, value, evt);
                        else
                            cancel.call(this, evt);
                    }
                };

            return events;
        };

        oPublic.activateInput = function (input) {
            input.focus();
            input.select();
        };

	 /*
	 performance log for collection
	 */
//        oPublic.performanceCollectionLog = function () {
//            if (debug) {
//                var wrappedFind = Meteor.Collection.prototype.find;
//
//                Meteor.Collection.prototype.find = function () {
//                    var cursor = wrappedFind.apply(this, arguments);
//                    var collectionName = this._name;
//
//                    cursor.observeChanges({
//                        added: function (id, fields) {
//                            console.log(collectionName, 'added', id, fields);
//                        },
//
//                        changed: function (id, fields) {
//                            console.log(collectionName, 'changed', id, fields);
//                        },
//
//                        movedBefore: function (id, before) {
//                            console.log(collectionName, 'movedBefore', id, before);
//                        },
//
//                        removed: function (id) {
//                            console.log(collectionName, 'removed', id);
//                        }
//                    });
//
//                    return cursor;
//                };
//            }
//        };

        /*
         PURPOSE:  performance log for templates
         REF:  http://projectricochet.com/blog/meteor-js-performance
         USAGE:  add the following code to bottom of "main.js"
             "Meteor.MyClientModule.performanceLogRenders();"
         */
        oPublic.performanceLogRenders = function () {
            if (debug) {
                _.each(Template, function (template, name) {
                    var oldRender = template.rendered;
                    var counter = 0;

                    template.rendered = function () {
                        console.log(name, "renderedCount: ", ++counter);
                        oldRender && oldRender.apply(this, arguments);
                    };
                });
            }
        };

        return oPublic;
    }());
}