function oledrop(input){
    //olevba -j test.xlsm 2>/dev/null | sed 's/{sis\.\.\./{/g'
    //sed and stderr redirection required due to issue https://github.com/decalage2/oletools/issues/701
    let file = input.files[0];
    let formData = new FormData();
    formData.append("drop", file);
    fetch("http://ch1mpfs:3000/oledrop", {
        method:"POST",
        mode:"cors",
        data:formData
    })
    .then(response => response.json())
    .then(result => {
        buildResults(result);
        padResult();
    })
    .catch((err) => {
        notify(err.message);
    });
}

function buildResults(olevbaResults){
    let results = document.getElementById('result');

    //check for error results
    let error = null;
    for(let i in olevbaResults){
        if("error" in olevbaResults[i]){
            error = olevbaResults[i];
            break;
        }
    }
    if(error){
        notify(error.error + ": " + error.message);
        return;
    }

    //get detections, file, type and macros
    let detections = null;
    let macros = null;
    let type = null;
    let file = null;
    for(let i in olevbaResults){
        if("analysis" in olevbaResults[i]){
            detections = olevbaResults[i].analysis;
        }
        if("macros" in olevbaResults[i]){
            macros = olevbaResults[i].macros;
        }
        if("type" in olevbaResults[i]){
            type = olevbaResults[i].type;
        }
        if("file" in olevbaResults[i]){
            file = olevbaResults[i].file;
        }
        if(macros && detections && file && type){
            break;
        }
    }

    //add header
    notify("Results for " + file + " (" + type + ")");

    //add detections and macros to results
    results.appendChild(buildDetectionContainer(detections));
    for(let i in macros){
        results.appendChild(buildMacroContainer(macros[i]));
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
    macroHeader.innerText = macro.vba_filename + " (" + macro.subfilename + ")";

    let macroProper = document.createElement('textarea');
    macroProper.classList.add("macro");
    macroProper.value = macro.code;

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

function downloadResults(){
    if(OLEVBA_RESULTS != null){
        let fileName = OLEVBA_RESULTS.filename.replace(/\./g, "_") + ".txt";
        let blob = new Blob([OLEVBA_RESULTS.results], {type: "text/plain"});
        if(window.navigator.msSaveOrOpenBlob){
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        }else{
            let element = document.createElement('a');
            element.href = window.URL.createObjectURL(blob);
            element.download = fileName;
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }
    }else{
        notify("No results to download!");
    }
}