import os
import json
import numpy as np
from flask import Flask, url_for, request, abort, jsonify

from notebookDataLoader import SmartAssistData
from smartAssistModel import SmartAssistModel

app = Flask(__name__)

@app.route("/getReccommendation", methods=['GET', 'POST'])
def getRecommendation():
    if request.method == 'POST':
        reqData = request.get_json()

        if ['name', 'tags', 'author', 'institution', 'course'] in reqData.keys():
            name = reqData['name']
            tags = reqData['tags']
            author = reqData['author']
            institution = reqData['institution']
            course = reqData['course']
        
        item = data.createItem(name, tags, author, institution, course)

        data.loadData(count=10000)

        smartmodel.loadSmartModel()

        recs = smartmodel.getRecommendations(item)

        return jsonify(data = recs)
    else:
        abort(400)


if __name__ == "__main__":
    global data
    global smartmodel

    data = SmartAssistData()
    smartmodel = SmartAssistModel(data=data)

    data.loadData(count=10000)

    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


# noteId
# name
# tags
# Author
# institution
# course
#
#