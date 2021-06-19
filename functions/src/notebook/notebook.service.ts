import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as admin from "firebase-admin";
import { Notebook } from './interfaces/notebook.interface';
import { NotebookDto } from "./dto/notebook.dto";
import { Response } from "./interfaces/response.interface";
import firebase from 'firebase';
require('firebase/auth');
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";


@Injectable()
export class NotebookService {

	async findAllUserNotebooks(): Promise<Notebook[]>
	{
		let userId: string = ""
		let notebooks = [];

		try {
			userId = firebase.auth().currentUser.uid;
		}
		catch(error)
		{
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}

		const notebookRef = admin.firestore().collection("notebooks").where("userId", "==", userId);
		const snapshot = await notebookRef.get();
		snapshot.forEach(doc => {
			let notebookTemp: Notebook =
			{
				title: doc.data()['title'],
				author: doc.data()["author"],
				course: doc.data()["course"],
				description: doc.data()["description"],
				institution: doc.data()["institution"],
				name: doc.data()["name"],
				surname: doc.data()["surname"],
				private: doc.data()["private"],
				username: doc.data()["username"],
				notebookReference: doc.data()["notebookReference"],
				userId: doc.data()["userId"],
			}
			notebooks.push(notebookTemp);
		});

		return notebooks;
	}

	async findNotebookById(notebookId: string): Promise<Notebook>
	{
		const notebookRef = admin.firestore().collection("notebooks").doc(notebookId);
		const doc = await notebookRef.get();

		if (doc.exists)
		{
			return {
				title: doc.data()['title'],
				author: doc.data()["author"],
				course: doc.data()["course"],
				description: doc.data()["description"],
				institution: doc.data()["institution"],
				name: doc.data()["name"],
				surname: doc.data()["surname"],
				private: doc.data()["private"],
				username: doc.data()["username"],
				notebookReference: doc.data()["notebookReference"],
				userId: doc.data()["userId"],
			}
		}
		else
		{
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}
	}

	async createOrUpdateNotebook(notebookDto: NotebookDto, notebookId: string): Promise<Response>
	{
		let userId: string = "";
		let operationType: string = "Update";

		try {
			userId= firebase.auth().currentUser.uid;
		}
		catch(error)
		{
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}

		if(!notebookId)
		{
			notebookId = randomStringGenerator();
			operationType= "Create";
		}

		try {
			return await admin.firestore().collection("notebooks").doc(notebookId).set(
				{
					title: notebookDto['title'],
					author: notebookDto["author"],
					course: notebookDto["course"],
					description: notebookDto["description"],
					institution: notebookDto["institution"],
					name: notebookDto["name"],
					surname: notebookDto["surname"],
					private: notebookDto["private"],
					username: notebookDto["username"],
					notebookReference: notebookId,
					userId: userId,
				}
			).then(() => {
				return {
					message : operationType + " was successful!"
				};
			}).catch(() => {
				throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
			});
		}
		catch (error)
		{
			throw new HttpException('Something went wrong. Operation could not be executed.', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteNotebook(notebookId: string): Promise<Response>
	{
		return admin.firestore().collection('notebooks').doc(notebookId).delete().then(() => {
			return {
				message: "Notebook successfully delete"
			};
		}).catch((error) => {
			throw new HttpException("Error removing document: "+error, HttpStatus.BAD_REQUEST);
		});
	}
}
