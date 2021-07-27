import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NotebookService } from 'src/app/services/notebook.service';

@Component({
	selector: 'app-tree-view',
	templateUrl: './tree-view.component.html',
	styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
	user: any;

	profile: any;

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
		private router: Router
	) {}

	ngOnInit(): void {
		// Get the user and user profile info from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));
		this.profile = JSON.parse(<string>localStorage.getItem('userProfile'));

		this.getUserNotebooks();
	}

	/**
	 * Get the logged in user's notebooks to add to the treeview
	 */
	getUserNotebooks() {
		this.notebookService.getUserNotebooks(this.user.uid).subscribe(() => {
			const children = [{ name: 'Notebook one', id: '' }];
			// for (let i = 0; i < result.length; i++) {
			//   children.push({name: result[i].course, id: result[i].notebookReference});
			// }

			this.dataSource.data = [
				{
					name: 'My notebooks',
					id: '',
					children,
				},
			];

			// this.openTree();
		});
	}

	openNotebookFolder() {
		this.router.navigate(['notes']);
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
