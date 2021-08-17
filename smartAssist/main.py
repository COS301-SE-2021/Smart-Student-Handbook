# from dataLoader import MovieData
from smartAssistModel import SmartAssistModel
from notebookDataLoader import SmartAssistData
import numpy as np

data = SmartAssistData()

data.loadData(count=10000)

data.generateFinalData(n_positive=5000)

data.generateTrainTestData()

smartmodel = SmartAssistModel(data=data)

xtrain = {
    'data': np.asarray(data.finalSetXTrain[:,0]).astype('float32'), 
    'name': np.asarray(data.finalSetXTrain[:,1]).astype('float32'), 
    'tags': np.asarray(data.finalSetXTrain[:,2]).astype('float32'), 
    'author': np.asarray(data.finalSetXTrain[:,3]).astype('float32'), 
    'institution': np.asarray(data.finalSetXTrain[:,4]).astype('float32'),
    'course': np.asarray(data.finalSetXTrain[:,5]).astype('float32'),
    'soup': np.asarray(data.finalSetXTrain[:,6].tolist()).astype('float32')
    }

ytrain = data.finalSetYTrain

xtest = {
    'data': np.asarray(data.finalSetXTest[:,0]).astype('float32'), 
    'name': np.asarray(data.finalSetXTest[:,1]).astype('float32'), 
    'tags': np.asarray(data.finalSetXTest[:,2]).astype('float32'), 
    'author': np.asarray(data.finalSetXTest[:,3]).astype('float32'), 
    'institution': np.asarray(data.finalSetXTest[:,4]).astype('float32'),
    'course': np.asarray(data.finalSetXTest[:,5]).astype('float32'),
    'soup': np.asarray(data.finalSetXTest[:,6].tolist()).astype('float32')
    }

ytest = data.finalSetYTest

smartmodel.buildModel()

# smartmodel.loadSmartModel()

smartmodel.trainModel(dataX= xtrain, dataY= ytrain, validationData= ())
smartmodel.evaluteModel(dataX= xtest, dataY= ytest)

# smartmodel.loadSmartModel()

# smartmodel.getRecommendations('f9d30e4f-a5ed-4868-95e7-8823c5279bca')
# print()
# smartmodel.getRecommendations('The Jungle Book')

itemData = data.getRandomDataItem()
print(itemData[6].shape)
item = {
    'data': np.array([itemData[0]]), 
    'name': np.array([itemData[1]]), 
    'tags': np.array([itemData[2]]), 
    'author': np.array([itemData[3]]), 
    'institution': np.array([itemData[4]]),
    'course': np.array([itemData[5]]),
    'soup': np.array([itemData[6].tolist()])
    }
   
print(item)
print(data.dataSet[6])
item = {
    'data': np.array([data.dataSet[:,0]], dtype='float32'), 
    'name': np.array([data.dataSet[:,1]], dtype='float32'), 
    'tags': np.array([data.dataSet[:,2]], dtype='float32'), 
    'author': np.array([data.dataSet[:,3]], dtype='float32'), 
    'institution': np.array([data.dataSet[:,4]], dtype='float32'),
    'course': np.array([data.dataSet[:,5]], dtype='float32'),
    'soup': np.array([data.dataSet[:,6].tolist()])
    }
print(item['data'].shape)
print(item['soup'].shape)
print(item)
smartmodel.predict(item)

