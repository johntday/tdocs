Template.adminCoreData.helpers({
	isAdmin: function() {
		return isAdmin();
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.adminCoreData.events({
	'click #admin_earels_data_reset': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		Meteor.call('resetEA_Relationships', function(error, results) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( 'Successfully reset EA_Relationships: insertCnt='+results[0]+', found='+results[1], {type:'s', hideSnark:true, delay:0} );
				$(e.target).removeClass('disabled');
			}
		});
	},
	'click #admin_eanouns_data_reset': function(e) {
		e.preventDefault();
		$(e.target).addClass('disabled');

		Meteor.call('resetEA_Nouns', function(error, results) {
			if(error){
				throwError(error.reason);
				$(e.target).removeClass('disabled');
			}else{
				growl( 'Successfully reset EA_Nouns: insertCnt='+results[0]+', found='+results[1], {type:'s', hideSnark:true, delay:0} );
				$(e.target).removeClass('disabled');
			}
		});
	}

});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.adminCoreData.rendered = function() {
};