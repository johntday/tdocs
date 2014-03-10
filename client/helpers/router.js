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
	this.route('test'                     ,{path: '/test'});
	this.route('tmplHome'                 ,{path: '/'});
	this.route('tmpl_about'               ,{path: '/about'});
	this.route('tmpl_help'                ,{path: '/help'});
	this.route('tmpl_settings'            ,{path: '/settings'});
	this.route('tmpl_license'             ,{path: '/license'});
	this.route('tmpl_userprof_detail'     ,{path: '/profile'});
	//this.route('accountsAdmin'            ,{path: '/admin/users'});

	/**
	 * ADMIN
	 */
	this.route('accountsAdmin', {
		path  : '/admin/users',
		template: 'accountsAdmin'
	});

	/**
	 * MYSTUFF
	 */
	this.route('tmpl_mystuff'             ,{path: '/mystuff'});
	this.route('tmpl_userprof_detail', {
		path  : '/userprof/:_id',
		waitOn: function () {
			//			Session.set('selected_tdoc_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_userprof', this.params._id);
		},
		data  : function () {
			var tdoc = Tdocs.findOne(this.params._id);
			if (!toc) return {};
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
			Session.set('selected_tdoc_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_tdoc', this.params._id);
		},
		data  : function () {
			var tdoc = Tdocs.findOne(this.params._id);
			if (!toc) return {};
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Tdocs", link:"/tdocs", isActive:false},
				{title:tdoc.title, link:"", isActive:true}
			]});
			return tdoc;
		}
	});

	/**
	 * Noun
	 */
	//this.route('tmpl_nouns'               ,{path: '/nouns'});
	this.route('tmpl_noun_add'            ,{path: '/nounAdd'});
	this.route('tmpl_noun_detail', {
		path  : '/nouns/:_id',
		data  : function () {
			Session.set('form_update', false);
			var noun = Nouns.findOne(this.params._id);
			if (!noun) return {};

			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title: ea.getClassBelongsToArea(noun.class_name), link:"#", isActive:false},
				{title: noun.class_name, link:"#", isActive:false},
				{title:noun.title, link:"", isActive:true}
			]});
			return noun;
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
			Session.set('has_sidebar', false);
			Session.set('selected_diagram_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_diagram', this.params._id);
		},
		data  : function () {
			var diagram = Diagrams.findOne(this.params._id);
			if (!diagram) return {};
			Session.set('form_update', false);
			if ( diagram && !diagram.code )
				Session.set('form_update', true);
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
	this.route('tmpl_graphDgm_add'            ,{path: '/diagramGraphAdd'});
	this.route('tmpl_graphDgm_detail', {
		path  : '/graph/:_id',
		waitOn: function () {
			Session.set('has_sidebar', false);
			Session.set('selected_diagram_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_diagram', this.params._id);
		},
		data  : function () {
			var diagram = Diagrams.findOne(this.params._id);
			if (!diagram) return {};
			Session.set('form_update', false);
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Diagrams", link:"/diagrams", isActive:false},
				{title:diagram.title, link:"", isActive:true}
			]});
			return diagram;
		}
	});

	/**
	 * Glossarys
	 */
	this.route('tmpl_glossarys'               ,{path: '/glossarys'});
	this.route('tmpl_glossary_add'            ,{path: '/glossaryAdd'});
	this.route('tmpl_glossary_detail', {
		path  : '/glossarys/:_id',
//		waitOn: function () {
//			return Meteor.subscribe('pubsub_selected_glossary', this.params._id);
//		},
		data  : function () {
			Session.set('form_update', false);
//			Session.set('selected_glossary_id', this.params._id);
			var glossary = Glossarys.findOne(this.params._id);
			if (!glossary) return {};
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Glossarys", link:"/glossarys", isActive:false},
				{title:glossary.title, link:"", isActive:true}
			]});
			return glossary;
		}
	});

	/**
	 * Tables
	 */
	this.route('tmpl_tables'               ,{path: '/tables'});
	this.route('tmpl_table_add'            ,{path: '/tableAdd'});
	this.route('tmpl_table_detail', {
		path  : '/tables/:_id',
		waitOn: function () {
			Session.set('form_update', false);
			Session.set('selected_table_id', this.params._id);
			return Meteor.subscribe('pubsub_selected_table', this.params._id);
		},
		data  : function () {
			var table = Tables.findOne(this.params._id);
			if (!table) return {};
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Tables", link:"/tables", isActive:false},
				{title:table.title, link:"", isActive:true}
			]});
			return table;
		}
	});

	/**
	 * Projects
	 */
	this.route('tmpl_projects'               ,{path: '/projects'});
	this.route('tmpl_project_add'            ,{path: '/projectAdd'});
	this.route('tmpl_project_detail', {
		path  : '/projects/:_id',
		waitOn: function () {
			return [
				Meteor.subscribe('pubsub_selected_project', this.params._id),
				Meteor.subscribe('pubsub_buscap_list', {project_id: getProjectId(), class_name: ea.class_name.Business_Capability}, null, 10000),
				Meteor.subscribe('pubsub_buscap_list', {project_id: getProjectId(), class_name: ea.class_name.Business_Domain}, null, 10000)
		        ];
		},
		data  : function () {
			Session.set('form_update', false);
			var project = Projects.findOne(this.params._id);
			if (!project) {
				setProject(null);
				Router.go('/');
			}
			setProject(project);
			sidebar.bus_capabilities.destroy();
			Session.set('breadcrumbs', {breadcrumbs: [
				{title:"home", link:"/", isActive:false},
				{title:"Projects", link:"/projects", isActive:false},
				{title:project.title, link:"", isActive:true}
			]});
			return project;
		}
	});

});