var tableDisplay = false;
var selectedPropertiesId = [];
var importAllowedProperties = [];
var importNotAllowedCount = 0;

var popuppublishingbox = false;
var popupdripbox = false;
var listPublishLotName;

function selectAllLandsFn(checkbox) {
	//read datatable page info
	var dataPerPage = tableDisplay.api().page.info().length;
	var currentPage = tableDisplay.api().page.info().page;

	//show all
	tableDisplay.api().page.len(-1).draw();

	var selectedFlag = checkbox.checked;
	$('.jq-selected-land').each(function() {
		this.checked = selectedFlag;
		ModifySelectedLandIdFn(this);
	});

	//return it back
	tableDisplay.api().page.len(dataPerPage).page(currentPage).draw('page');
}

function ModifySelectedLandIdFn(checkbox) {
	var landId = $(checkbox).attr("id");
	var listIndex = selectedPropertiesId.indexOf(landId);

    if ($(checkbox).prop("checked")) {
        if (listIndex < 0) {
            selectedPropertiesId.push(landId);
            checkImportAllowed(landId);
        }
    } else {
        if (listIndex >= 0) {
            selectedPropertiesId.splice(listIndex, 1);
            uncheckImportAllowed(landId);
        }
    }

    if (selectedPropertiesId != undefined && selectedPropertiesId.length > 0) {
        $('#action-selector').prop('disabled', false);
        $('#action-selector-publish').prop('disabled', false);
        if (importAllowedProperties.length > 0) {
            $('.select-checkbox-action option[value=' + importActionId + ']').show();
        } else {
            $('.select-checkbox-action option[value=' + importActionId + ']').hide();
        }
    } else {
        $('#action-selector').prop('disabled', true);
        $('#action-selector-publish').prop('disabled', true);
    }

	if (typeof updateAddPropertyCount != 'undefined') {
		updateAddPropertyCount();
	}

	if(selectedPropertiesId.length){
        tableDisplay.api().buttons().enable();
    }else{
        tableDisplay.api().buttons().disable();
    }
}

function checkImportAllowed(landId) {
    var lotownerCcId = $("." + landId + "-lot-ownerccid").val();
    var lotimportallowed = $("." + landId + "-lot-importallowed").val();
    if (!($.inArray(lotownerCcId, branchCCIdList) > -1) && lotimportallowed === "false") {
        importNotAllowedCount++;
    } else {
        importAllowedProperties.push(landId);
    }
}

function uncheckImportAllowed(landId) {
    var importAllowedIndex = importAllowedProperties.indexOf(landId);
    if (importAllowedIndex >= 0) {
        importAllowedProperties.splice(importAllowedIndex, 1);
    } else {
        importNotAllowedCount = selectedPropertiesId.length - importAllowedProperties.length;
    }
}

function populateLotFn(serverData) {
    var dataPerPage = tableDisplay.api().page.info().length;
    selectedPropertiesId = [];
    importAllowedProperties = [];
    importNotAllowedCount = 0;
	$("#tick-all").prop("checked", false);

	if (tableDisplay){
		tableDisplay.api().destroy();
	}

    if (serverData && serverData.productlist) {
        for (var i = 0, data; data = serverData.productlist[i]; i++) {

            if (typeof data["productprice"] != "undefined") {
                data["jsproductprice"] = accounting.formatMoney(data["productprice"], "$ ", 2, ",", ".");
            }

            if (typeof data["productwidth"] != "undefined") {
                data["jsproductwidth"] = accounting.formatNumber(data["productwidth"], 2, ",", ".");
            }

            if (typeof data["productdepth"] != "undefined") {
                data["jsproductdepth"] = accounting.formatNumber(data["productdepth"], 2, ",", ".");
            }

            if (typeof data["productsize"] != "undefined") {
                data["jsproductsize"] = accounting.formatNumber(data["productsize"], 2, ",", ".");
            }
        }

        landSummaryListTotal = serverData.productlist.length;
        htmlData = {
            landSummaryList: serverData.productlist,
            reserveallowed: reserveAllowed,
            showDripsPanel: showDripsPanel
        };
        var htmlTableBody = TEMPLATINGJS.getHTML('lotTableRow', htmlData);

        $("#landlisttablebody").html(htmlTableBody);
        createDataTableFn();
        tableDisplay.api().page.len(dataPerPage).draw('page');
        COMMONFN.applyTableProp();
    }
}

