// UPGRADE TO v0.6.x ???
Router.configure({
	//layoutTemplate : 'layout', //v0.6.0
	layout : 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'not_found'
	//	yieldTemplates: {
	//'footer': { to: 'footer' },
	//'tmplHeader': { to: 'header' }
	//	}
});

Router.map(function () {
	this.route('tmplHome'                 ,{path: '/'});
	this.route('tmpl_about'               ,{path: '/about'});
	this.route('tmpl_help'                ,{path: '/help'});
	this.route('tmpl_settings'            ,{path: '/settings'});
	this.route('tmpl_license'             ,{path: '/license'});
	this.route('tmpl_userprof_detail'     ,{path: '/profile'});

	/**
	 * MYSTUFF
	 */
	this.route('tmpl_mystuff'             ,{path: '/mystuff'});
	this.route('tmpl_userprof_detail', {
		path  : '/userprof/:_id',
		waitOn: function () {
			//			updateClickCnt(Tdocs, this.params._id);
			//			Session.set('selected_tdoc_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_userprof', this.params._id);
		},
		data  : function () {
			var tdoc = Tdocs.findOne(this.params._id);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Tdocs", link:"/tdocs", isActive:false},
				{title:tdoc.title, link:"", isActive:true}
			]});
			return tdoc;
		}
	});

	/**
	 * Tdocs
	 */
	this.route('tmpl_tdocs'               ,{path: '/tdocs'});
	this.route('tmpl_tdoc_add'            ,{path: '/tdocAdd'});
	this.route('tmpl_tdoc_detail', {
		path  : '/tdocs/:_id',
		waitOn: function () {
			Session.set('form_update', false);
			updateClickCnt(Tdocs, this.params._id);
			Session.set('selected_tdoc_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_tdoc', this.params._id);
		},
		data  : function () {
			var tdoc = Tdocs.findOne(this.params._id);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Tdocs", link:"/tdocs", isActive:false},
				{title:tdoc.title, link:"", isActive:true}
			]});
			return tdoc;
		}
	});

	/**
	 * Diagrams: Sequence
	 */
	this.route('tmpl_diagrams'               ,{path: '/diagrams'});
	this.route('tmpl_diagram_add'            ,{path: '/diagramAdd'});
	this.route('tmpl_diagram_detail', {
		path  : '/diagrams/:_id',
		waitOn: function () {
			Session.set('form_update', false);
			updateClickCnt(Diagrams, this.params._id);
			Session.set('has_sidebar', false);
			Session.set('selected_diagram_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_diagram', this.params._id);
		},
		data  : function () {
			var diagram = Diagrams.findOne(this.params._id);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Diagrams", link:"/diagrams", isActive:false},
				{title:diagram.title, link:"", isActive:true}
			]});
			return diagram;
		}
	});

	/**
	 * Diagrams: Graph
	 */
	this.route('tmpl_graphDgm_detail'         ,{path: '/diagramGraphAdd'});

	/**
	 * Glossarys
	 */
	this.route('tmpl_glossarys'               ,{path: '/glossarys'});
	this.route('tmpl_glossary_add'            ,{path: '/glossaryAdd'});
	this.route('tmpl_glossary_detail', {
		path  : '/glossarys/:_id',
		waitOn: function () {
			Session.set('form_update', false);
			updateClickCnt(Glossarys, this.params._id);
			Session.set('selected_glossary_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_glossary', this.params._id);
		},
		data  : function () {
			var glossary = Glossarys.findOne(this.params._id);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Glossarys", link:"/glossarys", isActive:false},
				{title:glossary.title, link:"", isActive:true}
			]});
			return glossary;
		}
	});

	/**
	 * Tdocs / Diagrams
	 */
	//	this.route('tmpl_tdoc_diagrams', {
	//		path  : '/tdocs/diagrams/:_id',
	//		waitOn: function () {
	//			Session.set('selected_tdoc_id', this.params._id);
	//			return Meteor.subscribe('pubsub_selected_tdoc', this.params._id);
	//			//return Meteor.subscribe('pubsub_selected_tdoc_diagrams', this.params._id);
	//		},
	//		data  : function () {
	//			return MovieTimelines.find({movieId: this.params._id, userId: { $in: ["admin", Meteor.userId()] } } );
	//		}
	//	});

	/**
	 * Persons
	 */
	this.route('tmpl_persons'             ,{path: '/persons'});
	this.route('tmpl_person_add'          ,{path: '/personAdd'});
	this.route('tmpl_person_detail', {
		path  : '/person/:_id',
		waitOn: function () {
			Session.set('form_update', false);
			updateClickCnt(Persons, this.params._id);
			Session.set('selected_person_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_person', this.params._id);
		},
		data  : function () {
			var person = Persons.findOne(this.params._id);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"People", link:"/persons", isActive:false},
				{title:person.name, link:"", isActive:true}
			]});
			return person;
		}
	});
});