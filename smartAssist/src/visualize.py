from smartAssistModel import SmartAssistModel
from notebookDataLoader import SmartAssistData
from loadData import cloudStorage

import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE

data = SmartAssistData()
cloud = cloudStorage()

cloud.loadAllData()

data.loadData(count=10000)

data.generateFinalData(n_positive=5000)

smartmodel = SmartAssistModel(data=data)

smartmodel.loadSmartModel()


# [print(x) for x in smartmodel.weights]
print(smartmodel.weights.shape)

transf = TSNE(n_components=2, metric="cosine", square_distances=True).fit_transform(smartmodel.weights)
print(transf.shape)

for idx, c in enumerate(transf):
    print(data.dataList[data.index_dataSet[idx]][1], c)

print([data.index_dataSet[idx] for idx, c in enumerate(transf)])

plt.figure(figsize=(10,10))
plt.scatter(transf[:,0], transf[:,1], c=[data.index_dataSet[idx] for idx, c in enumerate(transf)])

# cbar = plt.colorbar()
# cbar.set_ticks([])
# for idx in [data.index_dataSet[idx] for idx, c in enumerate(transf)]:
#     cbar.ax.text(1, (2 * idx + 1) / ((2) * 2), data.dataList[idx][1], ha='left', va='center')
# cbar.ax.set_title('Genre', loc = 'left')

plt.xlabel('TSNE 1'); 
plt.ylabel('TSNE 2'); 
plt.title('Embeddings Visualized with TSNE');
plt.show()