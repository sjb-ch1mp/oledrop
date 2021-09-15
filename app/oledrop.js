function oledrop(){    
    //https://stackoverflow.com/questions/36067767/how-do-i-upload-a-file-with-the-js-fetch-api
    PREVIOUS_RESULTS = null;
	notify('');
	document.getElementById('result').innerHTML = '';

    let data = new FormData();
    data.append('drop', document.getElementById('drop').files[0]);

    fetch("/oledrop", {
        method: "POST",
        mode: "cors",
        body: data
    })
    .then(response => response.json())
    .then(data => {
        buildResults(data);
    })
    .catch((err) => {
        notify(err.message);
    });
}

function buildResults(olevbaResults){
    let results = document.getElementById('result');

    //check for error results
	if("error" in olevbaResults[0]){
		notify(olevbaResults[0].error + ": " + olevbaResults[0].message);
		return;
	}
	
	let type = olevbaResults[0].type;
	let name = olevbaResults[0].name;
	if(!olevbaResults[1].hasMacros){
		notify("No macros detected in file \"" + name + "\" (" + type + ")")
	}else{
		notify("Results for file \"" + name + "\" (" + type + ")");
		if(olevbaResults[2].hasDetections){
			results.appendChild(buildDetectionContainer(olevbaResults[2].detections));
		}
		for(let i in olevbaResults[1].macros){
			results.appendChild(buildMacroContainer(olevbaResults[1].macros[i]));
		}
        PREVIOUS_RESULTS = olevbaResults;
	}
}

function buildDetectionContainer(detections){
    let detectionContainer = document.createElement('div');
    detectionContainer.classList.add("result-detection");
    for(let i in detections){
        let detection = document.createElement('div');
        detection.classList.add("detection");
        detection.innerHTML = "<span style=\"font-weight: bolder;\">" + detections[i].type + "</span> : \"" + detections[i].keyword + "\"";
        detectionContainer.appendChild(detection);
    }
    return detectionContainer;
}

function buildMacroContainer(macro){
    let macroContainer = document.createElement('div');
    macroContainer.classList.add("result-macro");

    let macroHeader = document.createElement('div');
    macroHeader.classList.add("macro-header");
    macroHeader.innerText = macro.vba_filename + " (" + macro.stream_path + ")";

    let macroProper = document.createElement('textarea');
    macroProper.classList.add("macro");
	macroProper.setAttribute('spellcheck','false');
    macroProper.value = macro.vba_code;

    macroContainer.appendChild(macroHeader);
    macroContainer.appendChild(macroProper);
    return macroContainer;
}

function notify(message){
    document.getElementById('notify').innerText = message;
}

function padResult(){
    let headerHeight = document.getElementById("header").clientHeight + 50;
    document.getElementById("result").setAttribute("style", "padding-top: " + headerHeight + "px");
}

function showResultsAsText(){
    if(!PREVIOUS_RESULTS){
        notify("There are no results!");
    }else if(SHOWING_TEXT){
	    SHOWING_TEXT = false;
    	document.getElementById('result').innerHTML = '';
	    buildResults(PREVIOUS_RESULTS);
	    return;
    }

    let results = document.getElementById('result');
    results.innerHTML = '';
    
    let resultTextArea = document.createElement('textarea');
    resultTextArea.classList.add('textresults');
	resultTextArea.setAttribute('spellcheck','false');

    let resultText = '\nRESULTS FOR FILE "' + PREVIOUS_RESULTS[0].name + "\" (" + PREVIOUS_RESULTS[0].type + ")\n";
    if(PREVIOUS_RESULTS[2].hasDetections){
        resultText += "\n" + border("=", 44) + " DETECTIONS " + border("=", 44) + "\n";
        for(let i=0; i<PREVIOUS_RESULTS[2].detections.length; i++){
            resultText += "[" + i + "] " + PREVIOUS_RESULTS[2].detections[i].type + ": \"" + PREVIOUS_RESULTS[2].detections[i].keyword + "\"\n";
        }
	    resultText += "\n";
    }
    resultText += border("=", 46) + " MACROS " + border("=", 46) + "\n";
    for(let i=0; i<PREVIOUS_RESULTS[1].macros.length; i++){
        resultText += ((i>0)?border("-", 100) + "\n":"") + "[" + i + "] " + PREVIOUS_RESULTS[1].macros[i].vba_filename + " (" + PREVIOUS_RESULTS[1].macros[i].stream_path + ")\n\n";
        resultText += PREVIOUS_RESULTS[1].macros[i].vba_code.trim() + "\n";
    }

    resultTextArea.value = resultText;
    results.appendChild(resultTextArea);
	SHOWING_TEXT = true;
}

function border(token, length){
	let b = '';
	for(let i=0; i<length; i++){
		b += token;
	}
	return b;
}
