
var TEMPLATINGJS = (function () {

    var templateNames = [];

    var templateLoaded = [];
    var templateObj = {};

    var callbackCalled = false;

    var firstCalled = true;
    var dataStack = [];
    var populatingStackOnProgress = false;

    function handlebarsCustomHelperFn() {
    	//handlebars custom helper
    	Handlebars.registerHelper('ifequal', function(v1, v2, options) {
			if(v1 == v2) {
				return options.fn(this);
			}
				return options.inverse(this);
		});

    	Handlebars.registerHelper('iflequal', function(v1, v2, options) {
			if(v1 <= v2) {
				return options.fn(this);
			}
				return options.inverse(this);
		});

    	Handlebars.registerHelper('ifgequal', function(v1, v2, options) {
			if(v1 >= v2) {
				return options.fn(this);
			}
				return options.inverse(this);
		});

    	Handlebars.registerHelper('iflthan', function(v1, v2, options) {
			if(v1 < v2) {
				return options.fn(this);
			}
				return options.inverse(this);
		});

    	Handlebars.registerHelper('ifgthan', function(v1, v2, options) {
			if(v1 > v2) {
				return options.fn(this);
			}
				return options.inverse(this);
		});

        Handlebars.registerHelper("formatDate", function(date, format) {
            if (date) {
                return moment.utc(date).format(format);
            }
            return date;
        });
		Handlebars.registerHelper("formatToLocalDate", function(date, format) {
			if (date) {
				var utcDate = moment.utc(date).toDate();
				return moment(utcDate).local().format(format);
			}
			return date;
		});
    }

    var onReady = function (data) {
    	if (firstCalled){
    		//initialise all handelbars custom helper
    		firstCalled = false;
    		handlebarsCustomHelperFn();
    	}

//    	setTemplateDataFn(data);
    	addNextTemplateFn(data);

    };

    function setTemplateDataFn(data){
    	templateLoaded = [];
    	callbackCalled = false;

    	//templatePath = urlPath + path;
    	templateNames = data.templateNames;

        $.each(data.templateNames, function(index, value){
            getTemplateFn(value, data.path + data.templateFiles[index], data.callbackFn);
        });

        setTemplateReadyFn(data.callbackFn);
    }

    function getTemplateFn(templateName, templateUrl, callbackFn){
        $.get(templateUrl, function (data) {
            templateObj[templateName] = Handlebars.compile(data);

            templateLoaded.push(true);

            setTemplateReadyFn(callbackFn);
        });
    };

    function setTemplateReadyFn(callbackFn){
        if (templateLoaded.length < templateNames.length){
            return;
        }

        //Ready
        //Preventing multiple call
        if (!callbackCalled){
        	callbackCalled = true;
        	firstCalled = true;
        	populatingStackOnProgress = false;

        	callbackFn();
        	processDataStackFn();
        }
    };

    function getHTMLFn(template, data){
    	if (!templateObj[template] || templateObj[template] === null || templateObj[template] === 'undefined') {
    		return '';
        }
		var result = templateObj[template](data);
        //remove linebreaks and tabs
        result = result.replace(/(?:\r\n|\r|\n|\t)+/g, '');
		//remove more than one spaces
        result = result.replace(/(?: {2,})+/g, '');
        return result;
    };

    function addNextTemplateFn(data){
    	dataStack.push(data);

		processDataStackFn();
    }

    function processDataStackFn(){
    	if (populatingStackOnProgress){
    		return;
    	}
    	//set the flag ASAP
    	populatingStackOnProgress = true;

    	if (dataStack.length == 0){
    		//remove the flag if not needed
    		populatingStackOnProgress = false;

    		return;
    	}

    	setTemplateDataFn(dataStack.shift());
    	console.log("templating next process");
    }



    return {
        init: onReady,
        addNextTemplate: addNextTemplateFn,
        getHTML: getHTMLFn
    };


})();


