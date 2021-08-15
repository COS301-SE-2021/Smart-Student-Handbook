from re import X
from dataLoader import SmartAssistData
from smartAssistModel import SmartAssistModel
import numpy as np

data = SmartAssistData()
data.loadData(count=5000)
data.generateFinalData(n_positive=1000)
data.generateTrainTestData()

smartmodel = SmartAssistModel(data=data)
# smartmodel.buildModel()



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

# smartmodel.trainModel(dataX= xtrain, dataY= ytrain, validationData=(xtest, ytest))
# smartmodel.evaluteModel(dataX= xtest, dataY= ytest)

smartmodel.loadSmartModel()

smartmodel.getRecommendations('Toy Story')

itemData = data.getRandomDataItem()
print(itemData)
item = {
    'data': np.array([itemData[0]]),
    'cast': np.array([itemData[1]]),
    'director': np.array([itemData[2]]),
    'keywords': np.array([itemData[3]]),
    'genres': np.array([itemData[4]]),
    }
print(item)
smartmodel.predict(item)