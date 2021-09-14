#!/replace/this/with/absolute/path/to/oletools-venv/bin/python

import sys
import json
import os
from oletools.olevba import VBA_Parser, TYPE_OLE, TYPE_OpenXML, TYPE_Word2003_XML, TYPE_MHTML

#https://github.com/decalage2/oletools/wiki/olevba
def analyze(filepath):
    filename = filepath.split(os.path.sep)[-1]
    results = []
    fileinfo = {"type":"","name":filename}
    macros = {"hasMacros":False,"macros":[]}
    detections = {"hasDetections":False,"detections":[]}
    try:
        vbaparser = VBA_Parser(filepath)
        fileinfo["type"] = vbaparser.type

        if vbaparser.detect_vba_macros():
            # extract macros
            for (filename, stream_path, vba_filename, vba_code) in vbaparser.extract_macros():
                macro = {"filename":filename,
                        "stream_path":stream_path,
                        "vba_filename":vba_filename,
                        "vba_code":vba_code}
                macros["macros"].append(macro)

            # collect detections
            for (kw_type, keyword, description) in vbaparser.analyze_macros():
                detection = {"type":kw_type,
                        "keyword":keyword}
                detections["detections"].append(detection)

            # sanity check after extractions
            if len(macros["macros"]) > 0:
                macros["hasMacros"] = True
            if len(detections["detections"]) > 0:
                detections["hasDetections"] = True

        results.append(fileinfo)
        results.append(macros)
        results.append(detections)
        return results
    except Exception as err:
        #raise err
        #print(err)
        error = {"error":"oledrop.py",
                "message":str(err)}
        results.append(error)
        return results

if __name__ == "__main__":
    print(json.dumps(analyze(sys.argv[1])))
