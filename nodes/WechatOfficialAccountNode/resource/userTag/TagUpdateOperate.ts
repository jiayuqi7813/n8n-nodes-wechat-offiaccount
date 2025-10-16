import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagUpdateOperate  : ResourceOperations = {
	name: '编辑标签',
	value: 'tag:update',
	description: '编辑一个标签',
	options: [
		{
			displayName: '标签ID',
			name: 'id',
			type: 'number',
			required: true,
			default: null,
		},
		{
			displayName: '标签名',
			name: 'name',
			type: 'string',
			required: true,
			default: '',
			description: '标签名（30个字符以内）',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const id = this.getNodeParameter('id', index) as number;
		const name = this.getNodeParameter('name', index) as string;

		const body: IDataObject = {
			tag: { id, name },
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/update`,
			body,
		}, index);
	}
};

export default TagUpdateOperate;
