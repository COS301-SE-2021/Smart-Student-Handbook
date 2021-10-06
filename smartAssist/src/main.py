# from dataLoader import MovieData
from smartAssistModel import SmartAssistModel
from notebookDataLoader import SmartAssistData
from loadData import cloudStorage

import numpy as np

data = SmartAssistData()

cloud = cloudStorage()

cloud.loadAllData()

data.loadData(count=10000)

data.generateFinalData(n_positive=5000)

data.generateTrainTestData()

smartmodel = SmartAssistModel(data=data)

print("buildingmodel")

# smartmodel.buildModel()
smartmodel.loadSmartModel()

print("training")

xtrain = {
    'data': np.asarray(data.finalSetXTrain[:,0]).astype('float32'), 
    'name': np.asarray(data.finalSetXTrain[:,1]).astype('float32'), 
    'tags': np.asarray(data.finalSetXTrain[:,2]).astype('float32'), 
    'author': np.asarray(data.finalSetXTrain[:,3]).astype('float32'), 
    'institution': np.asarray(data.finalSetXTrain[:,4]).astype('float32'),
    'course': np.asarray(data.finalSetXTrain[:,5]).astype('float32')
    }

ytrain = data.finalSetYTrain

xtest = {
    'data': np.asarray(data.finalSetXTest[:,0]).astype('float32'), 
    'name': np.asarray(data.finalSetXTest[:,1]).astype('float32'), 
    'tags': np.asarray(data.finalSetXTest[:,2]).astype('float32'), 
    'author': np.asarray(data.finalSetXTest[:,3]).astype('float32'), 
    'institution': np.asarray(data.finalSetXTest[:,4]).astype('float32'),
    'course': np.asarray(data.finalSetXTest[:,5]).astype('float32')
    }

ytest = data.finalSetYTest

smartmodel.trainModel(dataX= xtrain, dataY= ytrain, validationData= (), batch_size=128, epochs=32, steps_per_epoch=16)
smartmodel.evaluteModel(dataX= xtest, dataY= ytest)

# cloud.saveAllData()



