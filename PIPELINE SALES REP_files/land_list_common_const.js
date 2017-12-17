var LAST_UPDATED = "20171214-1600";

var CONSTANT = (function () {
    if (showDripsPanel) {
        var columnProperty = [
            {"columnid": "lotColumn", "columnname": "Lot", "columnposition": 1, "columnvisibility": true},
            {"columnid": "addressColumn", "columnname": "Address", "columnposition": 2, "columnvisibility": true},
            {"columnid": "projectStageColumn", "columnname": "Project - Stage", "columnposition": 3, "columnvisibility": true},
            {"columnid": "p2pColumn", "columnname": "P2P", "columnposition": 4, "columnvisibility": true},
            {"columnid": "titleDateColumn", "columnname": "Title Date", "columnposition": 5, "columnvisibility": true},
            {"columnid": "frontageMColumn", "columnname": "Frontage (m)", "columnposition": 6, "columnvisibility": true},
            {"columnid": "depthMColumn", "columnname": "Depth (m)", "columnposition": 7, "columnvisibility": true},
            {"columnid": "areaM2Column", "columnname": "Area (m2)", "columnposition": 8, "columnvisibility": true},
            {"columnid": "priceColumn", "columnname": "Price", "columnposition": 9, "columnvisibility": true},
            {"columnid": "dripsColumn", "columnname": "DRIPs", "columnposition": 10, "columnvisibility": true},
            {"columnid": "statusColumn", "columnname": "Status", "columnposition": 11, "columnvisibility": true},
            {"columnid": "marketingStatusColumn", "columnname": "Marketing Status", "columnposition": 12, "columnvisibility": true},
            {"columnid": "orientationColumn", "columnname": "Orientation", "columnposition": 13, "columnvisibility": true},
            {"columnid": "typeColumn", "columnname": "Type", "columnposition": 14, "columnvisibility": true}
        ];
    } else {
        var columnProperty = [
            {"columnid": "lotColumn", "columnname": "Lot", "columnposition": 1, "columnvisibility": true},
            {"columnid": "addressColumn", "columnname": "Address", "columnposition": 2, "columnvisibility": true},
            {"columnid": "projectStageColumn", "columnname": "Project - Stage", "columnposition": 3, "columnvisibility": true},
            {"columnid": "p2pColumn", "columnname": "P2P", "columnposition": 4, "columnvisibility": true},
            {"columnid": "titleDateColumn", "columnname": "Title Date", "columnposition": 5, "columnvisibility": true},
            {"columnid": "frontageMColumn", "columnname": "Frontage (m)", "columnposition": 6, "columnvisibility": true},
            {"columnid": "depthMColumn", "columnname": "Depth (m)", "columnposition": 7, "columnvisibility": true},
            {"columnid": "areaM2Column", "columnname": "Area (m2)", "columnposition": 8, "columnvisibility": true},
            {"columnid": "priceColumn", "columnname": "Price", "columnposition": 9, "columnvisibility": true},
            {"columnid": "statusColumn", "columnname": "Status", "columnposition": 10, "columnvisibility": true},
            {"columnid": "marketingStatusColumn", "columnname": "Marketing Status", "columnposition": 11, "columnvisibility": true},
            {"columnid": "orientationColumn", "columnname": "Orientation", "columnposition": 12, "columnvisibility": true},
            {"columnid": "typeColumn", "columnname": "Type", "columnposition": 13, "columnvisibility": true}
        ];
    }
    return {
        lastUpdate: LAST_UPDATED,
        tableColumnPropList: columnProperty
    };
})();

var FILTER_CONSTANT = (function () {
    var filters = [
        {"columnid": "developer", "columnname": "Developer", "columnposition": 1, "columnvisibility": true, "hidefor": "developer"},
        // {"columnid": "region", "columnname": "Region", "columnposition": 2, "columnvisibility": false, "hidefor": ""},
        {"columnid": "location", "columnname": "Location", "columnposition": 3, "columnvisibility": false, "hidefor": ""},
        // {"columnid": "state", "columnname": "State", "columnposition": 4, "columnvisibility": false},
        {"columnid": "estate", "columnname": "Project", "columnposition": 5, "columnvisibility": true, "hidefor": ""},
        {"columnid": "stage", "columnname": "Stage", "columnposition": 6, "columnvisibility": true, "hidefor": ""},
        {"columnid": "status", "columnname": "Status", "columnposition": 7, "columnvisibility": true, "hidefor": ""},
        {"columnid": "titledate", "columnname": "Title Date", "columnposition": 8, "columnvisibility": false, "hidefor": ""},
        {"columnid": "frontage", "columnname": "Frontage (m)", "columnposition": 9, "columnvisibility": false, "hidefor": ""},
        // {"columnid": "depth", "columnname": "Depth", "columnposition": 10, "columnvisibility": false, "hidefor": ""},
        {"columnid": "area", "columnname": "Area (m2)", "columnposition": 11, "columnvisibility": false, "hidefor": ""},
        {"columnid": "price", "columnname": "Price ($)", "columnposition": 12, "columnvisibility": false, "hidefor": ""},
        {"columnid": "product", "columnname": "Show", "columnposition": 13, "columnvisibility": true, "hidefor": ""}
    ];
    return {
        lastUpdate: LAST_UPDATED,
        filters: filters
    };
})();

var PRICE_RANGE = (function () {
    var landPriceRange = [
        {name: 'All', value: ''},
        {name: '50k - 100k', value: '50k-100k'},
        {name: '100k - 200k', value: '100k-200k'},
        {name: '200k - 300k', value: '200k-300k'},
        {name: '300k - 400k', value: '300k-400k'},
        {name: '400k - 500k', value: '400k-500k'},
        {name: '500k - 600k', value: '500k-600k'},
        {name: 'Other', value: '600k-10000k'}
    ];
    return {
        data: landPriceRange
    };
})();