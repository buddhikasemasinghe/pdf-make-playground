const listFilter = [];
const magicSuggests = [];
var filterOverflow = false;

function listFilterInitAjaxFn(callback, useFilterValues) {
    $.ajax({
        url: pipelineGlobalUserFiltersGetUrl,
        type: 'get',
        contentType: 'application/json; charset=UTF-8',
        data: {
            pathname: window.location.pathname
        }
    }).done(function (response) {
        const filters = FILTER_CONSTANT;
        if (isFilterConfigurationAllowed && response && response.filters && response.filters !== null) {
            if (!response.filters.lastUpdate || typeof response.filters.lastUpdate === 'undefined' || response.filters.lastUpdate === null
                || FILTER_CONSTANT.lastUpdate !== response.filters.lastUpdate) {
                mergeFilters(filters, response.filters);
            } else {
                filters.filters = response.filters.filters;
            }
        }
        renderFilters(filters);
        customFilterInitFn();
        if (isUserFilerValuesSaveEnabled && useFilterValues && response && response.filtervalues && response.filtervalues !== null) {
            setFilterValuesToElements(response.filtervalues)
        }
        callback();
    }).fail(function (response) {
        console.log(response);
        console.log("failed filter fetching, hence using the standard set");
        renderFilters(FILTER_CONSTANT);
        customFilterInitFn();
        callback();
    });

    $(document).on("click", "#list-filter-icon-id", function () {
        const divBox = $(this).attr("trigger");

        $("#" + divBox).slideToggle();
        $("#popup-search-filter-bg").toggle();
        $("#popup-search-filter-bg").attr("trigger", divBox);
    });
}

function customFilterInitFn() {
    createFilterFn();
    $(document).on("click", "#c-more-filter", function () {
        if (filterOverflow) {
            const divBox = $(this).attr("trigger");

            $("#" + divBox).slideToggle();
            $("#popup-filter-bg").toggle();
            $("#popup-filter-bg").attr("trigger", divBox);

            $(".c-btn-go").css("opacity", "0.3");
        }
    });
}

function mergeFilters(appFilters, userPreferredFilters) {
    for (var i = 0, ilen = appFilters.filters.length; i < ilen; i++) {
        columnProp = appFilters.filters[i];
        for (var j = 0, jlen = userPreferredFilters.filters.length; j < jlen; j++) {
            columnPropUserPreferred = userPreferredFilters.filters[j];

            if (columnProp.columnid === columnPropUserPreferred.columnid) {
                columnProp.columnvisibility = columnPropUserPreferred.columnvisibility;
                break;
            }
        }
    }
    saveFilters(appFilters);
}

function saveFilterValuesInitAjaxFn() {
    $(".c-btn-go", "#c-filter-show-container").click(function () {
        saveFilterValuesAjaxFn();
    });
}

function setFilterValuesToElements(filterValues) {
    if (!filterValues || filterValues === null || filterValues === 'undefined') {
        return;
    }
    for (const i in filterValues) {
        filterValue = filterValues[i];
        filterElementId = filterValue ["columnid"];
        if ($(filterElementId) && $(filterElementId).is(':visible')) {
            if ($(filterElementId).is("select")) {
                // First check whether the option is available
                if ($(filterElementId + " option[value='" + filterValue["value"] + "']").length > 0) {
                    $(filterElementId).val(filterValue["value"]);
                } else {
                    var option = new Option(filterValue["text"], filterValue["value"], true, true);
                    $(filterElementId).append($(option));
                }
            } else if ($(filterElementId).is("div")) {
                // This is magic suggest. Lookfor the input and set it.
                const ms = magicSuggests[filterElementId];
                if (ms) {
                    var selection = $(ms.getData()).filter(function (i, n) {
                        return n.value === filterValue["value"]
                    });
                    if (selection === null || selection === 'undefined' || selection.length === 0) {
                        if (typeof filterValue["text"] === 'undefined' || typeof filterValue["text"] === null) {
                            // Nothing to add. Just continue next iteration.
                            continue;
                        }
                        selection = {name: filterValue["text"], value: filterValue["value"]}
                    } else {
                        selection = selection[0];
                    }
                    ms.clear();
                    ms.addToSelection([selection]);
                }
            } else {
                $(filterElementId).val(filterValue["value"]);
            }
        }
    }
}

