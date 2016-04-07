/*
Copyright 2016 by Elijah "elmot" Motornyy (http://elmot.xyz/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 *
 *
 * @type {{loadSpreadSheet: Function }}
 */

GSDS = {
    _count: 1,
    /**
     *
     * @param {string} documentId
     * @param {string} sheetId
     * @param {function({rows , sheetTitle, documentId, sheetId})} successCallback
     * @param {function(event, documentId, sheetId)} errorCallback Function(Event event, documentId, sheetId)
     */
    loadSpreadSheet: function (documentId, sheetId, successCallback, errorCallback) {
        var sheetUrl = 'https://spreadsheets.google.com/feeds/cells/' + documentId + '/' + sheetId
            + '/public/basic?alt=json-in-script&callback=GSDS._a1.loaded';

        var objName = ("_a" + GSDS._count);

        var script = document.createElement('script');
        script.onerror = function (event) {
            var src = GSDS[objName];
            script.parentNode.removeChild(script);
            delete GSDS[objName];
            if(src != null)
            {
                errorCallback(event, src.documentId, src.sheetId);
            } else {
                errorCallback(event);
            }
        };
        document.head.appendChild(script);
        GSDS[objName] = {
            name: objName,
            loaded: GSDS._loaded,
            index: GSDS._count,
            documentId: documentId,
            sheetId: sheetId,
            script:script,
            successCallback: successCallback
        };
        GSDS._count++;
        script.src = sheetUrl
    },
    _loaded: function (json) {
        delete GSDS[this.name];
        this.script.parentNode.removeChild(this.script);
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