function getLotFn(firstLoadFlag) {
    var data = $("#c-land-filter").serializeArray();
    data.push({name: "firstloadflag", value: firstLoadFlag});
    data.push({name: "product-publish-id", value: $('#product-publish-id').val()});
    data.push({name: "validatepublish", value:  $('#validate-publish').val()});
	$.ajax({
        url: getLotUrl,
        type: 'post',
        data: data
    }).done(function (response) {
    	$(".ajax-loading").modal('hide');

    	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
    	var result = JSON.parse(resultJSON);
    	COMMONFN.showTemplate(populateLotFn, result);
    	COMMONFN.showTemplate(COMMONFN.tooltip);

    	if (typeof updateAddPropertyCount !== 'undefined') {
    		updateAddPropertyCount();
    	}
    }).fail(function (response) {
    	console.log(response);
    	$(".ajax-loading").modal('hide');
    	$(".c-popup").modal('hide');
    	if (response.status !== sessionTimeoutCode) {
    		swal("Error!!!", response.responseText, "error");
    	}
    });
}

function getListDRIP(btn) {
	var data = {
		clientproductid: $(btn).attr("destination")
	};

	$.ajax({
        url: getListDRIPUrl,
        type: 'post',
        data: data
    }).done(function (response) {
    	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
    	var result = JSON.parse(resultJSON);
    	COMMONFN.showTemplate(populateListDripFn, result);
    }).fail(function (response) {
    	console.log(response);
    	$(".c-popup").modal('hide');
    	if (response.status !== sessionTimeoutCode) {
    		swal("Error!!!", response.responseText, "error");
    	}
    });
}

function populateListDripFn(serverData) {
	popupdripbox = true;
	for (var i = 0, data; data = serverData[i]; i++) {
		if (typeof data["dripvalue"] != "undefined"){
			data["jsdripvalue"] = accounting.formatMoney(data["dripvalue"], "$ ", 2, ",", ".");
		}
	}

	htmlData = {
		productDRIPs: serverData
	};

	var message = TEMPLATINGJS.getHTML('landShowListDripForm', htmlData);
	var title = TEMPLATINGJS.getHTML('landShowListDripTitle', {});

	bootbox.dialog({
		title:title,
        message: message,
        className: "wide-dialog c-popup",
        closeButton: false,
        onEscape: function(){
        	popupdripbox = false;
        	console.log("escape");
        }
    });

	//populate drip description, to show enter character
	for (var i = 0, data; data = serverData[i]; i++) {
		$("#c-show-drip-desc-" + i).text(data["dripdescription"]);
	}
}

function getListPublishing(btn) {
	var clientproductid = $(btn).attr("destination");
	var data = {
		clientproductid: clientproductid
	};
	listPublishLotName = $('#land-'+ clientproductid).find('.c-property-lot').val();
	$.ajax({
        url: getListPublishingUrl,
        type: 'post',
        data: data
    }).done(function (response) {
    	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
    	var result = JSON.parse(resultJSON);
    	COMMONFN.showTemplate(populateListPublishFn, result);

    	console.log("done");
    }).fail(function (response) {
    	console.log(response);

    	//CHANGE THIS HARDCODED!!!
    	$(".c-popup").modal('hide');
    	if (response.status != sessionTimeoutCode) {
    		swal("Error!!!", response.responseText, "error");
    	}

    	console.log("fail");
    });
}

function populateListPublishFn(serverData) {
	popuppublishingbox = true;
	htmlData = {
		partnerList: serverData,
		lotName : listPublishLotName
	};
	var message = TEMPLATINGJS.getHTML('landShowListPublishForm', htmlData);
	var title = TEMPLATINGJS.getHTML('landShowListPublishTitle', {});
	bootbox.dialog({
		title:title,
        message: message,
        className: "wide-dialog c-popup",
        closeButton: false,
        onEscape: function(){
        	popuppublishingbox = false;
        	console.log("escape");
        }
    });
}

function createDataTableFn() {
    tableDisplay = $("#landlisttable").dataTable({
        responsive: true,
        "pagingType": "numbers",
        "language": {
            "searchPlaceholder": "Keyword search...",
            "emptyTable": "Select search criteria to see the data in the table"
        },
        "columnDefs": [{
            "targets": 0,
            "orderable": false
        }],
        "iDisplayLength": 25,
        "order": [[1, "asc"]],
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'pdfHtml5',
                orientation: 'portrait',
                text:'PDF',
                pageSize: 'A4',
                className: 'btn cr-background-color-highlight cr-border-color cr-color-highlight c-float-right c-btn-go c-export-btn-margin',
                customize: function (doc) {
                    LISTPRINTFN.print($("#landlisttable"), tableDisplay, doc);
                }
            },
            {
                extend: 'excel',
                text: 'Excel',
                className: 'btn cr-background-color-highlight cr-border-color cr-color-highlight c-float-right c-btn-go c-export-btn-margin',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            },
            {
                extend: 'csv',
                text: 'CSV',
                className: 'btn cr-background-color-highlight cr-border-color cr-color-highlight c-float-right c-btn-go c-export-btn-margin',
                exportOptions: {
                    modifier: {
                        page: 'current'
                    }
                }
            }
        ]
    });
    tableDisplay.api().buttons().disable();
}

