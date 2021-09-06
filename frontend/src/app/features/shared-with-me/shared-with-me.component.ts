import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from '@angular/material/tree';
import {
	AccountService,
	NotebookObservablesService,
	NotebookOperationsService,
	NotebookService,
} from '@app/services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ExploreObservablesService } from '@app/services/notebook/observables/explore-observables.service';

@Component({
	selector: 'app-shared-with-me',
	templateUrl: './shared-with-me.component.html',
	styleUrls: ['./shared-with-me.component.scss'],
})
export class SharedWithMeComponent implements OnInit, AfterContentInit {
	user: any;

	childrenSize = 0;

	notebooks: any[] = [];

	openedNotebookId: string = '';

	/**
	 * If a tree node has children, transform the node to a parent node
	 * @param node the node to be transformed
	 * @param level the level of the node
	 * @returns a node transformed into a parent node that can have children
	 */
	private transformer = (node: DirectoryNode, level: number) => ({
		expandable: !!node.children && node.children.length > 0,
		name: node.name,
		id: node.id,
		level,
	});

	// Variables needed for the tree view
	treeControl = new FlatTreeControl<ExampleFlatNode>(
		(node) => node.level,
		(node) => node.expandable
	);

	treeFlattener = new MatTreeFlattener(
		this.transformer,
		(node) => node.level,
		(node) => node.expandable,
		(node) => node.children
	);

	dataSource = new MatTreeFlatDataSource(
		this.treeControl,
		this.treeFlattener
	);

	hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

	constructor(
		private notebookService: NotebookService,
		private router: Router,
		private dialog: MatDialog,
		private notebookOperations: NotebookOperationsService,
		private exploreObservablesOperations: ExploreObservablesService,
		private notebookObservables: NotebookObservablesService,
		private accountService: AccountService
	) {}

	ngOnInit(): void {
		// Get the user and user profile info from Behavioral subject
		this.accountService.getUserSubject.subscribe((user) => {
			if (user) {
				this.user = user;
			}
		});

		this.getUserNotebooks();

		this.childrenSize = 0;

		this.dataSource.data = [
			{
				name: 'Shared With Me',
				id: '',
				children: [
					{
						name: '',
						id: '',
					},
				],
			},
		];
	}

	/**
	 * Get the logged in user's notebooks to add to the tree view
	 */
	getUserNotebooks() {
		if (this.user)
			this.notebookService.getUserNotebooks(this.user.uid).subscribe(
				(notebooks: any[]) => {
					// console.log(notebooks);
					let temp: any[] = [];
					let index = 0;
					const tree: { name: any; id: any }[] = [];

					notebooks.forEach((notebook: any) => {
						temp = notebook.access;

						index = temp.findIndex(
							(a: any) => a.userId === this.user.uid
						);

						if (index >= 0) {
							this.notebooks.push(notebook);

							this.childrenSize += 1;

							const child = {
								name: notebook.title,
								id: notebook.notebookId,
								// children: childArr,
							};

							tree.push(child);
						}

						index = 0;
					});

					if (this.childrenSize > 0) {
						this.dataSource.data = [
							{
								name: 'Shared With Me',
								id: '',
								children: tree,
							},
						];
					}
				},
				(error) => {
					// eslint-disable-next-line no-console
					console.log(error.message);
				}
			);
	}

	updateNotebook(notebookId: string) {
		const notebook = this.notebooks.filter(
			(noteb) => noteb.notebookId === notebookId
		);

		this.notebookOperations
			.updateNotebook({
				title: notebook[0].title,
				author: notebook[0].author,
				course: notebook[0].course,
				description: notebook[0].description,
				institution: notebook[0].institution,
				creatorId: notebook[0].creatorId,
				private: notebook[0].private,
				tags: notebook[0].tags,
				notebookId: notebook[0].notebookId,
			})
			.subscribe((val) => {
				this.notebooks = this.notebooks.map((nb: any) => {
					if (nb.notebookId === notebookId) {
						nb.title = val.title;
						nb.course = val.course;
						nb.description = val.description;
						nb.private = val.private;
					}
					return nb;
				});

				let tree = this.dataSource.data[0].children;
				if (tree)
					tree = tree.map((node) => {
						if (node.id === notebookId) {
							node.name = val.title;
						}
						return node;
					});

				this.dataSource.data = [
					{
						name: 'Shared With Me',
						id: '',
						children: tree,
					},
				];
				this.treeControl.expandAll();
				this.notebookObservables.setNotebookPrivacy(val.private);
			});
	}

	/**
	 * Navigate to the Notes component when using a mobile device and
	 * toggle the notesPanel component when using a desktop
	 */
	openNotebookFolder(notebookId: string, notebookTitle: string) {
		this.router.navigate(['notebook']).then(() => {
			this.openedNotebookId = notebookId;

			if (window.innerWidth <= 960) {
				localStorage.setItem('notebookId', notebookId);

				this.router.navigate(['notes']).then(() => {
					this.exploreObservablesOperations.setOpenExploreNotebook(
						notebookId,
						notebookTitle,
						false
					);
				});
			} else {
				this.notebookObservables.setOpenNotebook(
					notebookId,
					notebookTitle,
					false
				);
			}
		});
	}

	ngAfterContentInit(): void {
		this.notebookObservables.sharedNotebook.subscribe((val: any) => {
			if (val.id !== '') {
				this.openedNotebookId = val.id;

				const child = {
					name: val.name,
					id: val.id,
					// children: childArr,
				};

				this.childrenSize += 1;

				let tree: any;
				if (this.dataSource.data[0].children)
					tree = this.dataSource.data[0].children;

				if (this.childrenSize === 1) {
					this.dataSource.data = [
						{
							name: 'Shared With Me',
							id: '',
							children: [child],
						},
					];
				} else {
					tree.push(child);

					this.dataSource.data = [
						{
							name: 'Shared With Me',
							id: '',
							children: tree,
						},
					];
				}

				this.treeControl.expandAll();

				// this.openNotebookFolder(val.id, val.name);
			}
		});
	}
}

/**
 * Tree structure
 */
interface DirectoryNode {
	name: string;
	id: string;
	children?: DirectoryNode[];
}

/** Flat node with expandable and level information */
interface ExampleFlatNode {
	expandable: boolean;
	name: string;
	id: string;
	level: number;
}
