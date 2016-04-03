GSDS = {
    _count: 1,
    loadSpreadSheet: function (documentId, sheetId, successCallback, errorCallback) {
        var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/' + documentId + '/' + sheetId
            + '/public/basic?alt=json-in-script&callback=GSDS._a1.loaded';

        var objName = ("_a" + GSDS._count);

        var script = document.createElement('script');
        script.onerror = function (event) {
            delete GSDS[objName];
            errorCallback(event, this.documentId, this.sheetId);
        };
        document.head.appendChild(script);
        GSDS[objName] = {
            name: objName,
            loaded: GSDS._loaded,
            index: GSDS._count,
            documentId: documentId,
            sheetId: sheetId,
            successCallback: successCallback
        };
        GSDS._count++;
        script.src = sheetUrl
    },
    _loaded: function (json) {
        delete GSDS[this.name];
        var arrayData = [];
        for (var cellIdx = 0; cellIdx < json.feed.entry.length; cellIdx++) {
            var cell = json.feed.entry[cellIdx];
            var coords = /\/R(\d+)C(\d+)$/.exec(cell.id.$t);
            var row = parseInt(coords[1]) - 1;
            var column = parseInt(coords[2]) - 1;
            if (arrayData[row] == null) arrayData[row] = [];
            arrayData[row][column] = cell.content.$t
        }
        var data = {rows: [], sheetTitle: json.feed.title.$t, documentId: this.documentId, sheetId: this.sheetId};
        for (var i = 1; i < arrayData.length; i++) {
            var oldRow = arrayData[i];
            var newRow = {"id": "place" + i};
            for (var j = 0; j < oldRow.length; j++)
                newRow[arrayData[0][j]] = arrayData[i][j];
            data.rows.push(newRow)
        }
        this.successCallback(data);
    }
};
