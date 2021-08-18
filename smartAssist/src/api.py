from functools import cache
import os
import json
import numpy as np
from flask import Flask, request, abort, jsonify, g

from notebookDataLoader import SmartAssistData
from smartAssistModel import SmartAssistModel

data = SmartAssistData()
smartmodel = SmartAssistModel(data=data)

app = Flask(__name__)


@app.route("/")
def testInstance():
    return "Smart Assist is working!!"

@app.route("/trainModel")
def trainModel():
    global data
    global smartmodel

    smartmodel.train()

@app.route("/getReccommendation", methods=['GET', 'POST'])
def getRecommendation():
    global data
    global smartmodel

    if request.method == 'POST':
        reqData = request.get_json()

        if set(['name', 'tags', 'author', 'institution', 'course']).issubset(set(reqData.keys())):
            name = reqData['name']
            tags = reqData['tags']
            author = reqData['author']
            institution = reqData['institution']
            course = reqData['course']
        else:
            abort(400)
            
        
        item = data.createSoup(name, tags, author, institution, course)

        recs = smartmodel.getRecommendations(item)

        return jsonify(success = True, data = recs)
    else:
        abort(400)

@app.route("/addData", methods=['GET', 'POST'])
def addData():
    global data
    global smartmodel

    if request.method == 'POST':
        reqData = request.get_json()

        if set(['nodeId', 'name', 'tags', 'author', 'institution', 'course']).issubset(set(reqData.keys())):
            id = reqData['noteId']
            name = reqData['name']
            tags = reqData['tags']
            author = reqData['author']
            institution = reqData['institution']
            course = reqData['course']
        else:
            abort(400)

        note = {
            "noteId": id,
            "name": name,
            "tags": tags,
            "author": author,
            "institution": institution,
            "course": course
        }
        
        data.addData(note)

        return jsonify(success = True)
    else:
        abort(400)

@app.route("/removeData", methods=['GET', 'POST'])
def removeData():
    global data
    global smartmodel
    
    if request.method == 'POST':
        reqData = request.get_json()

        if set(['nodeId', 'name', 'tags', 'author', 'institution', 'course']).issubset(set(reqData.keys())):
            id = reqData['noteId']
            name = reqData['name']
            tags = reqData['tags']
            author = reqData['author']
            institution = reqData['institution']
            course = reqData['course']
        else:
            abort(400)

        note = {
            "noteId": id,
            "name": name,
            "tags": tags,
            "author": author,
            "institution": institution,
            "course": course
        }
        
        data.removeData(note)

        return jsonify(success = True)


@app.route("/editData", methods=['GET', 'POST'])
def editData():
    global data
    global smartmodel

    if request.method == 'POST':
        reqData = request.get_json()

        if set(['nodeId', 'name', 'tags', 'author', 'institution', 'course']).issubset(set(reqData.keys())):
            id = reqData['noteId']
            name = reqData['name']
            tags = reqData['tags']
            author = reqData['author']
            institution = reqData['institution']
            course = reqData['course']
        else:
            abort(400)

        note = {
            "noteId": id,
            "name": name,
            "tags": tags,
            "author": author,
            "institution": institution,
            "course": course
        }
        
        data.editData(note)

        return jsonify(success = True)


    else:
        abort(400)




if __name__ == "__main__":

    # data, smartmodel = get_data_smartmode()

    data.loadData(count=10000)
    smartmodel.loadSmartModel()

    app.app_context()

    app.run(debug=True,host="0.0.0.0", port=int(os.environ.get("PORT", 6001)))

