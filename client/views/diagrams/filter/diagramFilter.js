//UI: diagramFilter
Template.diagramFilter.helpers({
    tables: function () {
        var query = {project_id: getProjectId(), type: {$nin:['root']} };

        return Diagrams.find(query);
    },

    tableSettings: function () {
        return {
        group: 'diagramFilter',
        rowsPerPage: 15,
            showNavigation: 'auto',
            fields: [
                { key: 'title', label: 'Title', fn: function(value, object){
                    var href = '/graph/' + object._id;
                    return new Spacebars.SafeString('<a href="' + href + '">' + value + '</a>');
                } },
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
