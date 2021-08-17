from keras.layers import Input, Embedding, Dot, Reshape, Dense
from keras.layers.core import Flatten
from keras.layers.merge import Average, Multiply, average
from keras.models import Model
from keras.saving.save import load_model
import numpy as np
from numpy.core.fromnumeric import ptp
import pandas as pd
import joblib


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


        self.model.compile(optimizer = 'Adam', loss = 'mse', loss_weights=[0.1,0.25,0.25,0.25,0.25,0.25])
        self.predict_model.compile(optimizer = 'Adam', loss = 'mse')

        
        print(self.model.summary())


        # [print(i.shape, i.dtype) for i in self.model.inputs]
        # [print(o.shape, o.dtype) for o in self.model.outputs]
        # [print(l.name, l.input_shape, l.dtype) for l in self.model.layers]
        
        return self.model

    
    def trainModel(self, dataX, dataY, validationData):
        if len(validationData) == 0:
            embed_model = self.model.fit(dataX, dataY, batch_size = 128, epochs = 32, steps_per_epoch = 16, verbose = 2)
        else:
            embed_model = self.model.fit(dataX, dataY, batch_size = 16, epochs = 16, steps_per_epoch = 8, validation_data=validationData, validation_freq=1, validation_batch_size=8, verbose = 2)
            
        self.model.save('smartAssist/models/smartAssistModel.h5')
        self.predict_model.save('smartAssist/models/smartAssistPredictModel.h5')
        self.saveEmbeddingWeights()

    def evaluteModel(self, dataX, dataY):
        self.model.evaluate(dataX, dataY, batch_size=32)

    def loadSmartModel(self):
        self.model = load_model('smartAssist/models/smartAssistModel.h5')
        self.predict_model = load_model('smartAssist/models/smartAssistPredictModel.h5')
        with open("smartAssist/models/embeddingWeights.npy", 'rb') as f:
            self.weights = np.load(f)

    def getRecommendations(self, itemData):
        item = {
            'data': np.array([itemData[0]]), 
            'name': np.array([itemData[1]]), 
            'tags': np.array([itemData[2]]), 
            'author': np.array([itemData[3]]), 
            'institution': np.array([itemData[4]]),
            'course': np.array([itemData[5]]),
            'soup': np.array([itemData[6].tolist()])
        }

        return self.predict(item)

    def predict(self, item):
        
        out = self.predict_model.predict(x=item)
        print(out[1][0].shape)
        weight = out[1][0]
        weight = weight / np.linalg.norm(weight)

        return self.getRecommendationsFromPrediction(weight)


    def getRecommendationsFromPrediction(self, predictweight):
        # with open("smartAssist/models/embeddingWeights.npy", 'rb') as f:
        #     weights = np.load(f)
        
        # weights = self.weight
        print(self.weights.shape)


        dists = np.dot(self.weights, predictweight)
        sorted_dists = np.argsort(dists)

        
        closest = sorted_dists[-10:]

        max_width = 48

        ret = list(())

        for idx, c in enumerate(reversed(closest)):
            print(f'{idx+1}\t{self.data.index_data[self.data.index_dataSet[c]]:{max_width}} Similarity: {dists[c]:.{2}}\n\t{self.data.data_soup[self.data.index_data[self.data.index_dataSet[c]]]}')#, [i.tolist() for i in self.data.dataList if i[0] == self.data.index_data[c]][0]
            ret.append(self.data.index_data[self.data.index_dataSet[c]])

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
        print(self.weight.shape)

        with open("smartAssist/models/embeddingWeights.npy", 'wb') as f:
            np.save(f, self.weight)