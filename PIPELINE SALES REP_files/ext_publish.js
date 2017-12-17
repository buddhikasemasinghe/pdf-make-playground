var externalPortalsPublish = [];
var selectedPropertiesId = [];
var productPublishId;
var publishCampaign = false;
var listexternalPortal;
function updateAddPropertyCount() {
	if (selectedPropertiesId != undefined && selectedPropertiesId.length > 0) {
		$('#add-property').prop('disabled', false);

		var count = selectedPropertiesId.length;
		$('#add-property').find('.property-count').html(' ' + count);
	} else {
		$('#add-property').prop('disabled', true);
		$('#add-property').find('.property-count').html('');
	}
}


function controlPortalCampaignFields(portalList, draft) {
    for (var i = 0; i < portalList.length; i++) {

        var portal = portalList[i];
        var portalID = portal.externalportalid;
        var salesrepID = portal.salesrepid;

        var currentDate =  (new Date()).setHours(0, 0, 0, 0);
        var checkDateTime =  new Date();
        checkDateTime.setMinutes(checkDateTime.getMinutes() + 30);

        var disabled = {};

        // Only disable fields for non-draft campaign.
        if (!draft) {
            if (portal.startdate) {
                if (portal.startdate) {
                    var startDateTime = new Date(portal.startdate);
                    var startDate = (new Date(portal.startdate)).setHours(0, 0, 0, 0);

                    if (startDate <= currentDate && startDateTime.getTime() < checkDateTime.getTime()) {
                        $("#" + portalID + "-start-fromDate").attr("disabled", "disabled");
                        $("#" + portalID + "-start-fromDate").attr("title", "It is too late to change this date.");
                        $("#" + portalID + "-start-date").find("span.input-group-addon").hide();


						$("#" + portalID + "-start-fromTime").attr("disabled", "disabled");
						$("#" + portalID + "-start-fromTime").attr("title", "It is too late to change this time.");
						$("#" + portalID + "-start-time").find("span.input-group-addon").hide();

                        disabled["startDate"] = true;
                    }
                }

                if (portal.expirydate) {
                    var expiryDateTime = new Date(portal.expirydate);
                    var expiryDate = (new Date(portal.expirydate)).setHours(0, 0, 0, 0);

                    if (expiryDate <= currentDate && expiryDateTime.getTime() < checkDateTime.getTime()) {
                        $("#" + portalID + "-expiry-date").attr("disabled", "disabled");
                        $("#" + portalID + "-expiry-date").attr("title", "It is too late to change this date.");
                        $("#" + portalID + "-end-date").find("span.input-group-addon").hide();

						$("#" + portalID + "-expiry-time").attr("disabled", "disabled");
						$("#" + portalID + "-expiry-time").attr("title", "It is too late to change this time.");
						$("#" + portalID + "-end-time").find("span.input-group-addon").hide();
                        disabled["expiryDate"] = true;
                    }
                }


                // Disable Portal Button and Sales Rep if any field is disabled
                if (!$.isEmptyObject(disabled)) {
                    $("#placesTransport-" + portalID).attr("disabled", "disabled");
                    $("#portal-row-" + portalID).find("div.c-portal-icon-act").attr("title", "It is too late to disable this portal.")
                }

                // Hide the copy down button for Start Date/time
                if (disabled.startDate) {
                    $("#copy-start").hide()
                }

                // Hide the copy down button for Expiry Date/time
                if (disabled.expiryDate) {
                    $("#copy-finish").hide();
                }

                // Disable Sales Rep when both Start and Expiry date times have occurred
                if (disabled.startDate && disabled.expiryDate) {
                    $("#" + portalID + "-reps").attr("disabled", "disabled");
                    $("#" + portalID + "-reps").attr("title", "It is too late to disable this Sales Rep.");
                    $("#copy-sale-rep").hide();
                }
            }
        }

        setDatePicker(portalID + "-start-date", "0d");
        setClockPicker(portalID + "-start-time", "now");
        setDatePicker(portalID + "-end-date", "0d");
        setClockPicker(portalID + "-end-time", "now");

		togglePortalIconDraftFn(portalID, portal.active, salesrepID);
    }
}

