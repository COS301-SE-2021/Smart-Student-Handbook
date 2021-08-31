from typing import cast
import pandas as pd
import numpy as np
from itertools import chain
from collections import Counter, OrderedDict
import random
from sklearn.model_selection import train_test_split
from keras.preprocessing.text import one_hot
from keras.preprocessing.sequence import pad_sequences

import warnings
warnings.filterwarnings("ignore", category=np.VisibleDeprecationWarning) 

import os



def count_items(l):
    counts = Counter(l)
    counts = sorted(counts.items(), key = lambda x: x[1], reverse = True)
    counts = OrderedDict(counts)
    
    return counts

class SmartAssistData:
    def __init__(self) -> None:
        pass

    def loadData(self, count=5000):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        dataRaw = pd.read_csv(filename, low_memory=True)

        if dataRaw.shape[0] == 0:
            print("no items")
            return

        print("Column Names:",list(dataRaw.columns))

        dataRaw['tags'] = dataRaw['tags'].apply(eval)

        dataRaw["soup"] = ""

        self.dataList = dataRaw[['noteId', 'name', 'tags', 'author', 'institution', 'course', 'soup']][:count].to_numpy()

        vocab = np.array([])
        self.maxLen = -1

        for data in self.dataList:
            soupArr = [data[1], data[3], data[4], data[5].replace(" ", "")]
            for i in data[2]:
                soupArr.append(i)

            sep = " "
            soup = sep.join(soupArr)
            data[6] = soup

            if len(soup.split()) > self.maxLen:
                self.maxLen = len(soup.split())
            
            vocab = np.unique(np.append(vocab, np.array(soup.split())))

        self.data_index = {data[0]: idx for idx, data in enumerate(self.dataList)}
        self.index_data = {idx: data for data, idx in self.data_index.items()}

        unique_name = {data[1]: idx for idx, data in enumerate(self.dataList)}
        name_counts = count_items(unique_name)
        self.names = [t[0] for t in name_counts.items()]
        self.name_index = {name: idx for idx, name in enumerate(self.names)}
        self.index_name = {idx: name for name, idx in self.name_index.items()}
        
        unique_tags = list(chain(*[list(set(data[2])) for data in self.dataList]))
        tags_counts = count_items(unique_tags)
        self.tags= [t[0] for t in tags_counts.items()]
        self.tags_index = {tags: idx for idx, tags in enumerate(self.tags)}
        self.index_tags = {idx: tags for tags, idx in self.tags_index.items()}

        unique_authors = {data[3]: idx for idx, data in enumerate(self.dataList)}
        author_counts = count_items(unique_authors)
        self.authors = [t[0] for t in author_counts.items()]
        self.authors_index = {authors: idx for idx, authors in enumerate(self.authors)}
        self.index_authors = {idx: authors for authors, idx in self.authors_index.items()}

        unique_institutions = {data[4]: idx for idx, data in enumerate(self.dataList)}
        institutions_counts = count_items(unique_institutions)
        self.institutions = [t[0] for t in institutions_counts.items()]
        self.institutions_index = {institution: idx for idx, institution in enumerate(self.institutions)}
        self.index_institutions = {idx: institution for institution, idx in self.institutions_index.items()}

        unique_course = {data[5]: idx for idx, data in enumerate(self.dataList)}
        course_counts = count_items(unique_course)
        self.course = [t[0] for t in course_counts.items()]
        self.course_index = {course: idx for idx, course in enumerate(self.course)}
        self.index_course = {idx: course for course, idx in self.course_index.items()}

        unique_soup = {data[6]: idx for idx, data in enumerate(self.dataList)}
        soup_counts = count_items(unique_soup)
        self.soup = [t[0] for t in soup_counts.items()]
        self.soup_index = {soup: idx for idx, soup in enumerate(self.soup)}
        self.index_soup = {idx: soup for soup, idx in self.soup_index.items()}

        self.soup_data =  {data[6]: data[0] for idx, data in enumerate(self.dataList)}
        self.data_soup =  {data[0]: data[6] for idx, data in enumerate(self.dataList)}
             
            
        self.vocabSize = len(vocab)+5

        
        print(len(self.dataList), len(self.names), len(self.authors), len(self.tags), len(self.institutions), len(self.course), len(self.soup))
        print(len(self.data_index), len(self.name_index), len(self.authors_index), len(self.tags_index), len(self.institutions_index), len(self.course_index), len(self.soup_index), len(self.data_soup))

        
        soupTemp = np.array(self.dataList).T[6]
        soupOH = []

        for i,data in enumerate(self.dataList):
            soupOH.append(one_hot(data[6], self.vocabSize))

        soupPadded = pad_sequences(soupOH, padding='post',value=0.0)
        soupPadded = pad_sequences(soupPadded, maxlen=soupPadded.shape[1]+5, padding='post',value=0.0, dtype='float32')
        self.maxLen = soupPadded.shape[1]

        self.dataSet = []
        for i,data in enumerate(self.dataList):

            for j in data[2]:
                self.dataSet.append(np.array([self.data_index[data[0]], self.name_index[data[1]], self.tags_index[j], self.authors_index[data[3]], self.institutions_index[data[4]], self.course_index[data[5]], np.array(soupPadded[i])]))


        self.dataSet_index = {data[0]: idx for idx, data in enumerate(self.dataSet)}
        self.index_dataSet = {idx: data[0] for idx, data in enumerate(self.dataSet)}

        self.dataSet = np.array(self.dataSet)
        print("Dataset Shape:", self.dataSet.shape)
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
            finalSetY.append([1 for i in range(6)])
        


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
        trueArr = [1 for i in range(len(item)-1)]
    
        num = random.randrange(1,len(item)-1)

        while item[num] == randitem[num]:
            randitem = self.getRandomDataItem().tolist()
        
        item[num] = randitem[num]
        trueArr[num] = -1

        return item, trueArr


    def getRandomDataItem(self):
        
        data = random.randrange(len(self.index_data))
        name = random.randrange(len(self.index_name))
        tags = random.randrange(len(self.index_tags))
        author = random.randrange(len(self.index_authors))
        institution = random.randrange(len(self.index_institutions))
        course =  random.randrange(len(self.course))

        sep = " "
        soup = sep.join([self.index_name[name], self.index_tags[tags], self.index_authors[author], self.index_institutions[institution], self.index_course[course].replace(" ", "")])

        soupOH = [one_hot(soup, self.vocabSize)]
        soupPadded = pad_sequences(soupOH, maxlen=self.maxLen, padding='post',value=0.0, dtype='float32')
   
        return np.array([data, name, tags, author, institution, course, soupPadded[0]])


    def addData(self, dataFrame):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        dataRaw = pd.read_csv(filename, low_memory=True)
        dataRaw['tags'] = dataRaw['tags'].apply(eval)

        combined = pd.concat([dataRaw, pd.DataFrame.from_dict(dataFrame)])
        combined.to_csv(filename, index=False)


    def removeData(self, dataFrame):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        dataRaw = pd.read_csv(filename, low_memory=True)
        dataRaw['tags'] = dataRaw['tags'].apply(eval)

        indices = dataRaw[dataRaw["noteId"] == dataFrame["noteId"]].index
        
        dataRaw.drop(index=indices,inplace=True)
        dataRaw.to_csv(filename, index=False)

    def editData(self, dataFrame):
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        dataRaw = pd.read_csv(filename, low_memory=True)
        dataRaw['tags'] = dataRaw['tags'].apply(eval)

        indices = dataRaw[dataRaw["noteId"] == dataFrame["noteId"]].index
        
        dataRaw.drop(index=indices,inplace=True)

        combined = pd.concat([dataRaw, pd.DataFrame.from_dict(dataFrame)])
        combined.to_csv(filename, index=False)
        

    def createSoup(self, name, tags, author, institution, course):
        soupArr = [name, author, institution, course.replace(" ", "")]
        for t in tags:
            soupArr.append(t)

        sep = " "
        soup = sep.join(soupArr)

        soupOH = [one_hot(soup, self.vocabSize)]
        soupPadded = pad_sequences(soupOH, maxlen=self.maxLen, padding='post',value=0.0, dtype='float32')

        data = len(self.index_data)

        try:
            nameN = self.name_index[name]
        except:
            nameN = len(self.index_name)

        try:
            tagsN = self.name_index[tags[0]]
        except:
            tagsN = len(self.index_tags)

        try:
            authorsN = self.authors_index[author]
        except:
            authorsN = len(self.index_authors)

        try:
            institutionN = self.institutions_index[institution]
        except:
            institutionN = len(self.index_institutions)

        try:
            courseN = self.course_index[course]
        except:
            courseN = len(self.index_course)
   
        return np.array([data, nameN, tagsN, authorsN, institutionN, courseN, np.array(soupPadded)])




# data = SmartAssistData()  

# data.loadData()



# item = data.getRandomDataItem()

# print(item, len(data.index_data))


# data.generateFinalData(n_positive=150)

# data.generateTrainTestData()





