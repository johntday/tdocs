//UI: nouns
Template.noun_filter_list.helpers({
    tables: function () {
        var query = {project_id: getProjectId(), type: {$nin:['root']} };
        if (queryFilters.nouns){
            query = _.extend( query, queryFilters.nouns );
            queryFilters.nouns = {};
        }

        return Nouns.find(query);
    },

    tableSettings: function () {
        return {
            rowsPerPage: 15,
            showNavigation: 'auto',
            fields: [
                { key: 'class_name', label: ' ', fn: function(value){
                    var icon_class = "glyphicon glyphicon-" + ea.getClassBelongsToArea(value).icon;
                    return new Spacebars.SafeString('<span class="' + icon_class + '"> </span> ');
                } },
                { key: 'title', label: 'Title', fn: function(value, object){
                    var href = '/nouns/' + object._id;
                    return new Spacebars.SafeString('<a href="' + href + '">' + value + '</a>');
                } },
                { key: 'class_name', label: 'Type' },
                { key: 'description', label: 'Description' },
                { key: 'created', label: 'Created', fn: function(value){
                    return (value) ? moment(value).fromNow() : "Never Created";
                } },
                { key: 'updated', label: 'Updated', fn: function(value){
                    return (value) ? moment(value).fromNow() : "Never Updated";
                } },
                { key: 'owner', label: 'Owner' }
            ]
        };
    }
});
/*------------------------------------------------------------------------------------------------------------------------------*/
