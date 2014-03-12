Pages = Meteor.Paginate(
	"items",
	{
		sort: {title: 1}
		,router: "iron-router"
//		,router: true
//		,homeRoute: "/"
//		,infinite: true
//		,infiniteTrigger: 600
//		,pageSizeLimit: 60
//		,rateLimit: 1
		,route: "/item/"
		,templateName: "items"
		,routerTemplate: "items"
	}
);
/*------------------------------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------*/

