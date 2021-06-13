import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as admin from "firebase-admin";
import { Notebook } from './interfaces/notebook.interface';
import { NotebookDto } from "./dto/notebook.dto";
import firebase  from "firebase/app";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";


@Injectable()
export class NotebookService {
	//private readonly notebook: Notebook[] = [];

	async findNotebooks(): Promise<Notebook[]>
	{
		let uid: string;
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				uid = user.uid;
			} else {
				throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
			}
		});

		let notebooks = [];
		const notebookRef = admin.firestore().collection("notebooks").where("userId", "==", uid);
		const snapshot = await notebookRef.get();
		snapshot.forEach(doc => {
			let notebookTemp: Notebook =
			{
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

		if(notebooks === []) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}

		return notebooks;
	}

	async findNotebook(notebookId: string): Promise<Notebook>
	{
		const notebookRef = admin.firestore().collection("notebooks").doc(notebookId);
		const doc = await notebookRef.get();

		if (doc.exists)
		{
			return {
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

	async createOrUpdateNotebook(notebookDto: NotebookDto, id: string): Promise<string>
	{
		let operationType: string = "Update";
		let userId: string;

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				userId = user.uid;
			} else {
				throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
			}
		});

		if(!id)
		{
			id = randomStringGenerator();
			operationType= "Create";
		}

		const notebook: Notebook = {
			author: notebookDto["author"],
			course: notebookDto["course"],
			description: notebookDto["description"],
			institution: notebookDto["institution"],
			name: notebookDto["name"],
			surname: notebookDto["surname"],
			private: notebookDto["private"],
			username: notebookDto["username"],
			notebookReference: id,
			userId: userId,
		}

		const res = await admin.firestore().collection("notebooks").doc(id).set(notebook);

		if (res)
		{
			return operationType + " was successful!";
		}
		else
		{
			throw new HttpException('Could not '+operationType, HttpStatus.BAD_REQUEST);
		}
	}

	async deleteNotebook(notebookId: string): Promise<string>
	{
		console.log("Error removing document: " + notebookId);
		admin.firestore().collection('notebooks').doc(notebookId).delete().then(() => {

		}).catch((error) => {
			console.error("Error removing document: ", error);
		});

		return "Notebook successfully delete";
	}
}