// ADD REMOVE EXTERNALPORTALS BEGIN
function setExternalPublishPopboxFn(response) {
    var portalList;
    var htmlData;

    if (response != undefined) {
        // existing campaign
        publishCampaign = true;

        var isDraft = response.publishpropertyModel.draft;
        var publishName = response.publishpropertyModel.publishname;
        var propertyList = response.publishpropertyModel.propertylistasString;
        var portalList = response.publishpropertyModel.extPortalList;
        productPublishId = response.publishpropertyModel.productpublishid;
        potentialUser = response.potentialUser;
        selectedPropertiesId = propertyList;

        htmlData = {
            publishName : publishName,
            potentialUser : potentialUser,
            numberProperties : propertyList.length,
            listexternalPortal : portalList,
            disableCopy : false
        };

        var title = TEMPLATINGJS.getHTML('actionPortalPublishTitle', {});
        var message = TEMPLATINGJS.getHTML('actionPortalPublishForm', htmlData);

        bootbox.dialog({
            title : title,
            message : message,
            className : "wide-dialog c-popup c-popup-wide",
            closeButton : false,
            onEscape : function() {
                console.log("escape");
            }
        });

        setTimeout(function() {
            $(".c-popup").removeAttr("tabindex");

            if (!(response.publishpropertyModel.draft)) {
                $('#c-external-publish-draft-btn').attr("disabled", true);
            }

            controlPortalCampaignFields(portalList, isDraft);
        }, 500);

    } else {
        // new campaign/draft
        portalList = listexternalPortal;

        var d = new Date();
        var month = d.getMonth() + 1;
        var defaultPublishName = 'Portal publishing ' + d.getDate() + '-'
            + month + '-' + d.getFullYear();

        htmlData = {
            publishName : defaultPublishName,
            potentialUser : potentialUser,
            numberProperties : selectedPropertiesId.length,
            listexternalPortal : portalList,
            disableCopy : true
        };

        var title = TEMPLATINGJS.getHTML('actionPortalPublishTitle', {});
        var message = TEMPLATINGJS.getHTML('actionPortalPublishForm', htmlData);

        bootbox.dialog({
            title : title,
            message : message,
            className : "wide-dialog c-popup c-popup-wide",
            closeButton : false,
            onEscape : function() {
                console.log("escape");
            }
        });

        setTimeout(function() {
            $(".c-popup").removeAttr("tabindex");

            for (var i = 0; i < portalList.length; i++) {

                var portalID = portalList[i].externalportalid;

                setDatePicker(portalID + "-start-date", "0d");
                setClockPicker(portalID + "-start-time", "now");
                setDatePicker(portalID + "-end-date", "0d");
                setClockPicker(portalID + "-end-time", "now");
            }
        }, 500);
    }
}

function setDatePicker(datePickerId, defaultDate) {
	$("#" + datePickerId).datepicker({
		format : "dd M yyyy",
		startDate : defaultDate,
		todayHighlight : true,
		autoclose : true,
	});
}

function setClockPicker(clockPickerId, defaultTime) {
	$("#" + clockPickerId).clockpicker({
		'default' : defaultTime,
		donetext : 'Done',
		autoclose : true,
		afterDone : function() {
			updateCopyFromBtnFn();
		}
	});
}

function buildPortalPublish(tablerow) {
	var object = {};

	if (tablerow.find('.portal-id').val() != undefined
			&& tablerow.find('.portal-id').val() != "") {
		object.portalID = tablerow.find('.portal-id').val();
	}

	if ((tablerow.find('.start-time').val() != undefined && tablerow.find(
			'.start-time').val() != "")
			&& (tablerow.find('.start-date').val() != undefined && tablerow
					.find('.start-date').val() != "")) {
		object.startDate = new Date(tablerow.find('.start-time').val() + ' ' + tablerow.find('.start-date').val());
	}

	if ((tablerow.find('.end-time').val() != undefined && tablerow.find(
			'.end-time').val() != "")
			&& (tablerow.find('.end-date').val() != undefined && tablerow.find(
					'.end-date').val() != "")) {
		object.expiryDate = new Date(tablerow.find('.end-time').val() + ' ' + tablerow.find('.end-date').val());
	}

	if (tablerow.find('.portal-reps').val() != undefined
			&& tablerow.find('.portal-reps').val() != "") {
		object.repID = tablerow.find('.portal-reps').val();
	}

	return object;
}

