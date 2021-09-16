import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
import os

dirname = os.path.dirname(__file__)
filename = os.path.join(dirname, "smartstudentnotebook-adminsdk.json")
cred = credentials.Certificate(filename)
firebase_admin.initialize_app(cred)



class cloudStorage:
    def __init__(self) -> None:
        self.bucket = storage.bucket("smartstudentnotebook.appspot.com")

    def loadAllData(self):
        dirname = os.path.dirname(__file__)
        filenameNotebooks = os.path.join(dirname, "NotebookDataset/Notebooks.csv")
        filenameModel = os.path.join(dirname, 'models/smartAssistModel.h5')
        filenamePredictModel = os.path.join(dirname, 'models/smartAssistPredictModel.h5')
        filenameEmbeddingWeights = os.path.join(dirname, "models/embeddingWeights.npy")

        blobNotebooks = self.bucket.blob("smartAssistData/NotebookData/Notebooks.csv")
        blobModel = self.bucket.blob("smartAssistData/models/smartAssistModel.h5")
        blobPredictModel = self.bucket.blob("smartAssistData/models/smartAssistPredictModel.h5")
        blobEmbeddingWeights = self.bucket.blob("smartAssistData/models/embeddingWeights.npy")

        blobNotebooks.download_to_filename(filenameNotebooks)
        blobModel.download_to_filename(filenameModel)
        blobPredictModel.download_to_filename(filenamePredictModel)
        blobEmbeddingWeights.download_to_filename(filenameEmbeddingWeights)

    def saveAllData(self):
        dirname = os.path.dirname(__file__)
        filenameNotebooks = os.path.join(dirname, "NotebookDataset/Notebooks.csv")
        filenameModel = os.path.join(dirname, 'models/smartAssistModel.h5')
        filenamePredictModel = os.path.join(dirname, 'models/smartAssistPredictModel.h5')
        filenameEmbeddingWeights = os.path.join(dirname, "models/embeddingWeights.npy")

        blobNotebooks = self.bucket.blob("smartAssistData/NotebookData/Notebooks.csv")
        blobModel = self.bucket.blob("smartAssistData/models/smartAssistModel.h5")
        blobPredictModel = self.bucket.blob("smartAssistData/models/smartAssistPredictModel.h5")
        blobEmbeddingWeights = self.bucket.blob("smartAssistData/models/embeddingWeights.npy")

        blobNotebooks.upload_from_filename(filenameNotebooks)
        blobModel.upload_from_filename(filenameModel)
        blobPredictModel.upload_from_filename(filenamePredictModel)
        blobEmbeddingWeights.upload_from_filename(filenameEmbeddingWeights)


    def loadNotebooksData(self):
        dirname = os.path.dirname(__file__)
        filenameNotebooks = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        blobNotebooks = self.bucket.blob("smartAssistData/NotebookData/Notebooks.csv")

        blobNotebooks.download_to_filename(filenameNotebooks)

    def saveNotebooksData(self):
        dirname = os.path.dirname(__file__)
        filenameNotebooks = os.path.join(dirname, "NotebookDataset/Notebooks.csv")

        blobNotebooks = self.bucket.blob("smartAssistData/NotebookData/Notebooks.csv")

        blobNotebooks.upload_from_filename(filenameNotebooks)

    def saveEmbeddingData(self):
        dirname = os.path.dirname(__file__)

        filenameEmbeddingWeights = os.path.join(dirname, "models/embeddingWeights.npy")

        blobEmbeddingWeights = self.bucket.blob("smartAssistData/models/embeddingWeights.npy")

        blobEmbeddingWeights.upload_from_filename(filenameEmbeddingWeights)

