import os
import json
import numpy as np
from flask import Flask, url_for, request, abort, jsonify

from dataLoader import SmartAssistData
from smartAssistModel import SmartAssistModel

app = Flask(__name__)

@app.route("/getReccommendation", methods=['GET', 'POST'])
def getRecommendation():
    if request.method == 'POST':
        reqData = request.get_json()

        if 'name' in reqData.keys():
            name = reqData['name']

        data.loadData(count=10000)

        smartmodel.loadSmartModel()

        recs = smartmodel.getRecommendations(name)

        return jsonify(data = recs)
    else:
        abort(400)


if __name__ == "__main__":
    global data
    global smartmodel

    data = SmartAssistData()
    smartmodel = SmartAssistModel(data=data)

    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


# noteId
# name
# tags
# Author
# institution
# course
#
#