function submitExternalPublishPropertiesFormFn(isDraft) {
	$.ajax(
			{
				url : externalpublishPropertiesUrl,
				type : 'post',
				data : {
					"publish-list-include-externalportals" : $(
							"#publish-list-include-externalPortals").val(),
					"isDraft" : isDraft
				}
			}).done(function(response) {
		$(".c-popup").modal('hide');

		swal({
			title : "Success",
			text : response,
			closeOnConfirm : true,
		}, function() {
			if (publishCampaign) {
				filterCampaign();
			}
		});
		console.log("done");
	}).fail(function(response) {
		$(".c-popup").modal('hide');
		if (response.status != sessionTimeoutCode) {
			swal("Error!!!", response.responseText, "error");
		}
		console.log("fail");
	});
}

function submitAddPropertiesFn(productPublishId) {
	$.ajax({
		url : addPropertyAjaxUrl,
		type : 'post',
		data : {
			"publish-list-properties" : JSON.stringify(selectedPropertiesId),
			"product-publish-id" : productPublishId
		}
	}).done(function(response) {
		$(".c-popup").modal('hide');

		swal({
			title : "Success",
			text : response,
			closeOnConfirm : true
		},function() {
		    window.location = publishCampaignUrl;
        });
		console.log("done");
	}).fail(function(response) {
		$(".c-popup").modal('hide');
		if (response.status != sessionTimeoutCode) {
			swal("Error!!!", response.responseText, "error");
		}
		console.log("fail");
	});
}

function updateCopyFromBtnFn() {

	var tableRow = $('.external-publish-table');

	// If only one portal, always disable
	var disableCopy = (listexternalPortal !== undefined && listexternalPortal.length > 0) ? false : true;

	if (!disableCopy && tableRow != undefined) {
		var enableCopyStart = false;
		var enableCopyFinish = false;
		var enableCopySales = false;

		var firstActivePortal;
		var firstRowNumber;
		var activeNumber = 0;

		tableRow.each(function() {

			var isChecked = $(this).find('.portal-check').prop("checked");
			if (isChecked) {

				var rowNumber = $(this).attr('data');

				if (firstRowNumber == undefined || firstRowNumber > rowNumber) {
					firstActivePortal = $(this);
					firstRowNumber = rowNumber;
				}
				activeNumber++;
			}
		});

		if ((firstActivePortal != null) && (activeNumber > 1)) {

			var startTime = firstActivePortal.find('.start-time').val();
			var startDate = firstActivePortal.find('.start-date').val();
			var endTime = firstActivePortal.find('.end-time').val();
			var endDate = firstActivePortal.find('.end-date').val();
			var repsID = firstActivePortal.find('.portal-reps').val();

			if ((startTime != undefined) && (startTime.length != 0)
					&& (startDate != undefined) && (startDate.length != 0)) {
				enableCopyStart = true;
			}

			if ((endTime != undefined) && (endTime.length != 0)
					&& (endDate != undefined) && (endDate.length != 0)) {
				enableCopyFinish = true;
			}

			if ((repsID != undefined) && (repsID.length != 0)) {
				enableCopySales = true;
			}
		}

		updateCopyMaskFn($('#copy-start'), enableCopyStart);
		updateCopyMaskFn($('#copy-finish'), enableCopyFinish);
		updateCopyMaskFn($('#copy-sale-rep'), enableCopySales);
	}
}

function updateCopyMaskFn(element, enable) {
	if (enable) {
		element.prop("disabled", false);
		element.addClass('cr-background-color-highlight');
	} else {
		element.prop("disabled", true);
		element.removeClass('cr-background-color-highlight');
	}
}