function saveFilterValuesAjaxFn() {
    if (!isUserFilerValuesSaveEnabled) {
        return;
    }
    const filterValuesJson = [];
    for (const i in FILTER_CONSTANT.filters) {
        tableColumnProp = FILTER_CONSTANT.filters[i];
        const filterId = '#filter-' + tableColumnProp.columnid;
        const filterDivId = '#' + tableColumnProp.columnid + '-filter-id';
        if ($(filterDivId) && $(filterDivId).is(':visible')) {
            const columnFilterValueItem = {};
            columnFilterValueItem ["columnid"] = filterId;
            columnFilterValueItem ["value"] = $(filterId).val();
            if ($(filterId).is("select")) {
                columnFilterValueItem ["text"] = $(filterId + " option:selected").text();
            } else if ($(filterId).is("div")) {
                // This should be from magicsuggest. Get it from the hidden value.
                columnFilterValueItem ["value"] = $(filterId + " input:hidden").val();
                var nameDiv = $(filterId).find('.ms-sel-item');
                if (nameDiv && typeof nameDiv !== 'undefined' && nameDiv.length) {
                    columnFilterValueItem ["text"] = nameDiv[0].innerText;
                } else {
                    columnFilterValueItem ["text"] = columnFilterValueItem ["value"];
                }
            } else {
                columnFilterValueItem ["value"] = $(filterId).val();
                columnFilterValueItem ["text"] = $(filterId).text();
            }
            filterValuesJson.push(columnFilterValueItem);
        }
    }

    $.ajax({
        url: pipelineGlobalUserFilterValuesSaveUrl,
        type: 'post',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            filtervalues: filterValuesJson,
            pathname: window.location.pathname
        })
    }).done(function (response) {
        // Nothing to do here
    }).fail(function (response) {
        console.log(response);
        console.log("failed hence no filter values saved.");
    });
}

/* This function will just get the filter value from request and set them.*/
function populateFiltersWithRequestValues(requestFilterJson) {
    if (requestFilterJson === null || requestFilterJson === 'undefined') {
        return;
    }
    var filterValues = JSON.parse(requestFilterJson);
    if (filterValues === null || filterValues === 'undefined') {
        return;
    }
    $.each(filterValues, function (key, value) {
        if (value === 'All' || value === 'all') {
            value = '';
        }
        $("#" + key).val(value);
    });
}

function saveFilters(filters) {
    $.ajax({
        url: pipelineGlobalUserFiltersSaveUrl,
        type: 'post',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            filters: filters,
            pathname: window.location.pathname
        })
    }).done(function (response) {
        // Nothing to be done here.
    }).fail(function (response) {
        console.log(response);
    });
}

//This is the function when a user selects/deselects a filter option
function onFilterPreferenceOptionClick(filters) {
    $(document).on("click", ".c-filter-visibility", function () {
        const columnId = $(this).attr("column-id");
        const position = $(this).attr("position");
        const visibility = $(this).prop("checked");

        const columns = [];
        columns.push(Number(position));

        for (const i in filters.filters) {
            tableColumnProp = filters.filters[i];
            if (tableColumnProp.columnid === columnId) {
                tableColumnProp.columnvisibility = visibility;
                const filterId = '#' + tableColumnProp.columnid + '-filter-id';
                if (tableColumnProp.columnvisibility) {
                    $(filterId).show();
                } else {
                    $('#filter-' + tableColumnProp.columnid).val("");
                    var selectedDisplay = $('#filter-' + tableColumnProp.columnid).find('.ms-sel-text');
                    if (typeof selectedDisplay !== 'undefined' && selectedDisplay.length >= 0) {
                        selectedDisplay.text("All");
                    }
                    var selectedInput = $('#filter-' + tableColumnProp.columnid).find('input:hidden');
                    if (typeof selectedInput !== 'undefined' && selectedInput.length >= 0) {
                        selectedInput.val("");
                    }
                    $(filterId).hide();
                }
            }
        }
        createFilterFn();
        saveFilters(filters);
    });
}

function displayFiltersDivFn(divId, data) {
    var htmlData = TEMPLATINGJS.getHTML('filters', data);
    $("#" + divId).html(htmlData);
}

function renderFilters(filters) {
    filters.filters = filters.filters.filter(function (filter) {
        return (filter.hidefor === ''
            || (filter.hidefor === 'developer' && !isDeveloper)
            || (filter.hidefor === 'builder' && !isBuilder))
            && (filter.columnid !== 'salesrep' || (filter.columnid === 'salesrep' && isHandLOthersProductsAllowed && salesRepFilterFlag));
    });
    showTemplateFn(displayFiltersDivFn, "list-filter-table-prop-div", filters);
    filters.filters.forEach(function (tableColumnProp) {
        if (tableColumnProp.columnid !== '' && tableColumnProp.columnid !== 'undefined') {
            const filterId = '#' + tableColumnProp.columnid + '-filter-id';
            if (tableColumnProp.columnvisibility) {
                $(filterId).show();
            } else {
                $(filterId).hide();
            }
        }
    });
    onFilterPreferenceOptionClick(filters);
}

