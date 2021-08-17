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
        print(l, userLoginData)

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
    

# def createNotebookData(num):

#     notes = []

#     for i in range(num):
#         note = {
#             "noteId": 5305b950-5454-451a-afcc-1b2760be06f9
#         }