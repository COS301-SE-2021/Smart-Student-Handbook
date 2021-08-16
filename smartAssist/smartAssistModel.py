from typing import cast
from keras.layers import Input, Embedding, Dot, Reshape, Dense
from keras.layers.merge import Average, Multiply, average
from keras.models import Model
from keras.saving.save import load_model
import numpy as np
from numpy.core.fromnumeric import ptp
import pandas as pd
import dataLoader

class SmartAssistModel():
    def __init__(self, data):
        self.data = data
        
        pass

    def buildModel(self, embedding_size = 50):
        data = Input(name = 'data', shape=[1])
        data_embedding = Embedding(name = 'data_embedding', input_dim = len(self.data.data_index)+1, output_dim=embedding_size)(data)
        self.data_model = Model(inputs= [data], outputs= [data_embedding])

        cast = Input(name = 'cast', shape=[1])
        cast_embedding = Embedding(name = 'cast_embedding', input_dim = len(self.data.cast_index)+1, output_dim=embedding_size)(cast)
        self.cast_model = Model(inputs= [cast], outputs= [cast_embedding])

        director = Input(name = 'director', shape=[1])
        director_embedding = Embedding(name = 'director_embedding', input_dim = len(self.data.directors_index)+1, output_dim=embedding_size)(director)
        self.director_model = Model(inputs= [director], outputs= [director_embedding])

        keywords = Input(name = 'keywords', shape=[1])
        keywords_embedding = Embedding(name = 'keywords_embedding', input_dim = len(self.data.keywords_index)+1, output_dim=embedding_size)(keywords)
        self.keywords_model = Model(inputs= [keywords], outputs= [keywords_embedding])

        genres = Input(name = 'genres', shape=[1])
        genre_embedding = Embedding(name = 'genre_embedding', input_dim = len(self.data.genres_index)+1, output_dim=embedding_size)(genres)
        self.genre_model = Model(inputs= [genres], outputs= [genre_embedding])

        
        merged_cast = Dot(name = 'dot_product_cast', normalize = True, axes = 2)([data_embedding, cast_embedding])
        merged_director = Dot(name = 'dot_product_director', normalize = True, axes = 2)([data_embedding, director_embedding])
        merged_keywords = Dot(name = 'dot_product_keywords', normalize = True, axes = 2)([data_embedding, keywords_embedding])
        merged_genre = Dot(name = 'dot_product_genre', normalize = True, axes = 2)([data_embedding, genre_embedding])

        # dense_cast = Dense(50, name = "cast_dense")(merged_cast)
        # dense_director = Dense(50, name = "director_dense")(merged_director)
        # dense_keywords = Dense(50, name = "keywords_dense")(merged_keywords)
        # dense_genre = Dense(50, name = "genre_dense")(merged_genre)

        # merged_cast_director = Dot(name = 'dot_product_cast_director', normalize = True, axes = 2)([dense_cast, dense_director])
        # merged_keywords_genre = Dot(name = 'dot_product_keywords_genre', normalize = True, axes = 2)([dense_keywords, dense_genre])

        # dense_cast_director = Dense(50, name = "cast_director_dense")(merged_cast_director)
        # dense_keywords_genre = Dense(50, name = "keywords_genre_dense")(merged_keywords_genre)

        # merged_all = Dot(name = 'dot_product_all', normalize = True, axes = 2)([dense_cast_director, dense_keywords_genre])

        merged_all = Average(name="average")([merged_cast, merged_director, merged_keywords, merged_genre])

        merged_all = Reshape(name= "merged_all", target_shape=[1])(merged_all)
        merged_cast = Reshape(name= "merged_cast", target_shape=[1])(merged_cast)
        merged_director = Reshape(name= "merged_director", target_shape=[1])(merged_director)
        merged_keywords = Reshape(name= "merged_keyword", target_shape=[1])(merged_keywords)
        merged_genre = Reshape(name= "merged_genre", target_shape=[1])(merged_genre)

        
        self.model = Model(inputs = [data, cast, director, keywords, genres], outputs = [merged_all, merged_cast, merged_director, merged_keywords, merged_genre])
        self.predict_model = Model(inputs= [data, cast, director, keywords, genres], outputs= [merged_all, data_embedding])

        self.model.compile(optimizer = 'Adam', loss = 'mse', loss_weights=[0.1,0.25,0.25,0.25,0.25])
        
        
        print(self.model.summary())
        
        return self.model

    
    def trainModel(self, dataX, dataY, validationData):
        if len(validationData) == 0:
            embed_model = self.model.fit(dataX, dataY, batch_size = 128, epochs = 32, steps_per_epoch = 16, verbose = 2)
        else:
            embed_model = self.model.fit(dataX, dataY, batch_size = 16, epochs = 16, steps_per_epoch = 8, validation_data=validationData, validation_freq=1, validation_batch_size=8, verbose = 2)
            
        self.model.save('models/smartAssistModel2.h5')
        self.predict_model.save('models/smartAssistPredictModel2.h5')

    def evaluteModel(self, dataX, dataY):
        self.model.evaluate(dataX, dataY, batch_size=32)

    def getRecommendations(self, name):
        weight_layer = self.model.get_layer('data_embedding')
        print(np.array(weight_layer.get_weights()).shape)
        weights = weight_layer.get_weights()[0]
        
        # Normalize
        weights = weights / np.linalg.norm(weights, axis = 1).reshape((-1, 1))


        dists = np.dot(weights, weights[self.data.data_index[name]])
        sorted_dists = np.argsort(dists)

        
        closest = sorted_dists[-10:]

        print(name)

        max_width = 30

        # Print the most similar and distances
        for c in reversed(closest):
            print(f'{self.data.index_data[c]:{max_width + 2}} Similarity: {dists[c]:.{2}} \nItem:', [i.tolist() for i in self.data.dataList if i[0] == self.data.index_data[c]][0])




    def loadSmartModel(self):
        self.model = load_model('models/smartAssistModel.h5')
        self.predict_model = load_model('models/smartAssistPredictModel.h5')

    def predict(self, item):
        
        out = self.predict_model.predict(x=item)

        weight = out[1][0][0]

        weight = weight / np.linalg.norm(weight)

        self.getRecommendationsFromPrediction(weight)


    def getRecommendationsFromPrediction(self, predictweight):
        weight_layer = self.model.get_layer('data_embedding')
        weights = weight_layer.get_weights()[0]
        
        # Normalize
        weights = weights / np.linalg.norm(weights, axis = 1).reshape((-1, 1))
        
        dists = np.dot(weights, predictweight)
        sorted_dists = np.argsort(dists)

        
        closest = sorted_dists[-10:]

        # print(name)

        max_width = 30

        # Print the most similar and distances
        for c in reversed(closest):
            print(f'{self.data.index_data[c]:{max_width + 2}} Similarity: {dists[c]:.{2}} \nItem:', [i.tolist() for i in self.data.dataList if i[0] == self.data.index_data[c]][0])

        