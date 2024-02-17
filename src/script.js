
var folder = "examples/";
var jsondata = new Object(); //JSON.parse(text);

var ARC_IMG =[]
var ComparisonArray = []
$.ajax({
    url : folder,
    async:false,
    success: function (data) {
        beginTask();
        $(data).find("a").attr("href", function (i, val) {
            if( val.match(/\.(jpe?g|png|gif)$/) ) { 
                ARC_IMG.push(val);    
            } 
        })                
    }
});  

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
    // Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  output.innerHTML = this.value;
}
function submit(){
    var comparison = new Object()
    
    var image1 = document.getElementById("c1");
    var image2 = document.getElementById("c2");

    comparison.left = image1.src
    comparison.right = image2.src
    comparison.score = slider.value;
    ComparisonArray.push(comparison)
    var item1 = ARC_IMG[Math.floor(Math.random()*ARC_IMG.length)];
    var item2 = ARC_IMG[Math.floor(Math.random()*ARC_IMG.length)];
    image1.src = item1;
    image2.src = item2;
    sendData();
}


//CORS
function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
                    // XHR for Chrome/Firefox/Opera/Safari.
        xhr.open(method, url, true);
    } 
    else if (typeof XDomainRequest != "undefined") {
        // XDomainRequest for IE.
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } 
    else {
        // CORS not supported.
        xhr = null;
        }
        return xhr;
    }

function createSubj(){
    var data = JSON.stringify(jsondata);
    var url = '/arcdragdrop';
    var xhr = createCORSRequest('POST',url)
    if (!xhr){
        throw new Error('CORS not supported');
    } 
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload = function(){
        var text = xhr.responseText;    
    };
    xhr.onerror = function(){
        alert("Error sending data to server");  
    };
    xhr.send(data);
}

function sendData(){
    
    jsondata.session = ComparisonArray;
    
    
    var data = JSON.stringify(jsondata);
    var url = 'arcdragdrop';
    var xhr = createCORSRequest('PUT',url)
    if (!xhr){
        throw new Error('CORS not supported');
    } 
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.onload = function(){
        var text = xhr.responseText;    
    };
    xhr.onerror = function(){
        alert("Error sending data to server");  
    };
    xhr.send(data);
    
}

function beginTask(){
    jsondata.username = Math.random().toString(36).substring(2,10);
    jsondata.start_time = Date();
    console.log("BEGIN");
    createSubj();
}
