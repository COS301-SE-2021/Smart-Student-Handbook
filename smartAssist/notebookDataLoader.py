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

class SmartAssistData:
    def __init__(self) -> None:
        pass

    def loadData(self, count=5000):
        dataRaw = pd.read_csv("smartAssist/NotebookDataset/Notebooks.csv", low_memory=True)

        print("Column Names:",list(dataRaw.columns))


        # metadata[['title', 'cast', 'director', 'keywords', 'institutions', 'soup']].rename(columns=)
        dataRaw['noteId'] = dataRaw['noteId'].apply(eval)
        dataRaw['name'] = dataRaw['name'].apply(eval)
        dataRaw['tags'] = dataRaw['tags'].apply(eval)
        dataRaw['author'] = dataRaw['author'].apply(eval)
        dataRaw['institution'] = dataRaw['institution'].apply(eval)
        dataRaw['course'] = dataRaw['course'].apply(eval)
        
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

        self.dataList = dataRaw[['noteId','name','tags','author','institution','course']][:count].to_numpy()

        self.data_index = {data[0]: idx for idx, data in enumerate(self.dataList)}
        self.index_data = {idx: data for data, idx in self.data_index.items()}

        unique_name = {data[1]: idx for idx, data in self.dataList}
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

        unique_institutions = {data[4]: idx for idx, data in self.dataList}
        institutions_counts = count_items(unique_institutions)
        self.institutions = [t[0] for t in institutions_counts.items()]
        self.institutions_index = {institution: idx for idx, institution in enumerate(self.institutions)}
        self.index_institutions = {idx: institution for institution, idx in self.institutions_index.items()}

        unique_course = {data[5]: idx for idx, data in self.dataList}
        course_counts = count_items(unique_course)
        self.course = [t[0] for t in course_counts.items()]
        self.course_index = {course: idx for idx, course in enumerate(self.course)}
        self.index_course = {idx: course for course, idx in self.course_index.items()}


        print(len(self.dataList), len(self.names), len(self.authors), len(self.tags), len(self.institutions), len(self.course_index))
        print(len(self.data_index), len(self.name_index), len(self.authors_index), len(self.tags_index), len(self.institutions_index), len(self.course_index))



        self.dataSet = []

        for data in self.dataList:
            for t in data[2]:
                self.dataSet.append(np.array([self.data_index[data[0]], self.name_index[data[1]], self.tags_index[t], self.authors_index[data[3]], self.institutions_index[data[4]], self.course_index[data[5]]]))


        self.dataSet = np.array(self.dataSet)
        print(self.dataSet.shape)
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
        trueArr = [1 for i in range(len(item))]
    
        num = random.randrange(1,len(item))

        while item[num] == randitem[num]:
            randitem = self.getRandomDataItem().tolist()
        
        item[num] = randitem[num]
        trueArr[num] = -1

        return item, trueArr

    def getRandomDataItem(self):
        try:
            data = random.randrange(len(self.index_data))
            name = random.randrange(len(self.index_name))
            tags = random.randrange(len(self.tags))
            author = random.randrange(len(self.index_authors))
            institution = random.randrange(len(self.index_institutions))
            course =  random.randrange(len(self.course))

            return np.array([name, cast, director, keyword, institution])
        except:
            name = random.randrange(len(self.index_data))
            cast = random.randrange(len(self.index_cast))
            director = random.randrange(len(self.index_authors))
            keyword = random.randrange(len(self.index_keywords))
            institution = random.randrange(len(self.index_institutions))

            # name = self.data_index[self.index_data[random.randrange(len(self.index_data))]]
            # cast = self.cast_index[self.index_cast[random.randrange(len(self.index_cast))]]
            # director = self.authors_index[self.index_authors[random.randrange(len(self.index_authors))]]
            # keyword = self.keywords_index[self.index_keywords[random.randrange(len(self.index_keywords))]]
            # institution = self.institutions_index[self.index_institutions[random.randrange(len(self.index_institutions))]]

            return np.array([name, cast, director, keyword, institution])


    def addData(self, dataFrame):
        dataRaw = pd.read_csv("smartAssist/NotebookDataset/Notebooks.csv", low_memory=True)
        dataRaw.append(dataFrame)
        dataRaw.to_csv("smartAssist/NotebookDataset/Notebooks.csv", index=False)




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

# noteb = pd.DataFrame({"noteId":[], "name":[], "tags":[], "author":[], "institution":[], "course":[]})
# noteb.to_csv("smartAssist/NotebookDataset/Notebooks.csv", index=False)





