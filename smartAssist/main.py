from dataLoader import SmartAssistData
from smartAssistModel import SmartAssistModel
import numpy as np

data = SmartAssistData()
print("loading data")
data.loadData(count=10000)
print("generating final data")
data.generateFinalData(n_positive=5000)
print("generating test data")
data.generateTrainTestData()

smartmodel = SmartAssistModel(data=data)

xtrain = {
    'data': data.finalSetXTrain[:,0], 
    'cast': data.finalSetXTrain[:,1], 
    'director': data.finalSetXTrain[:,2], 
    'keywords': data.finalSetXTrain[:,3], 
    'genres': data.finalSetXTrain[:,4]
    }

ytrain = data.finalSetYTrain

xtest = {
    'data': data.finalSetXTest[:,0], 
    'cast': data.finalSetXTest[:,1], 
    'director': data.finalSetXTest[:,2], 
    'keywords': data.finalSetXTest[:,3], 
    'genres': data.finalSetXTest[:,4]
    }

ytest = data.finalSetYTest

smartmodel.buildModel()

# smartmodel.loadSmartModel()

smartmodel.trainModel(dataX= xtrain, dataY= ytrain, validationData= ())
smartmodel.evaluteModel(dataX= xtest, dataY= ytest)

# smartmodel.loadSmartModel()

smartmodel.getRecommendations('Toy Story')
print()
smartmodel.getRecommendations('The Jungle Book')

itemData = data.getRandomDataItem()
print(itemData)
item = {
    'data': np.array([9708]),
    'cast': np.array([itemData[1]]),
    'director': np.array([itemData[2]]),
    'keywords': np.array([itemData[3]]),
    'genres': np.array([itemData[4]]),
    }
print(item)
smartmodel.predict(item)