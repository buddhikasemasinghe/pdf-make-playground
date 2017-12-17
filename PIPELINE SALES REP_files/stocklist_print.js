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

        const selectedRows =  $(".c-table-row-selected");
        const selectedRowIndexes = [];
        selectedRows.each(function (rowIndex) {
            selectedRowIndexes.push(rowIndex);
        });

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
            console.log(result);
        }

        const finalTableBody = [];
        for (var j = 0; j < restructuredTableBody.length; j++) {
            var rowItem = restructuredTableBody[j];
            var result = rowItem.filter(function (cell, index, array) {
                return selectedRowIndexes.indexOf(index) === -1;
            });
            finalTableBody.push(result);
            console.log('Selected Rows');
            console.log(result);
        }

        doc.content[0].table.body = restructuredTableBody;




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

        var header = {
            table: {
                widths: ['*', '*'],
                layout: {
                    defaultBorder: false
                },
                style:'tableStyle',
                body: [
                    [
                        {
                            text: "Client Name",
                            style: 'headerStyle',
                            border: [false, false, false, false]
                        },
                        {
                            text: "PDF Type",
                            style: 'headerStyle',
                            border: [false, false, false, false]
                        }
                    ],
                    [
                        {
                            text: "",
                            border: [false, false, false, false]
                        },
                        {
                            text: "",
                            border: [false, false, false, false]
                        }
                    ]
                ]
            }
        };

        doc.content.unshift(header);

        doc.styles['header'] = {
            fontSize: 9,
            color: '#330891',
            fillColor: '#ae592e',
            margin: [0, 55, 0, 5]
        };

        doc.styles['headerStyle'] = {
            bold: true,
            fontSize: 14,
            color: '#ffffff',
            fillColor: Cookies.get('primaryColor'),
            alignment: 'center',
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
