from keras.layers import Input, Embedding, Dot, Reshape, Dense
from keras.layers.core import Flatten
from keras.layers.merge import Average, Multiply, average
from keras.models import Model
from keras.saving.save import load_model
import numpy as np
from numpy.core.fromnumeric import ptp
import pandas as pd

import os


class SmartAssistModel():
    def __init__(self, data):
        self.data = data
        
        pass

    def buildModel(self, embedding_size = 50):
        data = Input(name = 'data', shape=[1])
        data_embedding = Embedding(name = 'data_embedding', input_dim = len(self.data.data_index)+1, output_dim=embedding_size)(data)
        self.data_model = Model(inputs= [data], outputs= [data_embedding])


        name = Input(name = 'name', shape=[1])
        name_embedding = Embedding(name = 'name_embedding', input_dim = len(self.data.name_index)+1, output_dim=embedding_size)(name)
        self.name_model = Model(inputs= [name], outputs= [name_embedding])


        tags = Input(name = 'tags', shape=[1])
        tags_embedding = Embedding(name = 'tags_embedding', input_dim = len(self.data.tags_index)+1, output_dim=embedding_size)(tags)
        self.tags_model = Model(inputs= [tags], outputs= [tags_embedding])


        author = Input(name = 'author', shape=[1])
        author_embedding = Embedding(name = 'author_embedding', input_dim = len(self.data.authors_index)+1, output_dim=embedding_size)(author)
        self.author_model = Model(inputs= [author], outputs= [author_embedding])


        institution = Input(name = 'institution', shape=[1])
        institution_embedding = Embedding(name = 'institution_embedding', input_dim = len(self.data.institutions_index)+1, output_dim=embedding_size)(institution)
        self.institution_model = Model(inputs= [institution], outputs= [institution_embedding])


        course = Input(name = 'course', shape=[1])
        course_embedding = Embedding(name = 'course_embedding', input_dim = len(self.data.course_index)+1, output_dim=embedding_size)(course)
        self.course_model = Model(inputs= [course], outputs= [course_embedding])

        soup = Input(name = 'soup', shape=[self.data.maxLen])
        soup_embedding = Embedding(name = 'soup_embedding', input_dim = self.data.vocabSize, input_length=self.data.maxLen, output_dim=embedding_size)(soup)
        self.soup_model = Model(inputs= [soup], outputs= [soup_embedding])
        soup_flat = Flatten()(soup_embedding)

        
        merged_name = Dot(name = 'dot_product_name', normalize = True, axes = 2)([data_embedding, name_embedding])
        merged_tags = Dot(name = 'dot_product_tags', normalize = True, axes = 2)([data_embedding, tags_embedding])
        merged_author = Dot(name = 'dot_product_author', normalize = True, axes = 2)([data_embedding, author_embedding])
        merged_institution = Dot(name = 'dot_product_institution', normalize = True, axes = 2)([data_embedding, institution_embedding])
        merged_course = Dot(name = 'dot_product_course', normalize = True, axes = 2)([data_embedding, course_embedding])
        merged_soup = Dot(name = 'dot_product_soup', normalize = True, axes = 2)([data_embedding, soup_embedding])

        merged_soup = Dense(1,name= "dense_soup")(merged_soup)

        merged_all = Average(name="average")([merged_name, merged_tags, merged_author, merged_institution, merged_course, merged_soup])


        merged_all = Reshape(name= "merged_all", target_shape=[1])(merged_all)
        merged_name = Reshape(name= "merged_name", target_shape=[1])(merged_name)
        merged_tags = Reshape(name= "merged_tags", target_shape=[1])(merged_tags)
        merged_author = Reshape(name= "merged_keyword", target_shape=[1])(merged_author)
        merged_institution = Reshape(name= "merged_institution", target_shape=[1])(merged_institution)
        merged_course = Reshape(name= "merged_course", target_shape=[1])(merged_course)
       

        
        self.model = Model(inputs = [data, name, tags, author, institution, course, soup], outputs = [merged_all, merged_name, merged_tags, merged_author, merged_institution, merged_course])
        self.predict_model = Model(inputs= [data, name, tags, author, institution, course, soup], outputs= [merged_all, soup_flat])


        self.model.compile(optimizer = 'Adam', loss = 'mse', loss_weights=[0.10, 0.20, 0.20, 0.10, 0.20, 0.20])
        self.predict_model.compile(optimizer = 'Adam', loss = 'mse')

        return self.model

    
    def train(self, n_positive=5000):
        self.data.generateFinalData(n_positive=n_positive)
        self.data.generateTrainTestData()

        xtrain = {
            'data': np.asarray(self.data.finalSetXTrain[:,0]).astype('float32'), 
            'name': np.asarray(self.data.finalSetXTrain[:,1]).astype('float32'), 
            'tags': np.asarray(self.data.finalSetXTrain[:,2]).astype('float32'), 
            'author': np.asarray(self.data.finalSetXTrain[:,3]).astype('float32'), 
            'institution': np.asarray(self.data.finalSetXTrain[:,4]).astype('float32'),
            'course': np.asarray(self.data.finalSetXTrain[:,5]).astype('float32'),
            'soup': np.asarray(self.data.finalSetXTrain[:,6].tolist()).astype('float32')
        }

        ytrain = self.data.finalSetYTrain

        xtest = {
            'data': np.asarray(self.data.finalSetXTest[:,0]).astype('float32'), 
            'name': np.asarray(self.data.finalSetXTest[:,1]).astype('float32'), 
            'tags': np.asarray(self.data.finalSetXTest[:,2]).astype('float32'), 
            'author': np.asarray(self.data.finalSetXTest[:,3]).astype('float32'), 
            'institution': np.asarray(self.data.finalSetXTest[:,4]).astype('float32'),
            'course': np.asarray(self.data.finalSetXTest[:,5]).astype('float32'),
            'soup': np.asarray(self.data.finalSetXTest[:,6].tolist()).astype('float32')
        }

        ytest = self.data.finalSetYTest

        self.loadSmartModel()
        self.trainModel(dataX=xtrain, dataY=ytrain, validationData=())
        self.evaluteModel(dataX=xtest, dataY=ytest)


    def trainModel(self, dataX, dataY, validationData, batch_size = 64, epochs = 16, steps_per_epoch = 8):
        if len(validationData) == 0:
            embed_model = self.model.fit(dataX, dataY, batch_size = batch_size, epochs = epochs, steps_per_epoch = steps_per_epoch, verbose = 2)
        else:
            embed_model = self.model.fit(dataX, dataY, batch_size = batch_size, epochs = epochs, steps_per_epoch = steps_per_epoch, validation_data=validationData, validation_freq=1, validation_batch_size=8, verbose = 2)
            
        dirname = os.path.dirname(__file__)
        filenameModel = os.path.join(dirname, 'models/smartAssistModel.h5')
        filenamePredictModel = os.path.join(dirname, 'models/smartAssistPredictModel.h5')

        self.model.save(filenameModel)
        self.predict_model.save(filenamePredictModel)
        self.saveEmbeddingWeights()


    def evaluteModel(self, dataX, dataY, batch_size=32):
        self.model.evaluate(dataX, dataY, batch_size=batch_size)


    def loadSmartModel(self):
        dirname = os.path.dirname(__file__)
        filenameModel = os.path.join(dirname, 'models/smartAssistModel.h5')
        filenamePredictModel = os.path.join(dirname, 'models/smartAssistPredictModel.h5')
        filenameEmbeddingWeights = os.path.join(dirname, "models/embeddingWeights.npy")


        self.model = load_model(filenameModel)
        self.predict_model = load_model(filenamePredictModel)
        with open(filenameEmbeddingWeights, 'rb') as f:
            self.weights = np.load(f)


    def getRecommendations(self, itemData):
        item = {
            'data': np.array([itemData[0]]), 
            'name': np.array([itemData[1]]), 
            'tags': np.array([itemData[2]]), 
            'author': np.array([itemData[3]]), 
            'institution': np.array([itemData[4]]),
            'course': np.array([itemData[5]]),
            'soup': np.array([itemData[6].tolist()])[0]
        }

        return self.predict(item)


    def predict(self, item):
        
        out = self.predict_model.predict(x=item)
        weight = out[1][0]
        weight = weight / np.linalg.norm(weight)

        return self.getRecommendationsFromPrediction(weight)


    def getRecommendationsFromPrediction(self, predictweight):
        dists = np.dot(self.weights, predictweight)
        sorted_dists = np.argsort(dists)

        closest = sorted_dists[-20:]

        max_width = 48

        ret = list(())

        for idx, c in enumerate(reversed(closest)):
            try:
                if self.data.index_data[self.data.index_dataSet[c]] not in ret:
                    ret.append(self.data.index_data[self.data.index_dataSet[c]])
            except:
                pass

            if len(ret) == 10:
                break
            

            

        return ret


    def saveEmbeddingWeights(self):
        itemData = self.data.dataSet

        item = {
            'data': np.array([itemData[:,0]],dtype='float32')[0], 
            'name': np.array([itemData[:,1]],dtype='float32')[0],
            'tags': np.array([itemData[:,2]],dtype='float32')[0], 
            'author': np.array([itemData[:,3]],dtype='float32')[0], 
            'institution': np.array([itemData[:,4]],dtype='float32')[0],
            'course': np.array([itemData[:,5]],dtype='float32')[0],
            'soup': np.array([itemData[:,6].tolist()])[0]
            }

        weight = self.predict_model.predict(x=item)[1]

        self.weight = weight / np.linalg.norm(weight, axis = 1).reshape((-1, 1))

        dirname = os.path.dirname(__file__)
        filenameEmbeddingWeights = os.path.join(dirname, "models/embeddingWeights.npy")

        with open(filenameEmbeddingWeights, 'wb') as f:
            np.save(f, self.weight)