import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as admin from "firebase-admin";
import { Notebook } from './interfaces/notebook.interface';
import { NotebookDto } from "./dto/notebook.dto";
import firebase  from "firebase/app";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";


@Injectable()
export class NotebookService {
	//private readonly notebook: Notebook[] = [];

	async findAllUserNotebooks(userId: string): Promise<Notebook[]>
	{
		let notebooks = [];
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

		if(notebooks === []) {
			throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
		}

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

	async createOrUpdateNotebook(notebookDto: NotebookDto, notebookId: string, userId: string): Promise<string>
	{
		let operationType: string = "update";

		if(!notebookId)
		{
			notebookId = randomStringGenerator();
			operationType= "Create";
		}

		const notebook: Notebook = {
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

		const res = await admin.firestore().collection("notebooks").doc(notebookId).set(notebook);
        //Todo : Louw die gaan altyd sucsessfull wees want res gaan nooit nie bestaan nie ?
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
		admin.firestore().collection('notebooks').doc(notebookId).delete().then(() => {

		}).catch((error) => {
			throw new HttpException("Error removing document: "+error, HttpStatus.BAD_REQUEST);
		});

		return "Notebook successfully delete";
	}
}