function copyValueFn(element) {
	if (element != undefined) {

		var copyBtnId = element.attr('id');
		var tableRow = $('.external-publish-table');

		if (tableRow != undefined) {

			var firstActivePortal;
			var firstRowNumber;

			tableRow.each(function() {

				var isChecked = $(this).find('.portal-check').prop("checked");
				if (isChecked) {

					var rowNumber = $(this).attr('data');

					if (firstRowNumber == undefined
							|| firstRowNumber > rowNumber) {
						firstActivePortal = $(this);
						firstRowNumber = rowNumber;
					}
				}
			});

			if (firstActivePortal != null) {

				tableRow.each(function() {

					var isChecked = $(this).find('.portal-check').prop(
							"checked");
					if (isChecked) {

						var timeValue;
						var dateValue;

						switch (copyBtnId) {
						case "copy-start":
							timeValue = firstActivePortal.find('.start-time')
									.val();
							dateValue = firstActivePortal.find('.start-date')
									.val();
							$(this).find('.start-time').val(timeValue)
							$(this).find('.start-date').val(dateValue)
							break;
						case "copy-finish":
							timeValue = firstActivePortal.find('.end-time')
									.val();
							dateValue = firstActivePortal.find('.end-date')
									.val();
							$(this).find('.end-time').val(timeValue)
							$(this).find('.end-date').val(dateValue)
							break;
						case "copy-sale-rep":
							var repsID = firstActivePortal.find('.portal-reps')
									.val();
							$(this).find('.portal-reps').val(repsID);
							break;
						default:
							console.log("default");
						}
					}
				});
			}
		}
	}
}

