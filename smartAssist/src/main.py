# from dataLoader import MovieData
from smartAssistModel import SmartAssistModel
from notebookDataLoader import SmartAssistData
import numpy as np

data = SmartAssistData()

data.loadData(count=10000)

# data.generateFinalData(n_positive=5000)

# data.generateTrainTestData()

smartmodel = SmartAssistModel(data=data)

# xtrain = {
#     'data': np.asarray(data.finalSetXTrain[:,0]).astype('float32'), 
#     'name': np.asarray(data.finalSetXTrain[:,1]).astype('float32'), 
#     'tags': np.asarray(data.finalSetXTrain[:,2]).astype('float32'), 
#     'author': np.asarray(data.finalSetXTrain[:,3]).astype('float32'), 
#     'institution': np.asarray(data.finalSetXTrain[:,4]).astype('float32'),
#     'course': np.asarray(data.finalSetXTrain[:,5]).astype('float32'),
#     'soup': np.asarray(data.finalSetXTrain[:,6].tolist()).astype('float32')
#     }

# ytrain = data.finalSetYTrain

# xtest = {
#     'data': np.asarray(data.finalSetXTest[:,0]).astype('float32'), 
#     'name': np.asarray(data.finalSetXTest[:,1]).astype('float32'), 
#     'tags': np.asarray(data.finalSetXTest[:,2]).astype('float32'), 
#     'author': np.asarray(data.finalSetXTest[:,3]).astype('float32'), 
#     'institution': np.asarray(data.finalSetXTest[:,4]).astype('float32'),
#     'course': np.asarray(data.finalSetXTest[:,5]).astype('float32'),
#     'soup': np.asarray(data.finalSetXTest[:,6].tolist()).astype('float32')
#     }

# ytest = data.finalSetYTest

smartmodel.train()

# smartmodel.buildModel()

# # smartmodel.loadSmartModel()

# smartmodel.trainModel(dataX= xtrain, dataY= ytrain, validationData= ())
# smartmodel.evaluteModel(dataX= xtest, dataY= ytest)

smartmodel.loadSmartModel()

itemData = data.getRandomDataItem()

item = data.createSoup(data.index_name[itemData[1]], [data.index_tags[itemData[2]]], data.index_authors[itemData[3]], data.index_institutions[itemData[4]], data.index_course[itemData[5]])
# print(item)
print(smartmodel.getRecommendations(item))
# item = {
#     'data': np.array([itemData[0]]), 
#     'name': np.array([itemData[1]]), 
#     'tags': np.array([itemData[2]]), 
#     'author': np.array([itemData[3]]), 
#     'institution': np.array([itemData[4]]),
#     'course': np.array([itemData[5]]),
#     'soup': np.array([itemData[6].tolist()])
# }
# itemData = data.dataSet
# print(itemData[6].shape)
# item = {
#     'data': np.array([itemData[:,0]],dtype='float32')[0], 
#     'name': np.array([itemData[:,1]],dtype='float32')[0],
#     'tags': np.array([itemData[:,2]],dtype='float32')[0], 
#     'author': np.array([itemData[:,3]],dtype='float32')[0], 
#     'institution': np.array([itemData[:,4]],dtype='float32')[0],
#     'course': np.array([itemData[:,5]],dtype='float32')[0],
#     'soup': np.array([itemData[:,6].tolist()])[0]
#     }
   
# print(item['soup'].shape)
# print(item['data'].shape)
# smartmodel.saveEmbeddingWeights()
# print(smartmodel.predict(item))
