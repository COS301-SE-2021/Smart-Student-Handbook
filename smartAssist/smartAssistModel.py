from typing import cast
from keras.layers import Input, Embedding, Dot, Reshape, Dense
from keras.layers.merge import Average
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
        cast = Input(name = 'cast', shape=[1])
        director = Input(name = 'director', shape=[1])
        keywords = Input(name = 'keywords', shape=[1])
        genres = Input(name = 'genres', shape=[1])


        data_embedding = Embedding(name = 'data_embedding', input_dim = len(self.data.data_index)+1, output_dim=embedding_size)(data)
        cast_embedding = Embedding(name = 'cast_embedding', input_dim = len(self.data.cast_index)+1, output_dim=embedding_size)(cast)
        director_embedding = Embedding(name = 'director_embedding', input_dim = len(self.data.directors_index)+1, output_dim=embedding_size)(director)
        keywords_embedding = Embedding(name = 'keywords_embedding', input_dim = len(self.data.keywords_index)+1, output_dim=embedding_size)(keywords)
        genre_embedding = Embedding(name = 'genre_embedding', input_dim = len(self.data.genres_index)+1, output_dim=embedding_size)(genres)

        merged_cast = Dot(name = 'dot_product_cast', normalize = True, axes = 2)([data_embedding, cast_embedding])
        merged_director = Dot(name = 'dot_product_director', normalize = True, axes = 2)([data_embedding, director_embedding])
        merged_keywords = Dot(name = 'dot_product_keywords', normalize = True, axes = 2)([data_embedding, keywords_embedding])
        merged_genre = Dot(name = 'dot_product_genre', normalize = True, axes = 2)([data_embedding, genre_embedding])

        average = Average()([merged_cast, merged_director, merged_keywords, merged_genre])
        
        merged = Reshape(target_shape=[1])(average)

        # merged = Dense(1, activation = 'sigmoid')(merged)

        self.model = Model(inputs = [data, cast, director, keywords, genres], outputs = [merged, data_embedding])


        # self.model.compile(optimizer = 'Adam', loss = 'binary_crossentropy', metrics = ['accuracy'])
        self.model.compile(optimizer = 'Adam', loss = 'mse')
        print(self.model.summary())
        
        return self.model

    
    def trainModel(self, dataX, dataY, validationData):
        embed_model = self.model.fit(dataX, dataY, batch_size = 16, epochs = 16, steps_per_epoch = 8, validation_data=validationData, validation_freq=1, validation_batch_size=8, verbose = 2)
        self.model.save('models/smartAssistModel.h5')

    def evaluteModel(self, dataX, dataY):
        self.model.evaluate(dataX, dataY, batch_size=32)

    def getRecommendations(self, name):
        weight_layer = self.model.get_layer('data_embedding')
        weights = weight_layer.get_weights()[0]
        
        # Normalize
        weights = weights / np.linalg.norm(weights, axis = 1).reshape((-1, 1))


        dists = np.dot(weights, weights[self.data.data_index[name]])
        sorted_dists = np.argsort(dists)

        
        closest = sorted_dists[-10:]

        print(name)

        max_width = max([len(self.data.index_data[c]) for c in closest])

        # Print the most similar and distances
        for c in reversed(closest):
            print(f'{self.data.index_data[c]:{max_width + 2}} Similarity: {dists[c]:.{2}}')

    


    def loadSmartModel(self):
        self.model = load_model('models/smartAssistModel.h5')

    def predict(self, item):
        
        out = self.model.predict(x=item)

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

        max_width = max([len(self.data.index_data[c]) for c in closest])

        # Print the most similar and distances
        for c in reversed(closest):
            print(f'{self.data.index_data[c]:{max_width + 2}} Similarity: {dists[c]:.{2}}')

        