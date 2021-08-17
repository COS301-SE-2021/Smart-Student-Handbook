from typing import cast
import pandas as pd
import numpy as np
from itertools import chain
from collections import Counter, OrderedDict
import random
from sklearn.model_selection import train_test_split


def count_items(l):
    counts = Counter(l)
    counts = sorted(counts.items(), key = lambda x: x[1], reverse = True)
    counts = OrderedDict(counts)
    
    return counts

class MovieData:
    def __init__(self) -> None:
        pass

    def loadData(self, count=5000):
        dataRaw = pd.read_csv("smartAssist/MovieDataset/MovieTrainingData.csv", low_memory=True)
        dataRaw = dataRaw.drop(columns=['index'])

        print("Column Names:",list(dataRaw.columns))


        # metadata[['title', 'cast', 'director', 'keywords', 'genres', 'soup']].rename(columns=)
        dataRaw['cast'] = dataRaw['cast'].apply(eval)
        dataRaw['keywords'] = dataRaw['keywords'].apply(eval)
        dataRaw['genres'] = dataRaw['genres'].apply(eval)
        dataRaw['soup'] = dataRaw['soup'].apply(eval)
        
        # dataRaw = dataRaw.drop([12892, 13542, 13689, 13696, 13750, 13854])

        # remove = []
        # for index, row in dataRaw.iterrows():
        #     try:
        #         print(index,row['cast'])
        #         if len(row['cast']) == 0 :
        #             remove.append(index)
        #     except:
        #         remove.append(index)
        # print(remove)
        # dataRaw = dataRaw.drop(remove)

        self.dataList = dataRaw[['title', 'cast', 'director', 'keywords', 'genres']][:count].to_numpy()

        self.data_index = {data[0]: idx for idx, data in enumerate(self.dataList)}
        self.index_data = {idx: data for data, idx in self.data_index.items()}

        unique_casts = list(chain(*[list(set(data[1])) for data in self.dataList]))
        cast_counts = count_items(unique_casts)
        self.casts = [t[0] for t in cast_counts.items()]
        self.cast_index = {cast: idx for idx, cast in enumerate(self.casts)}
        self.index_cast = {idx: cast for cast, idx in self.cast_index.items()}

        unique_directors = {data[2]: idx for idx, data in enumerate(self.dataList)}
        directors_counts = count_items(unique_directors)
        self.directors = [t[0] for t in directors_counts.items()]
        self.directors_index = {directors: idx for idx, directors in enumerate(self.directors)}
        self.index_directors = {idx: directors for directors, idx in self.directors_index.items()}
        
        unique_keywords = list(chain(*[list(set(data[3])) for data in self.dataList]))
        keywords_counts = count_items(unique_keywords)
        self.keywords = [t[0] for t in keywords_counts.items()]
        self.keywords_index = {keywords: idx for idx, keywords in enumerate(self.keywords)}
        self.index_keywords = {idx: keywords for keywords, idx in self.keywords_index.items()}

        unique_genres = list(chain(*[list(set(data[4])) for data in self.dataList]))
        genre_counts = count_items(unique_genres)
        self.genres = [t[0] for t in genre_counts.items()]
        self.genres_index = {genre: idx for idx, genre in enumerate(self.genres)}
        self.index_genres = {idx: genre for genre, idx in self.genres_index.items()}


        print(len(self.dataList), len(self.casts), len(self.directors), len(self.keywords), len(self.genres))
        print(len(self.data_index), len(self.cast_index), len(self.directors_index), len(self.keywords_index), len(self.genres_index))



        self.dataSet = []

        for data in self.dataList:
            name = data[0]
            director = data[2]
            for cast in data[1]:
                for keyword in data[3]:
                    for genre in data[4]:
                        if self.data_index[name] < len(self.data_index):
                            self.dataSet.append(np.array([self.data_index[name], self.cast_index[cast], self.directors_index[director], self.keywords_index[keyword], self.genres_index[genre]]))


        self.dataSet = np.array(self.dataSet)
        print(self.dataSet.shape)
        print(self.dataSet.T.shape)
        return self.dataList, self.dataSet


    def generateFinalData(self, n_positive = 50, negative_ratio = 1.0,):
        if n_positive > len(self.dataSet):
            n_positive = len(self.dataSet)

        final_size = n_positive * (1 + negative_ratio)

        print("Final Size: ",final_size, "Available size: ", len(self.dataSet))

        np.random.shuffle(self.dataSet)

        finalSetX = []
        finalSetY = []

        for i in range(n_positive):
            finalSetX.append(self.dataSet[random.randrange(len(self.dataSet))].tolist())
            finalSetY.append([1 for i in range(5)])
        


        idx = 0
        while idx < int(n_positive*negative_ratio):
            item, trueItem = self.getIncorrectDataItem()
            
            finalSetX.append(item)
            finalSetY.append(trueItem)

            idx +=1



        self.finalSet = list(zip(finalSetX, finalSetY))
        np.random.shuffle(self.finalSet)
        self.finalSetX = [i[0] for i in self.finalSet]
        self.finalSetY = [i[1] for i in self.finalSet]
        

        return self.finalSet, self.finalSetX, self.finalSetY
        
    def generateTrainTestData(self, test_size=0.2):
        self.finalSetTrain, self.finalSetTest = train_test_split(self.finalSet, test_size=test_size, random_state=1)

        print("Train Size:", len(self.finalSetTrain))
        print("Test Size:", len(self.finalSetTest))

        self.finalSetXTrain = np.array([i[0] for i in self.finalSetTrain])
        self.finalSetYTrain = np.array([i[1] for i in self.finalSetTrain])

        self.finalSetXTest = np.array([i[0] for i in self.finalSetTest])
        self.finalSetYTest = np.array([i[1] for i in self.finalSetTest])

        self.finalSetTrain = np.array(self.finalSetTrain)
        self.finalSetTest = np.array(self.finalSetTest)

        return self.finalSetTrain, self.finalSetTest

    def getIncorrectDataItem(self):
        item = self.dataSet[random.randrange(len(self.dataSet))].tolist()
        randitem = self.getRandomDataItem().tolist()
        trueArr = [1 for i in range(len(item))]
    
        num = random.randrange(1,len(item))

        while item[num] == randitem[num]:
            randitem = self.getRandomDataItem().tolist()
        
        item[num] = randitem[num]
        trueArr[num] = -1

        return item, trueArr




    def getRandomDataItem(self):
        try:
            name = random.randrange(len(self.index_data))
            cast = random.randrange(len(self.index_cast))
            director = random.randrange(len(self.index_directors))
            keyword = random.randrange(len(self.index_keywords))
            genre = random.randrange(len(self.index_genres))

            return np.array([name, cast, director, keyword, genre])
        except:
            name = random.randrange(len(self.index_data))
            cast = random.randrange(len(self.index_cast))
            director = random.randrange(len(self.index_directors))
            keyword = random.randrange(len(self.index_keywords))
            genre = random.randrange(len(self.index_genres))

            # name = self.data_index[self.index_data[random.randrange(len(self.index_data))]]
            # cast = self.cast_index[self.index_cast[random.randrange(len(self.index_cast))]]
            # director = self.directors_index[self.index_directors[random.randrange(len(self.index_directors))]]
            # keyword = self.keywords_index[self.index_keywords[random.randrange(len(self.index_keywords))]]
            # genre = self.genres_index[self.index_genres[random.randrange(len(self.index_genres))]]

            return np.array([name, cast, director, keyword, genre])


# data = SmartAssistData()  

# data.loadData()

# item = data.getRandomDataItem()

# print(item[0], len(data.index_data))

# itemsList = [[i[1]==item[1], i[2]==item[2], i[3]==item[3], i[4]==item[4]]  for i in data.dataSet.tolist() if i[0] == item[0]]
# print(itemsList)

# itembool = [k for k in itemsList if k.count(True) == max([j.count(True) for j in itemsList])]
# print(itembool[0])
# item = np.array(itembool[0])*1

# data.generateFinalData(n_positive=150)

# data.generateTrainTestData()






