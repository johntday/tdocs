Template.tmpl_glossarys.helpers({
	glossarys: function() {
		return glossarysHandle;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
Template.tmpl_glossarys_sort_select.helpers({
	breadcrumbs: function() {
		return [
			{title:"home", link:"/", isActive:false},
			{title:"Glossarys", link:"/glossarys", isActive:true}
		];
	},
	option_value: function() {
		return Session.get('glossary_sort');
	},
	options: function() {
		return getGlossarySortingOptions();
	}
});
Template.tmpl_glossarys_sort_select.events({
	'click #glossary-sort': function(e) {
		e.preventDefault();
		var $selector = $('#glossary-sort');
		if ( Session.get('glossary_sort') !== $selector.val() ) {
			Session.set('glossary_sort', $selector.val());
			Router.go('/glossarys');
		}
		$selector = null;
	}
});
/*------------------------------------------------------------------------------------------------------------------------------*/
