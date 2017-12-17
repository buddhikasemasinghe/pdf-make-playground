var LISTPRINTFN = (function () {

    // Function to convert an img URL to data URL
    function getBase64FromImageUrl(url, callback, doc) {
        var img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL("image/png");
            var logo = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
            callback(doc, logo)
        };
        img.src = url;
    }

    function toDataURL(url, callback, listTable, tableDisplay, doc) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result, listTable, tableDisplay, doc);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }


    var onPrint = function (listTable, tableDisplay, doc) {
        doc.content.splice(0, 1);
        var columnVisiblity = tableDisplay.api().columns().visible();
        var columnsToHide = [];

        const selectedRows =  $(".jq-selected-land");
        const selectedRowIndexes = [];
        selectedRows.each(function (rowIndex, element) {
            if($(element).prop('checked')) {
                selectedRowIndexes.push(rowIndex + 1);
            }
        });

        console.log("Selected Rows");
        console.log(selectedRowIndexes);

        for (var i = 0; i < columnVisiblity.length; i++) {
            if (i == 0 || !columnVisiblity[i]) {
                columnsToHide.push(i);
            }
        }

        var colCount = new Array();
        $(listTable).find('tbody tr:first-child td').each(function () {
            if ($(this).attr('colspan')) {
                for (var i = 0; i <= $(this).attr('colspan'); i++) {
                    colCount.push('*');
                }
            } else {
                colCount.push('*');
            }
        });

        colCount.splice(0, 1);

        console.log("Columns to Hide");
        console.log(columnsToHide);


        var existingTableBody = doc.content[0].table.body;
        var restructuredTableBody = [];

        for (var j = 0; j < existingTableBody.length; j++) {
            var rowItem = existingTableBody[j];
            var result = rowItem.filter(function (cell, index, array) {
                return columnsToHide.indexOf(index) === -1;
            });
            restructuredTableBody.push(result);
        }

        const finalTableBody = [];
        for(var j=0; j< restructuredTableBody.length; j++){
            if(j === 0){
                finalTableBody.push(restructuredTableBody[j]);
            }else{
                if(selectedRowIndexes.indexOf(j) > -1){
                    finalTableBody.push(restructuredTableBody[j]);
                }
            }
        }

        console.log(finalTableBody);
        doc.content[0].table.body = finalTableBody;
        var tableContainer = doc.content.filter(function (content) {
            return content.hasOwnProperty('table');
        })[0];

        var table = tableContainer.table;
        table.widths = colCount;
        var rowCount = table.body.length;
        for (i = 0; i < rowCount; i++) {
            for (var j = 0; j < colCount.length; j++) {
                table.body[i][j].alignment = 'center';
            }
        }

        var logo = 'data:image/jpg;base64,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';
        var header = {
            table: {
                widths: ['*', '*', '*', "*"],
                //style:'tableStyle',
                body: [
                    [
                        {
                            image: logo,
                            fit: [100, 100],
                            style: 'headerStyle',
                        },
                        {
                            text: "Client Name",
                            style: 'headerStyle',
                        },
                        {
                            text: "",
                            style: 'headerStyle',
                        },
                        {
                            text: "Stock List PDF",
                            style: 'headerStyle',
                        }
                    ],

                    [
                        '',
                        '',
                        '',
                        ''
                    ]
                ]
            },
            layout: 'noBorders'
        };

        doc.content.unshift(header);

        doc.styles['header'] = {
            fontSize: 9,
            color: '#330891',
            fillColor: '#ae592e',
            margin: [0, 0, 0, 5]
        };

        doc.styles['headerStyle'] = {
            bold: true,
            fontSize: 14,
            color: '#ffffff',
            fillColor: '#ff2a18',
            alignment: 'center',
            margin: [0, 0, 0, 5],
            border: [false, false, false, false]
        };

        doc.styles['tableStyle'] = {
            margin: [100, 155, 100, 145]
        };

    };
    return {
        print: onPrint
    };
})();
