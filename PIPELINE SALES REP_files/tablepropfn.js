var tableProp = false;

function applyTablePropFn() {
    var columns = [];
    for (var i = 0, ilen = tableProp.tableColumnPropList.length; i < ilen; i++) {
        columnProp = tableProp.tableColumnPropList[i];
        if (!columnProp.columnvisibility) {
            columns.push(Number(columnProp.columnposition));
        }
    }

    if (tableDisplay) {
        tableDisplay.api().columns(columns).visible(false, false);
        tableDisplay.api().columns.adjust().draw(false);
    }
}

function setTablePropDataFn(columnId, visibility) {
    for (var i = 0, ilen = tableProp.tableColumnPropList.length; i < ilen; i++) {
        columnProp = tableProp.tableColumnPropList[i];
        if (columnProp.columnid === columnId) {
            columnProp.columnvisibility = visibility;
            break;
        }
    }
    saveTablePropFn();
}

function saveTablePropFn() {
    localStorage.setItem(tablePropLocalVar, JSON.stringify(tableProp));
}

function mergeTablePropFn(tablePropLocal) {
    for (var i = 0, ilen = tableProp.tableColumnPropList.length; i < ilen; i++) {
        columnProp = tableProp.tableColumnPropList[i];
        for (var j = 0, jlen = tablePropLocal.tableColumnPropList.length; j < jlen; j++) {
            columnPropLocal = tablePropLocal.tableColumnPropList[j];

            if (columnProp.columnid === columnPropLocal.columnid) {
                columnProp.columnvisibility = columnPropLocal.columnvisibility;
                break;
            }
        }
    }
}

function reloadTablePropFn() {
    var tablePropLocal = tablePropLocal = JSON.parse(localStorage.getItem(tablePropLocalVar));
    if (tablePropLocal !== null) {
        if (tableProp.lastUpdate !== tablePropLocal.lastUpdate) {
            mergeTablePropFn(tablePropLocal);
        } else {
            tableProp = tablePropLocal;
        }
    }
    saveTablePropFn();
}

function displayTablePropDivFn(divId, data) {
    var htmlData = TEMPLATINGJS.getHTML('tableProp', data);

    $("#" + divId).html(htmlData);
}

function tablePropInitFn() {
    tableProp = CONSTANT;

    reloadTablePropFn();
    showTemplateFn(displayTablePropDivFn, "c-table-prop-div", tableProp);
    applyTablePropFn();

    $(document).on("click", ".c-table-prop-visibility", function () {
        var columnId = $(this).attr("column-id");
        var position = $(this).attr("position");
        var visibility = $(this).prop("checked");

        var columns = [];
        columns.push(Number(position));

        tableDisplay.api().columns(columns).visible(visibility, false);
        tableDisplay.api().columns.adjust().draw(false);

        setTablePropDataFn(columnId, visibility);
    });

    $(document).on("click", "#c-table-prop", function () {
        var divBox = $(this).attr("trigger");

        $("#" + divBox).slideToggle();
        $("#popup-filter-bg").toggle();
        $("#popup-filter-bg").attr("trigger", divBox);
    });
}
