import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {
	MatTreeFlatDataSource,
	MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { NotebookService, OpenNotebookPanelService } from '@app/services';

@Component({
	selector: 'app-tree-view',
	templateUrl: './tree-view.component.html',
	styleUrls: ['./tree-view.component.scss'],
})
export class TreeViewComponent implements OnInit {
	user: any;

	childrenSize = 0;

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
		private openNotebookPanelService: OpenNotebookPanelService
	) {}

	ngOnInit(): void {
		// Get the user and user profile info from localstorage
		this.user = JSON.parse(<string>localStorage.getItem('user'));

		this.getUserNotebooks();

		this.childrenSize = 0;

    this.dataSource.data = [
      {
        name: 'My notebooks',
        id: '',
        children: [{
          'name': '',
          'id': ''
        }
        ],
      },
    ];
	}

	/**
	 * Get the logged in user's notebooks to add to the treeview
	 */
	getUserNotebooks() {
		this.notebookService.getUserNotebooks().subscribe(
			(notebooks) => {
				const tree = [];
				for (let i = 0; i < notebooks.length; i += 1) {

          this.childrenSize += 1;

					const child = {
						name: notebooks[i].title,
						id: notebooks[i].notebookId,
						// children: childArr,
					};

					tree.push(child);
				}

				if (this.childrenSize > 0){
          this.dataSource.data = [
            {
              name: 'My notebooks',
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

	/**
	 * Navigate to the Notes component when using a mobile device and
	 * toggle the notesPanel component when using a desktop
	 */
	openNotebookFolder(notebookId: string) {
		const screenType = navigator.userAgent;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
				screenType
			)
		) {
			localStorage.setItem('notebookId', notebookId);

			this.router.navigate(['notes']);
		} else {
			this.openNotebookPanelService.toggleNotePanel(notebookId);
		}
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