function createFilterFn() {
    listFilter.length = 0;
    $(".c-filter").each(function (index, value) {
        listFilter.push(value);
    });
    renderFilterFn();
    $(window).resize(function () {
        renderFilterFn();
    });
}

function renderFilterFn() {
    resetFilterFn();

    filterOverflow = false;
    $.each(listFilter, function (index, value) {

        if (!filterOverflow) {
            $("#c-filter-show-container").append(value);

            if ($("#c-filter-show-container").height() > 40) {
                filterOverflow = true;
            }
        }
        if (filterOverflow) {
            $("#c-filter-popup-container").append(value);
        }
    });
    if (!filterOverflow) {
        $("#c-more-filter").css('visibility', 'hidden');
    } else {
        $("#c-more-filter").css('visibility', 'visible');
    }
}

function resetFilterFn() {
    $.each(listFilter, function (index, value) {
        $("#c-filter-initial-container").append(value);
    });
}

function getStageFilterFn(estatecpId, nextStep, stageElementId) {
    if (!stageElementId || stageElementId === null || stageElementId === 'undefined') {
        stageElementId = '#filter-stage';
    }
    removeFilterOptionsFn(stageElementId);
    removeFilterOptionsFn("#filter-lot");
    getFilterAjaxFn(getStageFilterUrl, {estatecpId: estatecpId}, stageElementId, nextStep);
}

function getLotFilterFn(estateId, stageId, nextStep) {
    removeFilterOptionsFn("#filter-lot");
    getFilterAjaxFn(getLotFilterUrl, {stagecpId: stageId, estatecpId: estateId}, "#filter-lot", nextStep);
}

function getRangeFilterFn(branchId, nextStep) {
    removeFilterOptionsFn("#filter-range");
    getFilterAjaxFn(getRangeFilterUrl, {branchId: branchId}, "#filter-range", nextStep);
}

function getDesignFilterFn(rangeId, nextStep, designElementId) {
    if (!designElementId || designElementId === null || designElementId === 'undefined') {
        designElementId = "#filter-design";
    }
    removeFilterOptionsFn(designElementId);
    getFilterAjaxFn(getDesignFilterUrl, {rangeId: rangeId}, designElementId, nextStep);
}

function getDesignFilterFnByBranchId(branchId, rangeId, nextStep) {
    removeFilterOptionsFn("#filter-design");
    getFilterAjaxFn(getDesignFilterUrl, {branchId: branchId, rangeId: rangeId}, "#filter-design", nextStep);
}

function getPlanFilterFn(designId, nextStep, planElementId) {
    removeFilterOptionsFn(planElementId);
    getFilterAjaxFn(getPlanFilterUrl, {designId: designId}, planElementId, nextStep);
}

function getFacadeFilterFn(designId, planId, nextStep, facadeElementId) {
    removeFilterOptionsFn(facadeElementId);
    getFilterAjaxFn(getFacadeFilterUrl, {designId: designId, planId: planId}, facadeElementId, nextStep);
}

function getLevelFilterFn(buildingId, nextStep, levelElementId) {
    removeFilterOptionsFn(levelElementId);
    getFilterAjaxFn(getLevelFilterUrl, {buildingcpId: buildingId}, levelElementId, nextStep);
}

function loadLocationsFilter(locationFilterId) {
    loadMagicSuggestFilterValues(repLocationsListUrl, locationFilterId);
}

function loadLandTitleDatesFilter(titleDateFilterId) {
    loadMagicSuggestFilterValues(repLandTitleDatesListUrl, titleDateFilterId);
}

function loadHandlAvailableTitleDatesFilter(availableDateFilterId) {
    loadMagicSuggestFilterValues(repHandlAvailableDatesListUrl, availableDateFilterId);
}

function loadMagicSuggestFilterValues(url, elementId) {
    $.ajax({
        url: url,
        type: 'get',
        contentType: 'application/json; charset=UTF-8'
    }).done(function (response) {
        const ms = magicSuggests[elementId];
        if (ms && ms !== null && ms !== 'undefined') {
            const values = [{name: 'All', value: ''}];
            $.each(response, function(index, value) {
                values.push({name: value.name, value: value.value});
            });
            ms.setData(values);
        }
    }).fail(function (response) {
        console.log(response);
    });
}

function removeFilterOptionsFn(filterId) {
    if ($(filterId) && $(filterId) !== null && $(filterId) !== 'undefined') {
        $(filterId).empty();
        $(filterId).html('<option value="" selected="">All</option>');
    }
}

