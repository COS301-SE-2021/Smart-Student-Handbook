import { API, BlockTool, ToolSettings } from '@editorjs/editorjs';

type AddTagsToolData = {
	header?: string;
	tags?: string;
};

type AddTagsToolConstructorParams = {
	api: API;
	config?: ToolSettings;
	data?: any;
};

export class AddTagsTool implements BlockTool {
	wrapper: any;

	data: AddTagsToolData;

	tags: string[] = ['tag1', 'tag2'];

	static get toolbox() {
		return {
			title: 'Snippet',
			icon:
				'<svg width="25" height="20" viewBox="0 0 400 490" xmlns="http://www.w3.org/2000/svg">' +
				'<path d="M223.811,393.098c0-71.267,57.771-129.036,129.036-129.036V135.031c0,0-80.648-112.902-145.165-112.902' +
				'c-64.516,0-145.16,112.902-145.16,112.902v354.84H267.51C240.716,466.226,223.811,431.637,223.811,393.098z M159.295,135.031' +
				'c0-26.721,21.666-48.387,48.387-48.387c26.727,0,48.388,21.666,48.388,48.387c0,26.726-21.661,48.387-48.388,48.387' +
				'C180.961,183.417,159.295,161.756,159.295,135.031z"/>' +
				'<path d="M352.847,296.458c-53.372,0-96.64,43.26-96.64,96.641c0,53.362,43.268,96.632,96.64,96.632' +
				'c53.363,0,96.632-43.27,96.632-96.632C449.479,339.718,406.21,296.458,352.847,296.458z M412.99,418.785' +
				'c-11.199,0.23-22.409-0.05-33.609,0.1c-0.358,8.643-0.061,17.291-0.141,25.94c-0.079,4.2,0.261,8.48-0.84,12.59' +
				'c-2.069,8.32-8.689,15.37-16.899,17.86c-7.75,2.399-16.71,1.18-23.188-3.82c-6.46-4.698-10.382-12.59-10.271-20.56' +
				'c-0.07-10.681,0.062-21.37-0.051-32.052c-8.699,0.132-17.399-0.141-26.101,0.062c-4.131-0.07-8.341,0.2-12.381-0.84' +
				'c-8.55-2.15-15.76-9.09-18.1-17.62c-1.62-5.83-1.312-12.24,1.25-17.771c3.76-8.688,12.739-14.71,22.2-15.01' +
				'c11.01-0.1,22.028-0.03,33.049-0.04c0.332-11.289-0.068-22.589,0.192-33.889c0.54-12.7,12.021-23.69,24.75-23.65' +
				'c10.3-0.52,20.398,5.91,24.34,15.44c2.45,5.43,2.04,11.5,2.061,17.31c-0.12,8.25,0.08,16.5-0.05,24.75' +
				'c10.899,0.08,21.81-0.01,32.71,0.05c7.489,0.2,14.88,3.74,19.439,9.74c6.188,7.62,7.108,18.86,2.729,27.57' +
				'C430.121,412.825,421.841,418.384,412.99,418.785z"/>' +
				'</svg>',
		};
	}

	// @ts-ignore
	// constructor({ api, config, d }: AddTagsToolConstructorParams) {
	constructor(d: AddTagsToolConstructorParams) {
		this.data = d.data;
		this.wrapper = undefined;
	}

	// get input from user
	render() {
		this.wrapper = document.createElement('div');
		this.wrapper.classList.add('addTagsTool');

		console.log(this.data && this.data.header);
		if (this.data && this.data.header) {
			this.createSnippet(this.data.header, this.data.tags);
			return this.wrapper;
		}

		const input = document.createElement('input');

		input.placeholder = 'Enter your Snippet header here..';
		input.value = this.data && this.data.tags ? this.data.tags : '';
		this.wrapper.appendChild(input);

		// when url is pasted
		input.addEventListener('blur', () => {
			this.createSnippet(input.value);
		});

		this.wrapper.appendChild(input);

		return this.wrapper;
	}

	createSnippet(head: string, tags: string = '') {
		const header = document.createElement('h1');
		const tagList = document.createElement('input');

		header.innerHTML = head;
		header.style.color = 'royalblue';

		if (tags !== '') {
			tagList.value = tags;
		} else {
			tagList.placeholder = 'Tags...';
		}

		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(header);
		this.wrapper.appendChild(tagList);
	}

	// extract a Block data from UI
	save(blockContent: any) {
		const header = blockContent.querySelector('h1');
		const tagList = blockContent.querySelector('input');
		tagList.value = tagList.value.replace(',', ' ');

		return {
			header: header !== null ? header.innerHTML : '',
			tags: tagList.value,
		};
	}

	validate(savedData: any) {
		console.log(savedData.header.trim() !== '');
		return savedData.header.trim() !== '';
	}
}
