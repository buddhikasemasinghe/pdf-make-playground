var COMMONFN = (function () {

    //CUSTOM FILTER VAR BEGIN
    var phoneLength = 10;
    //CUSTOM FILTER VAR END

    function trimInputFn(input) {
        var output;
        if (input != undefined) {
            output = input.replace(/\s\s+/g, ' ');
            output = $.trim(output);
        }
        return output;
    }

    function customJQueryValidationFn() {
        //JQUERY VALIDATION JS HAS TO BE LOADED BEFORE THIS FUNCTION GET CALLED
        jQuery.validator.setDefaults({
            ignore: []
        });

        /* jQuery.validator.addMethod("customPhone", function(value, element) {
             var phoneRegex = new RegExp("^(?:\\+?((\\(\\d+\\)[ -]?)*(\\d+[ -]?)*)*((\\(\\d+\\))|(\\d+))+)$");

             return this.optional(element) || phoneRegex.test(value);
         }, "Please enter a valid phone.");
         */

        jQuery.validator.addMethod("customPhone", function (value, element) {
            //var phoneRegex = new RegExp("^(?:\\+?((\\(\\d+\\)[ -]?)*(\\d+[ -]?)*)*((\\(\\d+\\))|(\\d+))+)$");
            var valid = false;
            var phoneNum = value.replace(/\D/g, '');

            if (phoneNum.length == phoneLength) {
                phoneNum = phoneNum.toString().replace(/\B(?=(\d{4})+(?!\d))/g, " ");
                $(element).val(phoneNum);
                valid = true;
            }

            return this.optional(element) || valid;
        }, "Please enter a valid phone.");

        jQuery.validator.addMethod("customMobile", function (value, element) {
            //var phoneRegex = new RegExp("^(?:\\+?((\\(\\d+\\)[ -]?)*(\\d+[ -]?)*)*((\\(\\d+\\))|(\\d+))+)$");
            var valid = false;
            var mobileNum = value.replace(/\D/g, '');

            if (mobileNum.length == phoneLength) {
                mobileNum = mobileNum.toString().replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
                $(element).val(mobileNum);
                valid = true;
            }

            return this.optional(element) || valid;
        }, "Please enter a valid mobile.");

        jQuery.validator.addMethod("customPassword", function (value, element) {
            var emailRegex = new RegExp("^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$");
            return this.optional(element) || emailRegex.test(value);
        }, "Password must consist of both characters and numbers, and no special characters.");

        jQuery.validator.addMethod("customEmail", function (value, element) {
            var emailRegex = new RegExp("^[^\\f\\n\\r\\t]*<{0,1}[^@ \\f\\n\\r\\t]+@[^@ \\f\\n\\r\\t]+\\.[^@\\. \\f\\n\\r\\t]+[a-zA-Z]>{0,1}$");
            return this.optional(element) || emailRegex.test(value);
        }, "Please enter a valid email address.");
    }

    function showSweetAlertFn(message, isSuccess) {
        if (isSuccess) {
            swal("Success!", message, "success");
        } else {
            swal("Error!", message, "error");
        }
    }

    function showTipAlertFn(message) {
        var title = '<div style="text-align: center;">Tip!<div>';
        var message = '<div class="c-font-18"> ' + message + "</div>";
        swal({
            title: title,
            text: message,
            html: true,
            customClass: "c-tip",
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: "Close"
        });
    }

    //GOOGLE ADDRESS AUTOCOMPLETE PARTIAL FORM BEGIN
    function setAutocompleteAddressValueFn(selectedAutocomplete, selectedComponentForm) {
        // Get the place details from the autocomplete object.
        var place = selectedAutocomplete.getPlace();

        for (var component in selectedComponentForm) {
            if (selectedComponentForm[component]['id'] != '') {
                document.getElementById(selectedComponentForm[component]['id']).value = '';
            }

        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (selectedComponentForm[addressType]) {
                var val = place.address_components[i][selectedComponentForm[addressType]['type']];
                selectedComponentForm[addressType]['value'] = val;
                if (selectedComponentForm[addressType]['id'] != '') {
                    document.getElementById(selectedComponentForm[addressType]['id']).value = val;
                }

            }
        }
    }
    //GOOGLE ADDRESS AUTOCOMPLETE PARTIAL FORM END

    //RESET INPUT VALUE TO ORIGINAL STATE WHEN EDIT BUTTON IS CLICKED BEGIN
    function resetInputValueFromOriginFn(formId) {
        //reset value
        var inputTag = $("#" + formId).find("input, select");

        $.each(inputTag, function () {
            var originalValue = $(this).attr("origin");
            if (typeof originalValue != 'undefined') {
                $(this).val(originalValue);
            }
        });

        //hide error message
        var errorLabel = $("#" + formId).find("label.c-error");

        $.each(errorLabel, function () {
            $(this).hide();
        });
    }

    //RESET INPUT VALUE TO ORIGINAL STATE WHEN EDIT BUTTON IS CLICKED END

    //VALIDATION ERROR MESSAGE CLICK EVENTS BEGIN
    function setValidationErrorMessageEventsFn() {
        $(document).on("click", "label.c-error", function () {
            $(this).hide();
        });

        $(document).on("click", "input.c-error", function () {
            var label = $(this).next();
            if (label.hasClass("c-error")) {
                label.hide();
            }
        });

        $(document).on("click", "select.c-error", function () {
            var label = $(this).next();
            if (label.hasClass("c-error")) {
                label.hide();
            }
        });
    }

    //VALIDATION ERROR MESSAGE CLICK EVENTS END

    //SHOW LOADING BOX BEGIN
    function showLoadingBoxFn(colorClass) {
        bootbox.dialog({
            message: "<div class='text-center " + colorClass + "'>" +
            "<i class='fa fa-cog fa-spin'></i> Please wait while retrieving data..." +
            "</div>",
            className: "ajax-loading",
            closeButton: false
        });
    }

    //SHOW LOADING BOX END

    //SHOW PROCESS BOX BEGIN
    function showProcessBoxFn(colorClass) {
        bootbox.dialog({
            message: "<div class='text-center " + colorClass + "'>" +
            "<i class='fa fa-cog fa-spin'></i> Please wait while processing your request..." +
            "</div>",
            className: "ajax-loading",
            closeButton: false
        });
    }

    //SHOW PROCESS BOX END

    function handlebarsRegisterFn() {

        Handlebars.registerHelper('ifgreat', function (v1, v2, options) {
            if (v1 > v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });

        Handlebars.registerHelper('ifequal', function (v1, v2, options) {
            if (v1 == v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    function tooltipFn() {
        $('[data-toggle="tooltip"]').tooltip();
    }

    var onReady = function () {
        $(document).on("click", "#popup-filter-bg", function () {
            var divBox = $(this).attr("trigger");

            $("#" + divBox).slideToggle();
            $("#popup-filter-bg").toggle();

            $(".c-btn-go").css("opacity", "");
        });

        $(document).on("touchend", "#popup-filter-bg", function (e) {
            e.preventDefault();
            var divBox = $(this).attr("trigger");

            $("#" + divBox).slideToggle();
            $("#popup-filter-bg").toggle();

            $(".c-btn-go").css("opacity", "");
        });

        $(document).on("click", "#popup-search-filter-bg", function () {
            var divBox = $(this).attr("trigger");

            $("#" + divBox).slideToggle();
            $("#popup-search-filter-bg").toggle();

            $(".c-btn-go").css("opacity", "");
        });

        $(document).on("touchend", "#popup-search-filter-bg", function (e) {
            e.preventDefault();
            var divBox = $(this).attr("trigger");

            $("#" + divBox).slideToggle();
            $("#popup-search-filter-bg").toggle();

            $(".c-btn-go").css("opacity", "");
            //TODO call the backend
        });
    };

    return {
        init: onReady,
        customJQueryValidation: customJQueryValidationFn,
        showSweetAlert: showSweetAlertFn,
        showTipAlert: showTipAlertFn,
        customFilterInit: customFilterInitFn,
        setAutocompleteAddressValue: setAutocompleteAddressValueFn,
        resetInputValueFromOrigin: resetInputValueFromOriginFn,
        setValidationErrorMessageEvents: setValidationErrorMessageEventsFn,
        showLoadingBox: showLoadingBoxFn,
        showProcessBox: showProcessBoxFn,
        trimInput: trimInputFn,
        handlebarsRegister: handlebarsRegisterFn,
        showTemplate: showTemplateFn,
        setTemplateReady: setTemplateReadyFn,
        tooltip: tooltipFn,
        tablePropInit: tablePropInitFn,
        listFilterInitAjaxFn: listFilterInitAjaxFn,
        getStageFilterFn: getStageFilterFn,
        getLotFilterFn: getLotFilterFn,
        getDesignFilterFn: getDesignFilterFn,
        getDesignFilterFnByBranchId: getDesignFilterFnByBranchId,
        getRangeFilterFn: getRangeFilterFn,
        getPlanFilterFn: getPlanFilterFn,
        getLevelFilterFn: getLevelFilterFn,
        getFacadeFilterFn: getFacadeFilterFn,
        saveFilterValuesInitAjaxFn: saveFilterValuesInitAjaxFn,
        applyTableProp: applyTablePropFn
    };
})();

COMMONFN.init();