function getFilterAjaxFn(url, requestData, filterElementId, nextStep) {
    $.ajax({
        url: url,
        type: 'post',
        data: requestData
    }).done($.proxy(function (response) {
        var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
        var result = JSON.parse(resultJSON);
        populateFilterOptionsFn(filterElementId, result);
        if (nextStep && typeof nextStep !== "undefined" && nextStep !== null) {
            if (nextStep === 'filterRefresh') {
                populateFilters();
            } else {
                $(nextStep.affectedFilter).val(nextStep.filterValue);
            }
        }
    }, nextStep)).fail(function (response) {
        console.log(response);
        console.log("fail");
    });
}

function populateFilterOptionsFn(filterId, result) {
    if ($(filterId) && $(filterId) !== null && $(filterId) !== 'undefined') {
        $.each(result, function () {
            if ($(filterId + " option[value='" + this.clientproductid + "']").length <= 0) {
                $(filterId).append('<option value="' + this.clientproductid + '">' + this.productname + '</option>');
            }
        });
    }
    createFilterFn();
}

function buildMagicSuggest(filterId, placeholder, dropdownData, customValuesAllowed, customStyle) {
    magicSuggests[filterId] = $(filterId).magicSuggest({
        placeholder: placeholder,
        allowFreeEntries: customValuesAllowed,
        data: dropdownData,
        maxSelection: 1,
        maxSelectionRenderer: function (v) {
            return '';
        },
        cls: 'form-control',
        style: customStyle,
        valueField: 'value',
        displayField: 'name',
        resultAsString: true,
        noSuggestionText: ''
    });
}

$(function () {
    magicSuggests.length = 0;
    if (typeof PRICE_RANGE !== 'undefined' && PRICE_RANGE !== null && $('#filter-price').length) {
        buildMagicSuggest('#filter-price', 'All', PRICE_RANGE.data, true, 'width:250px');
    }
    if (typeof FRONTAGE_RANGE !== 'undefined' && FRONTAGE_RANGE !== null && $('#filter-frontage').length) {
        buildMagicSuggest('#filter-frontage', 'All', FRONTAGE_RANGE.data, true, 'width:125px');
    }
    if (typeof LAND_AREA_RANGE !== 'undefined' && LAND_AREA_RANGE !== null && $('#filter-area').length) {
        buildMagicSuggest('#filter-area', 'All', LAND_AREA_RANGE.data, true, 'width:125px');
    }
    if (typeof HOME_AREA_RANGE !== 'undefined' && HOME_AREA_RANGE !== null && $('#filter-homearea').length) {
        buildMagicSuggest('#filter-homearea', 'All', HOME_AREA_RANGE.data, true, 'width:125px');
    }
    if (typeof HOME_WIDTH_RANGE !== 'undefined' && HOME_WIDTH_RANGE !== null && $('#filter-homewidth').length) {
        buildMagicSuggest('#filter-homewidth', 'All', HOME_WIDTH_RANGE.data, true, 'width:125px');
    }
    if (typeof BEDROOMS !== 'undefined' && BEDROOMS !== null && $('#filter-bedrooms').length) {
        buildMagicSuggest('#filter-bedrooms', 'All', BEDROOMS.data, true, 'width:125px');
    }
    if (typeof BATHROOMS !== 'undefined' && BATHROOMS !== null && $('#filter-bathrooms').length) {
        buildMagicSuggest('#filter-bathrooms', 'All', BATHROOMS.data, true, 'width:125px');
    }
    if (typeof CARPARKS !== 'undefined' && CARPARKS !== null && $('#filter-carparks').length) {
        buildMagicSuggest('#filter-carparks', 'All', CARPARKS.data, true, 'width:125px');
    }
    if (typeof STOREYS !== 'undefined' && STOREYS !== null && $('#filter-storeys').length) {
        buildMagicSuggest('#filter-storeys', 'All', STOREYS.data, true, 'width:125px');
    }
    if (typeof CONSTANT !== 'undefined' && $('#filter-location').length) {
        buildMagicSuggest('#filter-location', 'All', [], false, 'width:250px');
        loadLocationsFilter('#filter-location');
    }
    if (typeof CONSTANT !== 'undefined' && $('#filter-titledate').length) {
        buildMagicSuggest('#filter-titledate', 'All', [], false, 'width:125px');
        loadLandTitleDatesFilter('#filter-titledate');
    }
    if (typeof CONSTANT !== 'undefined' && $('#filter-availabledate').length) {
        buildMagicSuggest('#filter-availabledate', 'All', [], false, 'width:125px');
        loadHandlAvailableTitleDatesFilter('#filter-availabledate');
    }
    if (typeof APARTMENT_AREA_RANGE !== 'undefined' && APARTMENT_AREA_RANGE !== null && $('#filter-aptarea').length) {
        buildMagicSuggest('#filter-aptarea', 'All', APARTMENT_AREA_RANGE.data, true, 'width:125px');
    }
});