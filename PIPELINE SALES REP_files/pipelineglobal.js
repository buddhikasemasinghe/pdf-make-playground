var GLOBALJS = (function () {

	var validateForm = false;
    var permanentPwdChangeFlag = false;
    var preferenceFlag = false;
    var detailFlag = false;
    var sessionTimeoutMessage = "Session Timeout, Please login and try again.";

    var isWelcomeView;

    isWelcomeView = $("div").is("#finish-setup");

	var placeSearch, autocomplete;
    var componentForm = {
		 street_number: {
			 id: '',
			 value: '',
			 type: 'short_name'
		 },
		 route: {
			 id: 'globaluserstreet',
			 value: '',
			 type: 'long_name'
		 },
		 locality: {
			 id: 'globalusersuburb',
			 value: '',
			 type: 'long_name'
		 },
		 administrative_area_level_1: {
			 id: 'globaluserstate',
			 value: '',
			 type: 'short_name'
		 },
//		 country: {
//			 id: '',
//			 type: 'long_name'
//		 },
		 postal_code: {
			 id: 'globaluserpostcode',
			 value: '',
			 type: 'short_name'
		 }
    };

    function setupAjaxSessionTimeoutFn(){
    //	var status = sessionTimeoutCode;

	    $.ajaxSetup({
	        statusCode: {
	        	999 : ajaxSessionTimeoutFn
	        }
	    });
	}

    function ajaxSessionTimeoutFn() {

    	var messageData = {message:sessionTimeoutMessage};

    	var title = TEMPLATINGJS.getHTML('SessionTimeoutTitle', {});
        var message = TEMPLATINGJS.getHTML('SessionTimeoutBody', messageData);

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

    //google API autocomplete address form BEGIN
    function initAutocompleteFn() {
        autocomplete = new google.maps.places.Autocomplete(
                (document.getElementById('globaluserstreet')),
                {types: ['address']});

        autocomplete.addListener('place_changed', fillInAddressFn);

        setTimeout(function () {
    		$(".pac-container.pac-logo").css("z-index", "1500");
        }, 500);
    }

    // [START region_fillform]
    function fillInAddressFn() {
    	COMMONFN.setAutocompleteAddressValue(autocomplete, componentForm);

        //set street to number + street name
        if (componentForm['street_number']['value'] != ''){
        	var streetName = componentForm['street_number']['value'] + ' ' + componentForm['route']['value'];
        	document.getElementById(componentForm['route']['id']).value = streetName;
        }

        //validate some fields
        $("#globalusersuburb").trigger("focus");
        $("#globaluserstate").trigger("focus");
        $("#globaluserpostcode").trigger("focus");
        $("#globaluserpostcode").trigger("blur");
    }
    //google API autocomplete address form END

    function performNotificationCountFn() {
        $.ajax({
            url: notificationCountUrl,
            type: 'get',
            data: {
            }
        }).done(function (response) {
            var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
            var result = JSON.parse(resultJSON);
            if (result["notificationcount"] && result["notificationcount"] > 0) {
            	$("#notificationCountStaticId").attr('class', 'c-notification-show-number');
            	$("#notificationCountStaticId").html(result["notificationcount"]);
            	$("#notificationCountCollapseId").attr('class', 'c-notification-show-number');
            	$("#notificationCountCollapseId").html(result["notificationcount"]);
            }
        }).fail(function (response) {
            console.log(response);
            console.log("fail");
        });
    }

    var setValidationFormFn = function (formId){
        validateForm = $(formId);

        COMMONFN.customJQueryValidation();

        validateForm.validate({
        	rules: {
        		globalusertitle: "required",
        		globaluserfirstname: {
	       			required: true,
		       		minlength: 2,
		       		maxlength: 100
	       		},
	       		globaluserlastname: {
	       			required: true,
	    			minlength: 2,
	    			maxlength: 100
	    		},
	    		globalusermobile: {
	    			customMobile:true
	    		},
	    		globaluserstreet: "required",
	    		globalusersuburb: "required",
	    		globaluserstate: "required",
	    		globaluserpostcode: {
	    			required: true,
	    			minlength: 4,
	    			maxlength: 4,
	    			number:true
	    		},
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

    var setValidationPasswordFormFn = function (formId){
        validateForm = $(formId);

        COMMONFN.customJQueryValidation();

        validateForm.validate({
        	rules: {
	    		password: {
	    			required: true,
	    			minlength: 6,
	    			maxlength: 20,
	    			customPassword: true
       		 	},
       		 	passwordconfirm: {
	       		 	required: true,
	    			minlength: 6,
	    			maxlength: 20,
	    			customPassword: true
       		 	},
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

    function setupDropZoneFn() {
    	$("#userdropzone").dropzone({
			autoDiscover: false,
			paramName: 'file', // this is similar to giving name to the input type file like <input type="file" name="pic" />
			previewsContainer: '#userdropzonePreview', // we specify on which div id we must show the files
			accept: function(file, done) {
				$(".dz-success").hide();
				$(".dz-message").hide();
				done();
			},
			init: function() {
				this.on("success", function(files, serverResponse) {
					var imageURL = serverResponse["userAvatar"];
					var cssImageURL = 'url('+ imageURL +')';
					$(".c-img-profile-source").attr("source", imageURL);
					$(".c-img-profile-source").css("background-image", cssImageURL);

//			    	$("#ca-logo-cancel-btn").trigger("click");
			    	$(".dz-success").hide();
					$(".dz-message").show();

					$("#userdropzone").hide();
				});
			}

		});
    }

	validateDisableOptions();

    function validateDisableOptions() {
    	$('.userpreference-tick').each(function(){
	    	if(!(this.checked)) {
	    		var email = $(this).parent().parent().find('.userpreference-email');
				var mobile = $(this).parent().parent().find('.userpreference-mobile');
				var frequency = $(this).parent().parent().find('.userpreferencefrequency-tick');
		    	email.attr('disabled', 'true');
		    	mobile.attr('disabled', 'true');
		    	frequency.attr('disabled', 'true');
	    	}
    	});
    }

	function showChangeMyDetailFn(data) {

    	var messageData = {
			userDetail: data["accessModel"],
    		titleList: data["titleList"],
    		stateList: data["stateList"],
    		url: pipelineGlobalChangeDetailUrl
    	}

    	var title = TEMPLATINGJS.getHTML('globalChangeDetailTitle', {});
        var message = TEMPLATINGJS.getHTML('globalChangeDetailForm', messageData);

        bootbox.dialog({
        	title: title,
            message: message,
            className: "wide-dialog c-popup",
            closeButton: false,
            onEscape: function(){
            	console.log("escape");
            }

        });

        setValidationFormFn("#global-my-detail-form");
        initAutocompleteFn();

    }

	function showChangeUserPreferenceFn(data) {

		var notificationList = data["accessroleModel"]['rolenotificationDetail']['notificationDetail'];
        $.each(notificationList, function() {
        	var activeFlag = (this.emailnotify || this.smsnotify);
        	this['activeFlag'] = activeFlag;

        	var notificationname = this.notificationname;
        	var statictext = "Weekly Report";
        	if(notificationname != statictext)
        		{
        			this.namestatus = true;
        		}
        });
        var preferences = data["preferenceModel"];
        if (preferences != null) {
            $('#' + preferences.value).prop('checked',true);
		}
        var messageData = {
			userAvatar: $(".c-img-profile-source").attr("source"),
			userDetail: data["accessModel"],
			notificationList: notificationList,
			frequencyTypeList: data["frequencyTypeList"],
			contactFileUploadUrl: contactFileUploadUrl,
    		url: pipelineGlobalChangeUserPreferenceUrl,
            lastVisitedPage: data["lastvisitedpage"],
            saveFilterValues: data["savefiltervalues"],
            userSelect: data["userselect"]
    	}

    	var title = TEMPLATINGJS.getHTML('globalChangeUserPreferenceTitle', {});
        var message = TEMPLATINGJS.getHTML('globalChangeUserPreferenceForm', messageData);

        bootbox.dialog({
        	title: title,
            message: message,
            className: "wide-dialog c-popup",
            closeButton: false,
            onEscape: function(){
            	console.log("escape");
            }

        });

        $(".c-popup").removeAttr("tabindex");
        setupDropZoneFn();

    }

	function getAJAXMydetailFn(){
		$.ajax({
            url: pipelineGlobalGetDetailUrl,
            type: 'post',
            data: {
            }
        }).done(function (response) {
        	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
        	var result = JSON.parse(resultJSON);

        	showTemplateFn(showChangeMyDetailFn, result);
        	console.log("done");
        }).fail(function (response) {
        	console.log(response);
        	console.log("fail");
        });
	}

	function submitAJAXMydetailFn(){
		$.ajax({
            url: pipelineGlobalChangeDetailUrl,
            type: 'post',
            data: {
            	usertitle: $("#globalusertitle").val(),
            	userfirstname: $("#globaluserfirstname").val(),
            	userlastname: $("#globaluserlastname").val(),
            	usermobile: $("#globalusermobile").val(),
            	userstreet: $("#globaluserstreet").val(),
            	usersuburb: $("#globalusersuburb").val(),
            	userstate: $("#globaluserstate").val(),
            	userpostcode: $("#globaluserpostcode").val()
            }
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	$("#global-login-username").html(response["fullname"]);
        	$(".global-login-firstname").html(response["firstname"]);
        	swal("Success", response["message"], "success");
        	if(isWelcomeView) {
        		detailFlag = true;
            	if(detailFlag) {
            		showSetupFinishBTNFn();
            	}
        	}
        	console.log("done");
        }).fail(function (response) {
        	swal("Error!!!", response.responseText, "error");
        	console.log("fail");
        });
	}

	function submitAJAXMyPreferenceFn(){
		var data = $("#global-user-preference-form").serialize();
		$.ajax({
            url: pipelineGlobalChangeUserPreferenceUrl,
            type: 'post',
            data: $("#global-user-preference-form").serialize()
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Success", response, "success");
        	if(isWelcomeView) {
        		preferenceFlag = true;
            	if(detailFlag) {
            		showSetupFinishBTNFn();
            	}
        	}
        	console.log("done");
        }).fail(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Error!!!", response.responseText, "error");
        	console.log("fail");
        });
	}

	function submitAJAXMyPasswordFn(){
		$.ajax({
            url: pipelineGlobalChangeUserPasswordUrl,
            type: 'post',
            data: $("#global-user-password-form").serialize()
        }).done(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Success", response, "success");
        	console.log("done");
        }).fail(function (response) {
        	$(".c-popup").modal('hide');
        	swal("Error!!!", response.responseText, "error");
        	console.log("fail");
        });
	}

	function getAJAXUserPreferenceFn(){
		$.ajax({
            url: pipelineGlobalGetUserPreferenceUrl,
            type: 'post',
            data: {
            }
        }).done(function (response) {
        	var resultJSON = response.replace(/\:(\d+)([ ,}\]])/g, ':"$1"$2');
        	var result = JSON.parse(resultJSON);

        	showTemplateFn(showChangeUserPreferenceFn, result);
        	validateDisableOptions();
        	console.log("done");
        }).fail(function (response) {
        	console.log(response);
        	console.log("fail");
        });
	}

    function setAjaxDefaultHomepageFn(element){
        if (element.find('i').hasClass('fa-heart')) {
        	// Already a favourite. Not need to send
			return;
		}
        $.ajax({
            url: pipelineGlobalSetUserHomePageUrl,
            type: 'post',
            data: {
                pathname : window.location.pathname
            }
        }).done(function (response) {
            element.find('i').removeClass('fa-heart-o');
            element.find('i').addClass('fa-heart');
        }).fail(function (response) {
            console.log(response);
            console.log("Error while setting the default homepage");
        });
    }

    // check if setup finished
    function showSetupFinishBTNFn(){
        if (detailFlag){
            $("#finish-setup-div").show();
        }
    }

	function toggleUploadUserAvatarDivFn() {
		$("#userdropzone").toggle();
	}

	var onReady = function () {
		var jsData = {
	        path: urlPath + "partials/global/",
	        callbackFn: setTemplateReadyFn,
	        templateNames: ['globalChangeDetailTitle', 'globalChangeDetailForm',
	                        'globalChangeUserPreferenceTitle', 'globalChangeUserPreferenceForm',
	                        'SessionTimeoutTitle', 'SessionTimeoutBody', 'tableProp', 'filters'],
	        templateFiles: ['pipeline_global_change_detail_title.tmpl', 'pipeline_global_change_detail_form.tmpl',
	                        'pipeline_global_change_user_preference_title.tmpl', 'pipeline_global_change_user_preference_form.tmpl',
	                        'session_timeout_title.tmpl', 'session_timeout_body.tmpl', 'table_prop.tmpl', 'filters.tmpl']
	    };

	    TEMPLATINGJS.init(jsData);

	    /*NOTIFICATION CHANGE EVENT*/
		$(document).on('change','.userpreference-tick', function(){
			var email = $(this).parent().parent().find('.userpreference-email');
			var mobile = $(this).parent().parent().find('.userpreference-mobile');
			var frequency = $(this).parent().parent().find('.userpreferencefrequency-tick');
			if(this.checked) {
				email.removeAttr('disabled');
				mobile.removeAttr('disabled');
				frequency.removeAttr('disabled');
				email.prop('checked', true);
				mobile.prop('checked', true);
		    }else{
		    	email.attr('disabled', 'disabled');
		    	mobile.attr('disabled', 'disabled');
		    	frequency.attr('disabled', 'disabled');
		    	email.prop('checked', false);
				mobile.prop('checked', false);
		    }
		});

		setupAjaxSessionTimeoutFn();
        performNotificationCountFn()

	    //global change detail click BEGIN
        $(document).on("click", "#c-global-change-detail", function (e) {
            e.preventDefault();
            getAJAXMydetailFn();
        });

        $(document).on("click", "#c-global-save-detail", function () {
            if (!validateForm) {
                return;
            }
            if (!validateForm.valid()) {
                return;
            }

            submitAJAXMydetailFn();
        });
		//global change detail click END

		$(document).on("click", "#c-preference-update-detail", function() {
	        submitAJAXMyPreferenceFn();
		});

		$(document).on("click", "#c-password-update-detail", function() {
			var newPassword = $("#c_new_password").val();
			var retypeNewPassword = $("#c_re_new_password").val();
			if(newPassword == ""){
			//	$("#js-error").show();
			//	$("#js-error > p").text("Password should not be empty");
			}
			if ( !newPassword || !retypeNewPassword){
				/* CHANGE THIS LATER WITH FORM VALIDATION */
			//	$("#js-error").show();
			//	$("#js-error > p").text("Both are required");
			} else if (newPassword !== retypeNewPassword){
				$("#js-error").show();
				$("#js-error > p").text("New password doesn't match with retype new password");
			}else{
		        submitAJAXMyPasswordFn();
			}
			$("#popup-bg-admin").hide();
		});

		$(document).on("click", "#c-change-password-btn", function() {
	        $('.passwordfieldrow').css('display', 'table-row');
	        $('#c-change-password-btn').css('display', 'none');
	        $('#ca-password-detail-save-cancel-btn').css('display', 'inline');
	        $('#c-password-edit-table').css('z-index', "5000");
	        $('#c-password-edit-table').css('position', "relative");
	        if (!permanentPwdChangeFlag){

				editedRoleName = "";
				editedRoleId = null;

				$("#popup-bg-admin").show();
				$("#popup-bg-admin").attr("destination", "c-new-role-div");
				$("#popup-bg-admin").attr("message", "Please save or cancel the change password dialog");

				$("#c-new-role-div").css("z-index", "5");
				$("#add-new-role-input").focus();
				someChangesFlag = true;
			}else{
				//do not allow user to do this action
				swal("", notAllowedActionWarningMessage, "warning");
			}
	        setValidationPasswordFormFn("#global-user-password-form");
		});

		$(document).on("click", "#c-password-update-cancel-detail", function() {
			$('#c_new_password').val("");
			$('#c_re_new_password').val("");
			$("#js-error > p").text("");
			$("#js-error").hide();
	        $('.passwordfieldrow').css('display', 'none');
			$("#popup-bg-admin").hide();
	        $('#c-change-password-btn').css('display', 'block');
	        $('#ca-password-detail-save-cancel-btn').css('display', 'none');
		});

		/* BACKGROUND BLOCKER CLICK EVENT */
		$(document).on("click", "#popup-bg-admin", function(){
			var message = $(this).attr("message");
			swal("", message, "warning");
		});

		$(document).on("touchend", "#popup-bg-admin", function(e){
			e.preventDefault();
			var message = $(this).attr("message");
			swal("", message, "warning");
		});

		//global change user preferences details click END

		//global change user preference click BEGIN
        $(document).on("click", "#c-global-change-user-preference", function (e) {
            e.preventDefault();
            getAJAXUserPreferenceFn();
        });

        $(document).on("click", "#set-homepage-btn", function (e) {
            e.preventDefault();
            setAjaxDefaultHomepageFn($(this));
        });

        $(document).on("click", "#popup-bg-admin", function(){
            var message = $(this).attr("message");
            swal("", message, "warning");
        });
		//global change user preference click END
	};

	return {
        init: onReady,
        showTemplate: showTemplateFn
    };
})();



$(document).ready(function() {

	GLOBALJS.init();

	/*$('select').change(function() {
        $(this).blur();
    });*/

	$('.c-close-link').click( function() {
        $content = $(this).closest('div.ibox');
        $content.hide();
    });


	/* *** JQuery for anchor tag POST request BEGIN *** */
	$('.post-request').click(function(e){
		e.preventDefault();

		$target = $(this).attr("href");
		$('#post-form').attr("action", $target);
		$('#post-form').submit();
	});
	/* *** JQuery for anchor tag POST request END *** */

	/* *** JQuery for logout form BEGIN *** */
	$('.logout').click(function(e){
		e.preventDefault();

		$('#logout-form').submit();
	});
	/* *** JQuery for logout form END *** */


	//mode selector begin
    $(document).on("click", "#pipeline-mode-switch", function (e) {
        e.preventDefault();
        var divBox = $(this).attr("trigger");

        $("#" + divBox).slideToggle();
        $("#popup-mode-selector-bg").toggle();
        $("#popup-mode-selector-bg").attr("trigger", divBox);
    });

	$(document).on("click", "#popup-mode-selector-bg", function(){
        var divBox = $(this).attr("trigger");

        $("#"+divBox).slideToggle();
        $("#popup-mode-selector-bg").toggle();
    });

	$(document).on("touchend", "#popup-mode-selector-bg", function(e){
		e.preventDefault();
        var divBox = $(this).attr("trigger");

        $("#"+divBox).slideToggle();
        $("#popup-mode-selector-bg").toggle();
    });

	$("#pipeline-mode").change(function(){
		var destination = $('option:selected', this).attr("destination");
		if (destination != '#'){
			window.location.href = destination;
		}
	});
	//mode selector end

    // Get From Cookie and set CSS value.
    var primaryColor = Cookies.get('primaryColor');
    var primaryLightColor = Cookies.get('primaryLightColor');
    var clientLogoUrl = Cookies.get('clientLogoUrl');
    if (typeof primaryColor != 'undefined'){
        $("body").get(0).style.setProperty('--primary-color', primaryColor);
    }
    if (typeof primaryLightColor != 'undefined'){
        $("body").get(0).style.setProperty('--primary-light-color', primaryLightColor);
    }
    $("body").get(0).style.setProperty('--secondary-color','#333333');

	if (typeof clientLogoUrl != 'undefined'){
        $(".c-pipeline-logo").find("a").find("label").remove();
        $(".c-pipeline-logo").find("a").find("img").attr('src', clientLogoUrl);
        $(".c-pipeline-logo").find("a").find("img").css({'float': 'none', 'width': '46%', 'margin-top': '-11px'});
    }

	//under construction message
	$(document).on("click", ".c-under-construction", function() {
		swal("This functionality is under construction");
	});

	//breadcrumb click
	$(document).on("click", ".c-custom-breadcrumb", function(e) {
		e.preventDefault();

		var urlMethod = $(this).attr("urlmethod");
		var urlAddress = $(this).attr("href");
		var destination = $(this).attr("postid");

		if (urlMethod == "GET"){
			window.location = urlAddress;
		}else{
			if ((typeof destination != "undefined") && (destination != null) && (destination != "")){
				$('#postid').attr('value', destination);
				$('#post-form').attr('action', urlAddress);
				$('#post-form').submit();
			}
		}
	});

	//session timeout rederiction
	$(document).on("click", "#c-global-session-timeout", function() {
		window.location.href = pipelineGlobalDefaultLoginUrl;
	});

});
