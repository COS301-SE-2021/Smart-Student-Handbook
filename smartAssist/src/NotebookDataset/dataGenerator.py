from notebookDataLoader import SmartAssistData
import pandas as pd
import requests
from faker import Faker
import random

faker = Faker()

instutions = ["University of Pretoria", "Stellenbosch University", "University of the Witwatersrand", "The University of South Africa", "North West University"]
department = ["Engineering", "IT", "Sciences", "Economics"]
program = {
    "Engineering":["BEng Mechanical", "BEng Civil", "BEng Computer", "BEng Electrical"], 
    "IT":["BSc Computer Science", "IKS", "BIT"], 
    "Sciences":["Applied Physics", "Applied Chemistry", "Plant and Soil Sciences", "Animal Sciences"], 
    "Economics":["BCom Informatics", "BCom Accounting", "BCom Marketing"]
    }

courses = [faker.bothify(text='??? ###', letters ="ABCDEFGHIJKLMNOPQRSTUVWXYZ") for i in range(15)]
keywords = [faker.bs() for i in range(25)]
userNames = [faker.user_name() for i in range(15)]

def createUsersLive():
    num = 1
    users = []

    for i in range(num):
        userData ={
            "email": faker.safe_email(),
            "username": faker.user_name(),
            "password": "TestPassword123*",
            "passwordConfirm": "TestPassword123*",
            "isLocalhost": True
        }
        
        users.append(userData)

        r = requests.post("http://localhost:5001/smartstudentnotebook/us-central1/app/account/registerUser", data=userData)

        print(r, userData)

        userLoginData ={
            "email": userData["email"],
            "password": "TestPassword123*",
        }

        l = requests.post("http://localhost:5001/smartstudentnotebook/us-central1/app/account/loginUser", data=userLoginData)
        print(l.text, l.json(), userLoginData)

        dep = random.choice(department)
        userUpdateData ={
            "email": userData["email"],
            "username": userData["username"],
            "password": "TestPassword123*",
            "passwordConfirm": "TestPassword123*",
            "isLocalhost": True,
            "displayName": userData["username"],
            "institution": random.choice(instutions),
            "department": dep,
            "program": random.choice(program[dep]),
            "workstatus": "Student",
            "bio": "Used for Testing"
            }

        u = requests.put("http://localhost:5001/smartstudentnotebook/us-central1/app/account/updateUser", data=userUpdateData)

        print(u, userUpdateData)
    

def createNotebookData(num):

    dataRaw = pd.read_csv("smartAssist/MovieDataset/MovieTrainingData.csv", low_memory=True)
    dataRaw = dataRaw.drop(columns=['index'])

    print("Column Names:",list(dataRaw.columns))


    # metadata[['title', 'cast', 'director', 'keywords', 'genres', 'soup']].rename(columns=)
    dataRaw['cast'] = dataRaw['cast'].apply(eval)
    dataRaw['keywords'] = dataRaw['keywords'].apply(eval)
    dataRaw['genres'] = dataRaw['genres'].apply(eval)
    dataRaw['soup'] = dataRaw['soup'].apply(eval)
        
    dataList = dataRaw[['title', 'keywords']][:5000].to_numpy()

    notes = []

    for i in range(num):
        dep = random.choice(department)
        d = random.choice(dataList)
        if len(d[1]) == 0:
            continue

        note = {
            "noteId": faker.uuid4(),
            "name": d[0],
            "tags": d[1],
            "author": random.choice(userNames),
            "institution": random.choice(instutions),
            "course": random.choice(courses)
        }
        notes.append(note)

    return notes

# createUsersLive()
nd = createNotebookData(3000)
[print(i) for i in nd]

data = SmartAssistData()  
data.addData(nd)