function processSubmitExternalPublishFormFn(isDraft) {
	var totalProperties = selectedPropertiesId.length;
	// var totalProperties = selectedLandId.length;
	var successFlag = true;
	var externalPortals = $('.external-publish-table');
	var publishName = $("#publish-list-publish-name").val();
	externalPortalsPublish = [];

	if (totalProperties <= 0) {
		swal("Error!!!", "Please select the properties you want to publish",
				"error");
		successFlag = false;
	}

	if (successFlag) {
		for (var i = 0; i < externalPortals.length; i++) {

			var externalPortal = $(externalPortals[i]);
			var isChecked = externalPortal.find('.portal-check')
					.prop("checked");
			if (isChecked) {

				var portalID = externalPortal.find('.portal-id').val();
				var startTime = externalPortal.find('.start-time').val();
				var startDate = externalPortal.find('.start-date').val();
				var endTime = externalPortal.find('.end-time').val();
				var endDate = externalPortal.find('.end-date').val();
				var repsID = externalPortal.find('.portal-reps').val();
				var portalName = externalPortal.find('.portal-name').text();

				if ((startTime == undefined || startTime.length == 0)
						&& !(isDraft)) {
					swal("Error!!!", "Please select the start time for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((startDate == undefined || startDate.length == 0)
						&& !(isDraft)) {
					swal("Error!!!", "Please select the start date for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((startTime != "" || startTime.length != 0)
						&& (startDate == undefined || startDate.length == 0)) {

					swal("Error!!!", "Please select the start date for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((startDate != "" || startDate.length != 0)
						&& (startTime == undefined || startTime.length == 0)) {

					swal("Error!!!", "Please select the start time for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((endTime == undefined || endTime.length == 0) && !(isDraft)) {
					swal("Error!!!", "Please select the end time for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((endDate == undefined || endDate.length == 0) && !(isDraft)) {
					swal("Error!!!", "Please select the end date for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((endTime != "" || endTime.length != 0)
						&& (endDate == undefined || endDate.length == 0)) {

					swal("Error!!!", "Please select the end date for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				if ((endDate != "" || endDate.length != 0)
						&& (endTime == undefined || endTime.length == 0)) {

					swal("Error!!!", "Please select the end time for portal "
							+ portalName, "error");
					successFlag = false;
					break;
				}

				var startDateTime = Date.parse(startDate + ' ' + startTime);
				var endDateTime = Date.parse(endDate + ' ' + endTime);
				if ((endDateTime <= startDateTime)) {
					swal("Error!!!", "Finish date and time must be later than start date and time " + portalName, "error");
					successFlag = false;
					break;
				}

				if ((repsID == undefined || repsID.length == 0) && !(isDraft)) {
					swal("Error!!!",
							"Please select the representive for portal "
									+ portalName, "error");
					successFlag = false;
					break;
				}

				if (!successFlag) {
					break;
				}

				var extarnalPortalDetail = buildPortalPublish(externalPortal);
				externalPortalsPublish.push(extarnalPortalDetail);
			}
		}

		if (successFlag && externalPortalsPublish.length <= 0 && !(isDraft)) {
			swal("Error!!!",
					"Please select at least one portal you want to publish",
					"error");
			successFlag = false;
		}

		if (successFlag && publishName == '') {
			swal("Error!!!", "Please enter batch name before submit", "error");
			successFlag = false;
		}

		if (successFlag) {
			var portalPublishMaster = {};
			portalPublishMaster.productPublishId = productPublishId
			portalPublishMaster.publishName = publishName;
			portalPublishMaster.portalList = externalPortalsPublish;
			portalPublishMaster.idList = selectedPropertiesId;
			portalPublishMaster.isDraft = isDraft;
			$("#publish-list-include-externalPortals").val(
					JSON.stringify(portalPublishMaster));

			// Ajax instead form submit
			submitExternalPublishPropertiesFormFn(isDraft);
		}
	}
}

function togglePortalIconFn(portalId, active) {
	var portalRow = $('#portal-row-' + portalId);
	var disableMask = portalRow.find('.mask-' + portalId);

	if (active) {
		disableMask.hide();
	} else {
		disableMask.show();
	}
}

function togglePortalIconDraftFn(portalId, active, salesrepID) {
	var portalRow = $('#portal-row-' + portalId);
	var disableMask = portalRow.find('.mask-' + portalId);
	var act = portalRow.find('.c-portal-icon-act');
	var dis = portalRow.find('.c-portal-icon-dis');
	var select = portalRow.find('.portal-check');

	if (active) {
		select.prop('checked', true);
		if (salesrepID != undefined) {
			$('#' + portalId + '-reps').val(salesrepID);
		}
		act.css('display', 'inline-block');
		dis.css('display', 'none');
		disableMask.hide();
	} else {

		act.css('display', 'none');
		dis.css('display', 'inline-block');

		$("#" + portalId + "-start-fromTime").val("");
		$("#" + portalId + "-start-fromDate").val("");
		$("#" + portalId + "-expiry-time").val("");
		$("#" + portalId + "-expiry-date").val("");
		$('#' + portalId + '-reps').val("");
		disableMask.show();
	}
}

function initPopupTemplate() {
	var jsData = {
		path : urlPath + "partials/salesrep/ext_publish_common/",
		callbackFn : COMMONFN.setTemplateReady,
		templateNames : [ 'actionPortalPublishForm', 'actionPortalPublishTitle' ],
		templateFiles : [ 'action_portal_publish_form.tmpl',
				'action_portal_publish_title.tmpl' ]
	};

	TEMPLATINGJS.init(jsData);
}

var EXTJS = (function() {

	var onReady = function() {

		initPopupTemplate();

		// ACTION DROPDOWN BEGIN
		$(document).on("click", "#action-selector-publish", function() {
			COMMONFN.showTemplate(setExternalPublishPopboxFn);
		});
		// ACTION DROPDOWN BEGIN

		// EXTERNAL PUBLISH PROPERTIES BEGIN
		$(document).on("change", ".portal-check", function() {
			var portalId = $(this).parent().find('.portal-id').val();
			var checked = $(this).prop('checked');

			togglePortalIconFn(portalId, checked);
		});

		$(document).on("click", "#c-external-publish-btn", function() {
			processSubmitExternalPublishFormFn(false);
		});

		$(document).on("click", "#c-external-publish-draft-btn", function() {
			processSubmitExternalPublishFormFn(true);
		});
		// EXTERNAL PUBLISH PROPERTIES END

		// COPY FROM BEGIN
		$(document).on("change", ".copy-from-trigger", function() {
			updateCopyFromBtnFn();
		});

		$(document).on("click", ".c-btn-copy", function() {
			copyValueFn($(this));
		});
		// COPY FROM END

		$(document).on("click", "#add-property", function() {
			var productPublishId = $(this).val();
			submitAddPropertiesFn(productPublishId);
		});

		COMMONFN.showTemplate(COMMONFN.tooltip);
	};

	return {
		init : onReady
	};
})();