function disableActionOptions() {
	var checkboxcount = selectedPropertiesId.length;
	if(checkboxcount > 0) {
		$('.select-checkbox-action').removeAttr('disabled');
 	} else {
 		$('.select-checkbox-action').attr('disabled', 'true');
 	}
}

function disableImportActionOptions() {
    if(importAllowedProperties.length > 0) {
        $('.select-checkbox-action option[value='+importActionId+']').show();
    } else {
        $('.select-checkbox-action option[value='+importActionId+']').hide();
    }
}

function populateFilters() {
    populateFiltersWithRequestValues(landlistfilterJSON);
}

var COMMONJS = (function() {

	var onReady = function() {

		var jsData = {
                path: urlPath + "partials/salesrep/land_list_publisher/",
                callbackFn: COMMONFN.setTemplateReady,
                templateNames: ['lotTableRow',
                                'landShowListDripForm','landShowListDripTitle',
                                'landShowListPublishForm', 'landShowListPublishTitle'],
                templateFiles: ['land_lot_table_row.tmpl',
                                'land_show_list_drip_form.tmpl','land_show_list_drip_title.tmpl',
                                'land_show_list_publish_form.tmpl', 'land_show_list_publish_title.tmpl']
        };

		TEMPLATINGJS.init(jsData);

		if (errorMessage){
        	swal("Error!!!", errorMessage, "error");
        }
        if (successMessage){
        	swal("Success", successMessage, "success");
        }
        if (alertLoad){
       	 	COMMONFN.showSweetAlert(message, isSuccess);
		}

		// VALIDATION ERROR BUBBLE EVENTS
        COMMONFN.setValidationErrorMessageEvents();

		// SET DATA TABLE
		createDataTableFn();
        //TABLE PROPERTY
        COMMONFN.tablePropInit();
        COMMONFN.listFilterInitAjaxFn(function () {
        	// Lots will be called back upon fetching the filters first
            if (landSummaryListTotal <= 0) {
                COMMONFN.showLoadingBox("cr-color");
                populateFiltersWithRequestValues(landlistfilterJSON);
                getLotFn(true);
            }
        }, (landlistfilterJSON === null && landSummaryListTotal <= 0));
        COMMONFN.saveFilterValuesInitAjaxFn();

		COMMONFN.handlebarsRegister();

        //CHECKBOX SELECT ALL BEGIN
        $(document).on("click", "#tick-all", function () {
            selectAllLandsFn(this);
            disableActionOptions();
            disableImportActionOptions();
        });

        $(document).on("click", ".jq-selected-land", function () {
            ModifySelectedLandIdFn(this);
            disableActionOptions();
            disableImportActionOptions();
        });
        //CHECKBOX SELECT ALL END

        $(document).on("change", ".land-mode-selector", function () {
            var action = $(this).find('option:selected').text().toLowerCase();
            var actionValue = $(this).val();

            if (actionValue == "land-list-publish-view") {
                $("#lot-portalpublishing-actions-div").hide();
                $("#lot-partnerpublishing-actions-div").show();
                $("#pipeline-breadcrumb").text(landPartnerPublishHeader);
                $("#lot-partnerpublishing-actions-div .land-mode-selector").val("land-list-publish-view");
            } else if (actionValue == "land-ext-list-publish-view") {
                $("#lot-partnerpublishing-actions-div").hide();
                $("#lot-portalpublishing-actions-div").show();
                if (landCampaignPublishHeader == null) {
                    $("#pipeline-breadcrumb").text(landPortalPublishHeader);
                } else {
                    $("#pipeline-breadcrumb").text(landCampaignPublishHeader);
                }
                $("#lot-portalpublishing-actions-div .land-mode-selector").val("land-ext-list-publish-view");
            }
        });

		 //FILTER BEGIN
        $(document).on("click", "#c-land-filter-btn", function() {
        	COMMONFN.showLoadingBox("cr-color");
        	getLotFn(false);
        });

        //POPULATE STAGE FILTER
        $(document).on("change", "#filter-estate", function(e, nextStep) {
        	var estatecpId = $(this).val();
        	getStageFilterFn(estatecpId, nextStep);
        });

        $(document).on("click", ".c-show-list-drip", function(){
			if (!popupdripbox) {
				getListDRIP($(this));
			}
		});

		$(document).on("click", ".c-show-list-publishing", function(){
			if (!popuppublishingbox) {
				getListPublishing($(this));
			}
		});

        // reset the tick box
		$("#tick-all").prop("checked", false);

		$(document).on('click','.c-show-land-detail > .c-click', function(){
			var destination = $(this).parent().attr('destination');
			$('#postid').attr('value', destination);
            $('#post-form').attr('action', postUrl + '/' + destination);
			$('#post-form').submit();
		});

		$(document).on('click', '#display-publish-modal', function () {
			return false;
		});
	};

	return {
		init : onReady
	};
})();
