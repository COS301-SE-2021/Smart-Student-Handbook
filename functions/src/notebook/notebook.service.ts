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

	/**
	 * Find all the notebooks of the currently logged in user
	 */
	async findAllUserNotebooks(): Promise<Notebook[]>
	{
		let userId: string = ""
		let notebooks = [];

		//Try to find logged in users id else throw and exception
		try {
			userId = firebase.auth().currentUser.uid;
		}
		catch(error)
		{
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}

		//Connect to firebase and retrieve all records with a matching uid
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

	/**
	 * Find notebook corresponding to the notebookId
	 * @param notebookId
	 */
	async findNotebookById(notebookId: string): Promise<Notebook>
	{
		//Connect to firebase and retrieve notebook with the provided notebookId
		const doc = await admin.firestore().collection("notebooks").doc(notebookId).get();

		//Return document if the document exists or else throw and exception
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

	/**
	 * Create or Update a notebook
	 * @param notebookDto
	 * @param notebookId
	 */
	async createOrUpdateNotebook(notebookDto: NotebookDto, notebookId: string): Promise<Response>
	{
		//Assume the user wants to update the notebook
		let userId: string = "";
		let operationType: string = "Update";

		//Try to find logged in users id else throw and exception
		try {
			userId= firebase.auth().currentUser.uid;
		}
		catch(error)
		{
			throw new HttpException('Unable to complete request. User might not be signed in.', HttpStatus.BAD_REQUEST);
		}

		console.log(notebookId);
		//If the notebookId is null, we know the user wants to create a new notebook
		if(!notebookId)
		{
			notebookId = randomStringGenerator();
			operationType= "Create";
		}
		console.log(notebookId);

		/**
		 * Try to createOrUpdate notebook on firebase. If try fails throw internal error exception.
		 * If successful return success message else throw not found exception.
		 */
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
				console.log(notebookId);
				return {
					message : operationType + " was successful!",
					notebookId: notebookId
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

	/**
	 * Delete notebook corresponding notebookId
	 * @param notebookId
	 */
	async deleteNotebook(notebookId: string): Promise<Response>
	{
		/**
		 * Connect to firebase and delete try to delete notebook. If successful return success message else
		 * throw bad request exception
		 */
		return admin.firestore().collection('notebooks').doc(notebookId).delete().then(() => {

			//Remove notebook from realtime database
			let notebookRef = firebase.database().ref('notebook/' + notebookId);
			notebookRef.remove();

			return {
				message: "Notebook successfully delete"
			};
		}).catch((error) => {
			throw new HttpException("Error removing document: "+error, HttpStatus.BAD_REQUEST);
		});
	}
}
