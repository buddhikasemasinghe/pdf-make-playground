
var JS = (function () {

    var listIncludePartnersAutoComplete = [];
    var listExcludePartnersAutoComplete = [];
    
    var listIncludePartners = [];
    var listExcludePartners = [];
    
    var externalPortalsPublish = [];
    
    var placeSearch, autocomplete;
    var contactPlaceSearch, contactAutocomplete;
    
    var contactComponentForm = {
		 street_number: {
			 id: '',
			 value: '',
			 type: 'short_name' 
		 },
		 route: {
			 id: 'contactstreet',
			 value: '',
			 type: 'long_name'
		 },
		 locality: {
			 id: 'contactsuburb',
			 value: '',
			 type: 'long_name'
		 },
		 administrative_area_level_1: {
			 id: 'contactstate',
			 value: '',
			 type: 'short_name'
		 },
		 country: {
			 id: 'contactcountry',
			 value: '',
			 type: 'long_name'
		 },
		 postal_code: {
			 id: 'contactpostcode',
			 value: '',
			 type: 'short_name'
		 }
    };    
    
    var linkcontactComponentForm = {
      		 street_number: {
      			 id: '',
      			 value: '',
      			 type: 'short_name' 
      		 },
      		 route: {
      			 id: 'linkcontactstreet',
      			 value: '',
      			 type: 'long_name'
      		 },
      		 locality: {
      			 id: 'linkcontactsuburb',
      			 value: '',
      			 type: 'long_name'
      		 },
      		 administrative_area_level_1: {
      			 id: 'linkcontactstate',
      			 value: '',
      			 type: 'short_name'
      		 },
      		 country: {
      			 id: 'linkcontactcountry',
      			 value: '',
      			 type: 'long_name'
      		 },
      		 postal_code: {
      			 id: 'linkcontactpostcode',
      			 value: '',
      			 type: 'short_name'
      		 }
          };
    
    var solicitorPlaceSearch, solicitorAutocomplete;
    var solicitorComponentForm = {
		 street_number: {
			 id: '',
			 value: '',
			 type: 'short_name' 
		 },
		 route: {
			 id: 'solicitorstreet',
			 value: '',
			 type: 'long_name'
		 },
		 locality: {
			 id: 'solicitorsuburb',
			 value: '',
			 type: 'long_name'
		 },
		 administrative_area_level_1: {
			 id: 'solicitorstate',
			 value: '',
			 type: 'short_name'
		 },
		 country: {
			 id: 'solicitorcountry',
			 value: '',
			 type: 'long_name'
		 },
		 postal_code: {
			 id: 'solicitorpostcode',
			 value: '',
			 type: 'short_name'
		 }
    };
    
    // [START region_fillform]
    function fillInAddressFn(autocomplete, componentForm, nextInput) {
    	COMMONFN.setAutocompleteAddressValue(autocomplete, componentForm);
        
    	//set street to number + street name
        if (componentForm['street_number']['value'] != ''){
        	var streetName = componentForm['street_number']['value'] + ' ' + componentForm['route']['value'];
        	document.getElementById(componentForm['route']['id']).value = streetName;
        }
    	
        //validate some fields
        $("#" + componentForm['locality']['id']).trigger("focus");
        $("#" + componentForm['administrative_area_level_1']['id']).trigger("focus");
        $("#" + componentForm['postal_code']['id']).trigger("focus");
        $("#" + componentForm['country']['id']).trigger("focus");
        
        if (nextInput != null) {
        	$(nextInput).trigger("focus");
        }else{
        	$("#" + componentForm['country']['id']).trigger("blur");
        }
        
    }
    //google API autocomplete address form END
    
    // [START region_fillform]
    function fillInLinkAddressFn(autocomplete, componentForm, nextInput) {
    	COMMONFN.setAutocompleteAddressValue(autocomplete, componentForm);
        
    	//set street to number + street name
        if (componentForm['street_number']['value'] != ''){
        	var streetName = componentForm['street_number']['value'] + ' ' + componentForm['route']['value'];
        	document.getElementById(componentForm['route']['id']).value = streetName;
        }
    	
        //validate some fields
        $("#" + componentForm['locality']['id']).trigger("focus");
        $("#" + componentForm['administrative_area_level_1']['id']).trigger("focus");
        $("#" + componentForm['postal_code']['id']).trigger("focus");
        $("#" + componentForm['country']['id']).trigger("focus");
        
        if (nextInput != null) {
        	$(nextInput).trigger("focus");
        }else{
        	$("#" + componentForm['country']['id']).trigger("blur");
        }
        
    }
    
  //google API autocomplete address form BEGIN
    function initAutocompleteFn() {
    	contactAutocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('contactstreet')),
            {types: ['address']});
    	
    	contactAutocomplete.addListener('place_changed', fillInContactAddressFn);
    	
    	linkedcontactAutocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('linkcontactstreet')),
                {types: ['address']});
        	
    	linkedcontactAutocomplete.addListener('place_changed', fillInLinkContactAddressFn);
    	
    	solicitorAutocomplete = new google.maps.places.Autocomplete(
            (document.getElementById('solicitorstreet')),
            {types: ['address']});

    	solicitorAutocomplete.addListener('place_changed', fillInSolicitorAddressFn);
    	
    	setTimeout(function () {
    		$(".pac-container.pac-logo").css("z-index", "1500");
        }, 500);
    }
    
    function fillInContactAddressFn() {
    	fillInAddressFn(contactAutocomplete, contactComponentForm, null);
    }
    
    function fillInLinkContactAddressFn() {
    	fillInLinkAddressFn(linkedcontactAutocomplete, linkcontactComponentForm, null);
    }
    
    function fillInSolicitorAddressFn() {
    	fillInAddressFn(solicitorAutocomplete, solicitorComponentForm, '#solicitormobile');
    }
    
    //google API autocomplete address form END
    
    function getSolicitorFn(contactid) {
    	var solicitor;
    	for(var i = 0; i < solicitorlist.length; i++) {
		    if (solicitorlist[i].contactid == contactid) {
		    	solicitor = solicitorlist[i];
		    }
		}
    	return solicitor;
    }
    
    function autofillSolicitorFn(solicitor) {
    	var htmlData = {
			solicitorlist: solicitorlist,
			solicitor: solicitor,
			titlelist: titlelist,
			statelist: statelist
        };
    	var content = TEMPLATINGJS.getHTML('autofillSolicitor', htmlData);
    	$('#solicitor').html(content);
    }
    
    function reloadSolicitorFn(solicitor) {
    	var htmlData = {
			solicitorlist: solicitorlist,
			titlelist: titlelist,
			statelist: statelist
        };
    	var content = TEMPLATINGJS.getHTML('reloadSolicitor', htmlData);
    	$('#solicitor').html(content);
    }
    
    // Form Validation
    function removeCompanyValidationFn() {
    	$("#contactcompanyname").rules("remove");
		$("#contactabnacnid").rules("remove");
    }
    
    function addCompanyValidationFn() {
    	$('#contactabnacnid').rules("add", {
    		 required: true,        	      
			 minlength: 11,
			 maxlength: 11,
			 number: true
		});
    	$('#contactcompanyname').rules("add", {
    		 required: true,        	      
			 minlength: 2,
			 maxlength: 100
		});
    }
    
    // Remove Linked Contact Form Validation
    function removeLinkedContactValidationFn() {
    	$("#linkcontacttitle").rules("remove");
		$("#linkcontactfirstname").rules("remove");
		$("#linkcontactlastname").rules("remove");
		$("#linkcontactemail").rules("remove");
		$("#linkcontactmobile").rules("remove");
		$("#linkcontactphone").rules("remove");
		$("#linkcontactstreet").rules("remove");
		$("#linkcontactsuburb").rules("remove");
		$("#linkcontactstate").rules("remove");
		$("#linkcontactpostcode").rules("remove");
		$("#linkcontactcountry").rules("remove");
    }   
    
    var setValidationFormFn = function (formId){
        validateForm = $(formId);
        
        COMMONFN.customJQueryValidation();
        
    	validateForm.validate({
        	rules: {
				 contacttitle : "required",
				 contactfirstname: {
					 required: true,        	      
					 minlength: 2,
					 maxlength: 100
				 },
        		 contactlastname: {
        			 required: true,        	      
        			 minlength: 2,
        			 maxlength: 100
        		 },
        		 contactemail: {
        			 required: true, 
        			 customEmail: true
        		 },
        		 contactmobile: {
        			 customMobile: true
        		 },
        		 contactphone: {
        			 customPhone: true
        		 },
        		 contactstreet: "required",
        		 contactsuburb: "required",
        		 contactstate: "required",
        		 contactpostcode: {
        			 required: true,        	      
        			 minlength: 4,
        			 maxlength: 4,
        			 number:true
        		 },
        		 contactcountry: "required",
        		 
        		 linkcontactfirstname: {       	      
					 minlength: 2,
					 maxlength: 100
				 },
				 linkcontactlastname: {      	      
        			 minlength: 2,
        			 maxlength: 100
        		 },
        		 linkcontactemail: {
        			 customEmail: true
        		 },
        		 linkcontactmobile: {
        			 customMobile: true
        		 },
        		 linkcontactphone: {
        			 customPhone: true
        		 },
        		 linkcontactpostcode: {       	      
        			 minlength: 4,
        			 maxlength: 4,
        			 number:true
        		 },
        /*	 
        		 solicitorabnacnid: {
        			 required: true,        	      
        			 minlength: 11,
        			 maxlength: 11,
        			 number: true
        		 },
        		 solicitorcompanyname: {
        			 required: true,        	      
        			 minlength: 2,
        			 maxlength: 100
        		 },
        		 solicitortitle : "required",
        		 solicitorfirstname: {
        			 required: true,        	      
        			 minlength: 2,
        			 maxlength: 100
        		 },
        		 solicitorlastname: {
        			 required: true,        	      
        			 minlength: 2,
        			 maxlength: 100
        		 },
        		 solicitoremail: {
        			 required: true, 
        			 customEmail: true
        		 },
        		 solicitormobile: {
        			 customMobile: true
        		 },
        		 solicitorphone: {
        			 customPhone: true
        		 },
        		 solicitorstreet: "required",
        		 solicitorsuburb: "required",
        		 solicitorstate: "required",
        		 solicitorpostcode: {
        			 required: true,        	      
        			 minlength: 4,
        			 maxlength: 4,
        			 number:true
        		 },
        		 
        		 contractpaymentamount: {
        			 required: true,
        			 number:true,
        			 minlength: 1
        		 },
        		 contractbuyertype: "required",
        		 contractpaymentmethod: "required",
        		 contracthaveownsolicitor: "required",       		 
        		 contractfinanceapprovalrequired: "required",
        		 contractfirbapprovalrequired: "required",
        		 contractexchangedepositfunded: "required",
        		 contractbalancepurchase: "required",
        		 contractfinanceassistance: "required",
       */ 		 
        		 reserveagreement: "required"
        		
            },
            messages: {
            	
            },
            onfocusout: function( element ) {
                this.element( element );
            },
            errorClass: "c-error",
            onkeyup: false,
            submitHandler: function(form){
            	if (!validateForm){
                    return;
                }
                if (!validateForm.valid()){
                	return;
                }   
                form.submit();
            }
        });
    };
    
    //ADD REMOVE PARTNERS BEGIN
    function addIncludePartnerFn(selectedItem) {
    	if (listIncludePartners.indexOf(selectedItem.item.id) < 0){
    		listIncludePartners.push(selectedItem.item.id);
        	var htmlData = '<div id="included-'+ selectedItem.item.id +'">'+ selectedItem.item.value +'<span class="jq-publish-remove-include fa fa-times c-float-right c-cursor-pointer" destination="'+ selectedItem.item.id +'"></span></div>';
        	
        	$("#publish-include-partner").append(htmlData);
        	
        	setTimeout(function () {
        		$("#jqac-include-partners").val("");
            }, 500);
    	}else{
    		$("#jqac-include-partners-error").show();
    	}
    }
    
    function addLinkedContactValidationFn() {
    	$('#linkcontacttitle').rules("add", {
    		 required: true
		});
    	$('#linkcontactfirstname').rules("add", {
    		 required: true,        	      
			 minlength: 2,
			 maxlength: 100
		});
    	$('#linkcontactlastname').rules("add", {
    		 required: true,        	      
			 minlength: 2,
			 maxlength: 100
		});
    	$('#linkcontactemail').rules("add", {
    		 required: true,
   			 customEmail: true 
		});
    	$('#linkcontactemail').rules("add", {
    		 required: true,
   			 customEmail: true 
		});
    	$('#linkcontactmobile').rules("add", {
    		customMobile: true
		});
    	$('#linkcontactphone').rules("add", {
    		customPhone: true
		});
    	$('#linkcontactstreet').rules("add", {
    		 required: true
		});
    	$('#linkcontactsuburb').rules("add", {
    		 required: true
		});
    	$('#linkcontactstate').rules("add", {
    		 required: true
		});
    	$('#linkcontactpostcode').rules("add", {
    		 required: true,        	      
   			 minlength: 4,
   			 maxlength: 4,
   			 number:true 
		});
    	$('#linkcontactcountry').rules("add", {
    		 required: true
		});	    	
    }
    
    function removeIncludePartnerFn(button) {
    	var partnerId = $(button).attr("destination"); 
    	var index = listIncludePartners.indexOf(partnerId);
    	listIncludePartners.splice(index, 1);
    	
    	var selectedTag = $(button).parent();
    	$(selectedTag).remove();
    }
    
    function setIncludePartnersFn(partnerSetId, removingList) {
    	listIncludePartnersAutoComplete = [];
    	var setDetail = [];
    	
    	if (removingList){
    		$("#publish-include-partner").empty();
    		listIncludePartners = [];
    	}
    	$("#jqac-include-partners").val("");
    	
    	if (partnerSetId != ""){
    		var index = $.map(listPartnerSet, function(arr, i){return arr.partnersetid.toString()}).indexOf(partnerSetId);
        	setDetail = listPartnerSet[index].setDetails;
    	}
    	
    	$.each(listpartner, function(index, value) {
    		var partnerId = value.partnerccid;
    		var index = $.map(setDetail, function(arr, i){return arr.partnercompanyid.toString()}).indexOf(partnerId);
    		
    		if (index < 0) {
    			var listData = {
    				id: partnerId,
    				value: value.partnercompanyname
        		};
    			
    			listIncludePartnersAutoComplete.push(listData);
    		}
    	});
    	
    	$("#jqac-include-partners").autocomplete({
    		source: listIncludePartnersAutoComplete,
    		minLength: 0,
    		select: function(event, ui){
    			addIncludePartnerFn(ui);
    		}
    	});
    }
    
    function addExcludePartnerFn(selectedItem) {
    	if (listExcludePartners.indexOf(selectedItem.item.id) < 0){
    		listExcludePartners.push(selectedItem.item.id);
        	var htmlData = '<div id="excluded-'+ selectedItem.item.id +'">'+ selectedItem.item.value +'<span class="jq-publish-remove-exclude fa fa-times c-float-right c-cursor-pointer" destination="'+ selectedItem.item.id +'"></span></div>';
        	
        	$("#publish-exclude-partner").append(htmlData);
        	
        	setTimeout(function () {
        		$("#jqac-exclude-partners").val("");
            }, 500);
    	}else{
    		$("#jqac-exclude-partners-error").show();
    	}
    }
    
    function removeExcludePartnerFn(button) {
    	var partnerId = $(button).attr("destination"); 
    	var index = listExcludePartners.indexOf(partnerId);
    	listExcludePartners.splice(index, 1);
    	
    	var selectedTag = $(button).parent();
    	$(selectedTag).remove();
    }
    
    function setExcludePartnersFn(partnerSetId, removingList) {
    	listExcludePartnersAutoComplete = [];
    	
    	if (removingList){
    		$("#publish-exclude-partner").empty();
    		listExcludePartners = [];
    	}
    	$("#jqac-exclude-partners").val("");
    	
    	if (partnerSetId != "") {
    		var index = $.map(listPartnerSet, function(arr, i){return arr.partnersetid.toString()}).indexOf(partnerSetId);
        	var setDetail = listPartnerSet[index].setDetails;
        	
        	$.each(setDetail, function(index, value) {
        		var listData = {
    				id: value.partnercompanyid,
    				value: value.partnercompanyname
        		};
        		
        		listExcludePartnersAutoComplete.push(listData);
        	});
    	}
    	
    	$("#jqac-exclude-partners").autocomplete({
    		source: listExcludePartnersAutoComplete,
    		minLength: 0,
    		select: function(event, ui){
    			addExcludePartnerFn(ui);
    		}
    	});
    }
    //ADD REMOVE PARTNERS END

    function setR4ReservePopboxFn(propertyId, r4ProductId, ownerRunwayUrl, ownerCompanyLogo) {
        $("#clientProductId").val(propertyId);
        $("#ownerRunwayUrl").val(ownerRunwayUrl);
        $("#ownerCompanyLogo").val(ownerCompanyLogo);
        $("#r4-reservation-form").attr("action", r4ReservationUrl);
        $("#r4-reservation-form").submit();
    }

    function setReservePopboxFn(data){
    	var propertyId = data.propertyId;
    	var record = data.trDiv;
    	var lotName = $($(record).find(".c-property-lot")[0]).val();
    	var estateName = $($(record).find(".c-property-estate")[0]).val();
    	var lotAddress = $($(record).find(".c-property-address")[0]).val();
    	
    	var htmlData = {
			propertyId: propertyId,
			companyname: companyname,
			lotName: lotName,
			estateName: estateName,
			lotAddress: lotAddress,
			titlelist: titlelist,
			statelist: statelist,
			purchasertypelist: purchasertypelist,
			depositfundtypelist: depositfundtypelist,
			balancefundtype: balancefundtype,
			solicitorlist: solicitorlist,
			submitUrl: reservePropertiesUrl
    	};
    	
    	var title = TEMPLATINGJS.getHTML('reservePropertyTitle', {});
    	var message = TEMPLATINGJS.getHTML('reservePropertyForm', htmlData);
    	
    	bootbox.dialog({
        	title: title,
            message: message,
            className: "wide-dialog c-popup",
            closeButton: false,
            onEscape: function(){
            	console.log("escape");
            }
        });
    	
    	setTimeout(function () {
            console.log("setup");
//            $(".c-popup").css({'-webkit-overflow-scrolling': 'auto'});
//            $("body").css({'position': 'fixed'});
            
        }, 500);
    	
    	$(".c-popup").on("hidden.bs.modal", function(e) {
    		console.log("hidden");
    	});
    	
//    	$(".c-popup").on("hidden", function(){
//    		console.log("hidden");
//    	});
    	
//    	$(".c-popup").css({'background-color': 'yellow'});
	}
    
    function setPublishPopboxFn(actionid){
    	
    	var htmlData = {
			numberProperties: selectedPropertiesId.length,
			landSummaryListTotal: landSummaryListTotal,
			listPartnerSet: listPartnerSet
    	};
    	        
    	var title = TEMPLATINGJS.getHTML('actionPublishTitle', {});
    	var message = TEMPLATINGJS.getHTML('actionPublishForm', htmlData);
    	
    	bootbox.dialog({
        	title: title,
            message: message,
            className: "wide-dialog c-popup",
            closeButton: false,
            onEscape: function(){
            	console.log("escape");
            }
        });
    	
    	setTimeout(function () {
    		setIncludePartnersFn("", true);
    		//setExcludePartnersFn("");
        }, 500);
	}
    
    function setHandoverPopboxFn(actionid){
    	
    	var htmlData = {
			numberProperties: selectedPropertiesId.length,
			landSummaryListTotal: landSummaryListTotal,
			listhandoverpartner: listhandoverpartner
    	};
    	        
    	var title = TEMPLATINGJS.getHTML('actionHandoverTitle', {});
    	var message = TEMPLATINGJS.getHTML('actionHandoverForm', htmlData);
    	
    	bootbox.dialog({
        	title: title,
            message: message,
            className: "wide-dialog c-popup",
            closeButton: false,
            onEscape: function(){
            	console.log("escape");
            }
        });
	}
    
    function setImportPopboxFn(actionid){
    	
    	if (importallowed){
	    	if (importWarningMessage != null){
	    		swal("Warning!!!", importWarningMessage, "warning");
	    	}
            var invalidProductsExist = false;
            if (importNotAllowedCount > 0) {
                invalidProductsExist = true;
            }
            var htmlData = {
                numberProperties: importAllowedProperties.length,
                invalidProperties: importNotAllowedCount,
                invalidProductsExist: invalidProductsExist,
                landSummaryListTotal: landSummaryListTotal,
                actionid: actionid
            };
	    	        
	    	var title = TEMPLATINGJS.getHTML('actionImportTitle', {});
	    	var message = TEMPLATINGJS.getHTML('actionImportForm', htmlData);
	    	
	    	bootbox.dialog({
	        	title: title,
	            message: message,
	            className: "wide-dialog c-popup",
	            closeButton: false,
	            onEscape: function(){
	            	console.log("escape");
	            }
	        });
	    	
	    	setTimeout(function () {
	    		
	        }, 500);
    	}else{
    		if (importnotallowedmsg != null){
	    		swal("Warning!!!", importnotallowedmsg, "warning");
	    	}
    	}
	}
    
    function populateLandReserveRowFn(result) {
    	var dataPerPage = tableDisplay.api().page.info().length;
		var currentPage = tableDisplay.api().page.info().page;
		if (tableDisplay){
			tableDisplay.api().destroy();
		}
    	
		$("#land-"+result.clientproductid).find('.c-reserve-property').html(result.currentstatusname);
		$("#land-"+result.clientproductid).find('.c-reserve-property').css('background-color', result.statuscolor);
		
		createDataTableFn();
		tableDisplay.api().page.len(dataPerPage).page(currentPage).draw('page');
    }
    	
	function submitPublishPropertiesFormFn(){
		$.ajax({
            url: publishPropertiesUrl,
            type: 'post',
            data: {
        		"publish-partner-set": $("#publish-partner-set").val(),
        		"publish-list-include-partners": $("#publish-list-include-partners").val(),
        		"publish-list-exclude-partners": $("#publish-list-exclude-partners").val(),
        		"publish-list-properties": $("#publish-list-properties").val()
            }
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Success", response, "success");
        	console.log("done");
        }).fail(function (response) {
        	$(".c-popup").modal('hide');
        	if (response.status != sessionTimeoutCode) {
        		swal("Error!!!", response.responseText, "error");
        	}
        	console.log("fail");
        });
	}	

	function submitHandoverPropertiesFormFn(){
		$.ajax({
            url: handoverPropertiesUrl,
            type: 'post',
            data: {
        		"handover-partner": $("#handover-partner").val(),
        		"publish-list-properties": $("#handover-list-properties").val()
            }
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Success", response, "success");
        	console.log("done");
        }).fail(function (response) {
        	$(".c-popup").modal('hide');
        	if (response.status != sessionTimeoutCode) {
        		swal("Error!!!", response.responseText, "error");
        	}
        	console.log("fail");
        });
	}
	
	function submitImportPropertiesFormFn(dripsallowed){
		$.ajax({
            url: importPropertiesUrl,
            type: 'post',
            data: {
        		"import-list-properties": $("#import-list-properties").val(),
        		"form-actionid": $("#import-form-actionid").val(),
        		"dripsallowed": dripsallowed
            }
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Success", response, "success");
        	console.log("done");
        }).fail(function (response) {
        	$(".c-popup").modal('hide');
        	if (response.status != sessionTimeoutCode) {
        		swal("Error!!!", response.responseText, "error");
        	}
        	console.log("fail");
        }); 
	}
	
	function submitReservePropertiesFn() {
    	$.ajax({
            url: reservePropertiesUrl,
            type: 'post',
            data: $("#c-reserve-properties").serialize()
        }).done(function (response) {         	
        	$(".c-popup").modal('hide');        	
        	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
        	var result = JSON.parse(resultJSON);
        	COMMONFN.showTemplate(populateLandReserveRowFn, result);
        	$(".ajax-loading").modal('hide');
        	swal("Success", result.responsetext, "success");
        	console.log("done");
        }).fail(function (response) {
//        	$(".c-popup").modal('hide');
        	console.log(response);
        	$(".ajax-loading").modal('hide'); 
        	$(".c-popup").modal('hide');
        	if (response.status != sessionTimeoutCode) {
        		swal("Error!!!", response, "error");
        	}
        	console.log("fail");
        });
    }

    function getClientCompanySaleProcessFn(propertyId, r4ProductId, trDiv) {
        var ownerCcId = $($(trDiv).find(".c-property-ownerccid")[0]).val();
        $.ajax({
            url: getClientCompanySaleProcessUrl,
            type: 'post',
            data: {
                "ownerccid": ownerCcId
            }
        }).done(function (response) {
            var ownerRunwayUrl = response.ownClientR4Url;
            var ownerCompanyLogo = response.ownClientCompanyLogo;
            var salesProcessFromRunway = response.salesProcessFromRunway;
            var p1PortalAccountExist = response.p1PortalAccountExist;

            if (salesProcessFromRunway) {
                if (p1PortalAccountExist) {
                    setR4ReservePopboxFn(propertyId, r4ProductId, ownerRunwayUrl, ownerCompanyLogo);
                } else {
                    swal("Error!!!", response.portalAccountErrorMsg, "error");
                }
            } else {
                var data = {
                    propertyId: propertyId,
                    trDiv: trDiv
                }
                COMMONFN.showTemplate(setReservePopboxFn, data);
                setValidationFormFn("#c-reserve-properties");
                initAutocompleteFn();
            }
            console.log("done");
        }).fail(function (response) {
            $(".c-popup").modal('hide');
            if (response.status != sessionTimeoutCode) {
                swal("Error!!!", response.responseText, "error");
            }
            console.log("fail");
        });
    }

    function saleProcessFn(record) {
        var propertyId = $(record).attr("destination");
        var trDiv = $("#land-"+propertyId);

        var r4ProductId = $($(trDiv).find(".c-property-r4Productid")[0]).val();

        getClientCompanySaleProcessFn(propertyId, r4ProductId, $(trDiv));
    }

	function submitDownloadPropertiesFormFn(checkedProductList){		
		var destination = $(this).parent().attr('destination');
		$('#postid').attr('value', productTypeId);
		$('#postdetail').attr('value', checkedProductList);
		$('#post-form').attr('action', downloadPropertiesUrl);
		$('#post-form').submit();
	}
	
	function processDownloadFn(){
		var checkedProductList = "";
		var selectedId;
		$('.jq-selected-land').each(function(){
	    	if(this.checked) {
	    		selectedId = $(this).attr('id');
	    		checkedProductList += selectedId + "-";
	    	}
		});		
		if(checkedProductList.length > 0){
			submitDownloadPropertiesFormFn(checkedProductList);		
		}		
	}
	
    var onReady = function () {
        
    	var jsData = {
                path: urlPath + "partials/salesrep/land_list_publisher/",
                callbackFn: COMMONFN.setTemplateReady,
                templateNames: ['actionPublishForm', 'actionPublishTitle', 'reservePropertyForm', 
                                'reservePropertyTitle', 'actionHandoverForm', 'actionHandoverTitle',
                                'actionImportForm', 'actionImportTitle', 
                                'autofillSolicitor', 'reloadSolicitor'],
                templateFiles: ['land_action_publish_form.tmpl', 'land_action_publish_title.tmpl',
                                'land_reserve_property_form.tmpl', 'land_reserve_property_title.tmpl', 'land_action_handover_form.tmpl', 'land_action_handover_title.tmpl',
                                'land_action_import_form.tmpl', 'land_action_import_title.tmpl',
                                'land_reserve_solicitor_autofill.tmpl', 'land_reserve_solicitor_form.tmpl']
        };
    	
    	TEMPLATINGJS.init(jsData);
    	
    	//ACTION BUTTON BEGIN
		$(document).on("change", "#action-selector", function(){
			var action = $(this).find('option:selected').text().toLowerCase();
			var actionid = $(this).val();
			
			switch(action) {
				case "partner publishing":
					COMMONFN.showTemplate(setPublishPopboxFn, actionid);
					break;
				case "handover":
					COMMONFN.showTemplate(setHandoverPopboxFn, actionid);
					break;
				case "import":
					COMMONFN.showTemplate(setImportPopboxFn, actionid);
					break;
				case "download":
					processDownloadFn();
					break;
				default:
					console.log("default");
			}
			$(this).val("");
		});
		//ACTION BUTTON BEGIN
		
		//PUBLISH PROPERTIES BEGIN
		$(document).on("click", "#c-publish-btn", function() {
			var totalProperties = selectedPropertiesId.length;
			var partnerSet = $("#publish-partner-set").val();
			var successFlag = true;
			
			if (partnerSet == "" && listIncludePartners.length == 0) {
				swal("Error!!!", "Please select a partner set or at least include one partner", "error");
				successFlag = false;
			}
			
			if (totalProperties <= 0) {
				swal("Error!!!", "Please select the properties you want to publish", "error");
				successFlag = false;
			}
			
			if (successFlag){
				$("#publish-list-properties").val(JSON.stringify(selectedPropertiesId));
				$("#publish-list-include-partners").val(JSON.stringify(listIncludePartners));
				$("#publish-list-exclude-partners").val(JSON.stringify(listExcludePartners));
				submitPublishPropertiesFormFn();
			}
			
		});
		//CHANGE PARTNERSET DROPDOWNBOX
		$(document).on("change", "#publish-partner-set", function(){
			setIncludePartnersFn($(this).val(), true);
			setExcludePartnersFn($(this).val(), true);
			//TODO!!! DELETE THE TABLE LIST
		});
		
		//REMOVE INCLUDE PARTNER
		$(document).on("click", ".jq-publish-remove-include", function() {
			removeIncludePartnerFn(this);
		});
		
		//REMOVE EXCLUDE PARTNER
		$(document).on("click", ".jq-publish-remove-exclude", function() {
			removeExcludePartnerFn(this);
		});
		//PUBLISH PROPERTIES END
		
		//HANDOVER PROPERTIES BEGIN
		$(document).on("click", "#c-handover-btn", function() {
			var totalProperties = selectedPropertiesId.length;
			var partnerccid = $("#handover-partner").val();
			var successFlag = true;
			
			if (partnerccid == "") {
				swal("Error!!!", "Please select a partner", "error");
				successFlag = false;
			}
			
			if (totalProperties <= 0) {
				swal("Error!!!", "Please select the properties you want to handover", "error");
				successFlag = false;
			}
			
			if (successFlag){
				$("#handover-list-properties").val(JSON.stringify(selectedPropertiesId));
//				$("#c-publish-properties").submit();
				submitHandoverPropertiesFormFn();
			}
			
		});
		//HANDOVER PROPERTIES BEGIN

        //RESERVE PROPERTY BEGIN
        $(document).on("click", ".c-reserve-property", function () {
            saleProcessFn(this);
        });

		$(document).on("change", "#contacttype", function() {
			var action = $(this).val().toLowerCase();

			switch(action) {
				case "individual":
					removeCompanyValidationFn();
					$(".jq-show-contact-company").hide();
					break;
				case "company":
					$(".jq-show-contact-company").show();
					addCompanyValidationFn();
					break;
				default:
					console.log("default");
			}
		});
		
		$(document).on("click", "#add-newcontact-btn", function() {			
			$("#newcontact-table").css('display', '');
			$('#add-newcontact-btn').css('display', 'none');
			$('#linkedcontact-cancel-btn').css('display', 'block');
			addLinkedContactValidationFn();
		});	

		$(document).on("click", "#linkedcontact-cancel-btn", function() {			
			$("#add-newcontact-btn").css('display', '');
			$('#linkedcontact-cancel-btn').css('display', 'none');
			$('#newcontact-table').css('display', 'none');
			removeLinkedContactValidationFn();
		});
		
		$(document).on("click", "#c-place-next-solicitor", function() {			
			$("#contacts").removeClass("active");
			$(".contactsPresentation").removeClass("active");
			$("#solicitor").addClass("active");
			$(".solicitorPresentation").addClass("active");
		});
		$(document).on("click", "#c-place-next-contract", function() {			
			$("#solicitor").removeClass("active");
			$(".solicitorPresentation").removeClass("active");
			$("#contract").addClass("active");
			$(".contractPresentation").addClass("active");
		});
	
		$(document).on("click", "#c-place-next-terms", function() {			
			$("#contacts").removeClass("active");
			$(".contactsPresentation").removeClass("active");
			$("#terms").addClass("active");
			$(".termsPresentation").addClass("active");
		});
		
		$(document).on("click", "#c-place-hold-btn", function() {
			if (!validateForm){
				return;
			}
            if (!validateForm.valid()){
            	$('.errormessagetext').css('display', 'block');
            	$('.errormessagetext').html("Please fill in all the fields required in all the sections of the form before clicking on the Place on Hold button.");
            	return;
            }   
            COMMONFN.showLoadingBox("cr-color");
            submitReservePropertiesFn();
		});
		//RESERVE PROPERTY END
		
		//IMPORT PROPERTY BEGIN
		$(document).on("click", "#c-import-btn", function() {
			var totalProperties = importAllowedProperties.length;
			var dripsallowed = $("#select-drips-allowed").prop("checked"); 
			var successFlag = true;
			
			if (totalProperties <= 0) {
				swal("Error!!!", "Please select the properties you want to import", "error");
				successFlag = false;
			}
			
			if (successFlag){
				$("#import-list-properties").val(JSON.stringify(importAllowedProperties));
//				$("#c-import-properties").submit();
				submitImportPropertiesFormFn(dripsallowed);
				
				
//				$("#publish-list-properties").val(JSON.stringify(selectedPropertiesId));
//				$("#c-publish-properties").submit();
//				submitPublishForm();
			}
		});
		//IMPORT PROPERTY END
        
        //SOLICITOR SELECTED EVENT
        $(document).on("change", "#solicitorsolicitors", function() {
        	var action = $(this).find('option:selected').val().toLowerCase();
        	var contactid = $(this).val();
        	var solicitor;
        	
			switch(action) {
				case "createnew":
					COMMONFN.showTemplate(reloadSolicitorFn, null);
					break;
				default:
					solicitor = getSolicitorFn(contactid);
					COMMONFN.showTemplate(autofillSolicitorFn, solicitor);
			}
			initAutocompleteFn();
        });
        
        //autocomplete automatically open when user click the search input
		$(document).on("click", "#jqac-include-partners", function(){
			$(this).autocomplete("search", "");
		});
		
		$(document).on("click", "#jqac-exclude-partners", function(){
			$(this).autocomplete("search", "");
		});
		
		/*//sell allowed check
		$(document).on("click", ".fca-reserve-property", function() {
			swal("Message", "You do not have permission to reserve these properties", "success");
		});
		
		//sell allowed check
		$(document).on("click", ".fc-reserve-property", function() {
			swal("Message", "This property can not be reserved", "success");
		});*/
		   
        $(document).on("click", "#c-newlot-btn", function() {
        	window.location = newLotUrl;
        });
        
		//DUMMY TEST
		$(document).on("click", "#test", function() {
			COMMONFN.showTemplate(setPublishPopboxFn, null);
		});
    };
    
    return {
        init: onReady
    };
})();


