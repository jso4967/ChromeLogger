var app = angular.module('app', ['filters', 'ngQuickDate']);
var start_date = (new Date()).valueOf() - 1000*3600*24;
var end_date = new Date().getTime();

var default_start_date = (new Date()).valueOf() - 1000*3600*24;
var default_end_date = new Date().getTime();

app.controller("ViewerCtrl", function($scope) {

    /* Load logs, startDate should be a JS timestamp */
    $scope.load = function(startDate, endDate) {
        if(startDate == 0) startDate = default_start_date;
        if(endDate == 0) endDate = default_end_date;
        $scope.logs = [];
        chrome.storage.local.get(function(logs) {
            for (var key in logs) {
                for(var key2 in logs[key]){
                    if (key > startDate && key<endDate){
                        $scope.logs.push([key+"/"+key2, logs[key][key2].split('^~^')]);
                    }
                }
            }
            $scope.logs.reverse();
            $scope.$apply();
        });
    }
    
    /* Called when new date is picked */ 
    $scope.date = function() {
        if($scope.aDatepicker){
            start_date = new Date($scope.aDatepicker).getTime();
        }
        else{
            start_date = default_start_date;
        }
        if($scope.bDatepicker){
            end_date = new Date($scope.bDatepicker).getTime();
        }
        else{
            end_date = default_end_date;
        }
        console.log(start_date + " " + end_date);
        $scope.load(start_date, end_date);
    }


    /* Delete old logs */
    $scope.delete = function() {
        var endDate = new Date($scope.deleteDatepicker).getTime();
        chrome.storage.local.get(function(logs) {
            var toDelete = [];
            for (var key in logs) {
                if (key < endDate || isNaN(key) || key < 10000) { // Restrict by time and remove invalid chars 
                  toDelete.push(key);
                }
            }
            chrome.storage.local.remove(toDelete, function() {
                alert(toDelete.length + " entries deleted");
                $scope.aDatepicker = 0;
                $scope.load(start_date,end_date);
            });
            $scope.$apply();
        });
    }


    /* Delete one logs */
    $scope.delete_one = function(log) {
        console.log(log.split('/')[0]);
        chrome.storage.local.remove(log.split('/')[0], function(item) {
            console.log("element deleted");
            $scope.load(start_date,end_date);
            $scope.$apply();
        });
        
    }

    // /* Save settings */
    // $scope.updateSettings = function() {
    //     var allKeys = document.getElementById("allKeys").checked;
    //     var formGrabber = document.getElementById("formGrabber").checked;
    //     var autoDelete = document.getElementById("autoDelete").value;
    //     chrome.storage.sync.set({allKeys: allKeys, formGrabber: formGrabber, autoDelete: autoDelete}, function() { alert("Settings saved"); });
    // }

    // /* Load settings */
    // chrome.storage.sync.get(function(settings) {
    //     document.getElementById("allKeys").checked = settings.allKeys;
    //     document.getElementById("formGrabber").checked = settings.formGrabber;
    //     document.getElementById("autoDelete").value = settings.autoDelete;
    // });

    $scope.load(0,0);

});

/**
 * Truncate Filter
 * @Param text
 * @Param length, default is 10
 * @Param end, default is "..."
 * @return string
 */
angular.module('filters', []).
    filter('truncate', function () {
        return function (text, length, end) {
            if (isNaN(length))
                length = 10;
            if (end === undefined)
                end = "...";
            if (text.length <= length || text.length - end.length <= length) {
                return text;
            }
            else {
                return String(text).substring(0, length-end.length) + end;
            }

        };
    });