import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagDeleteOperate  : ResourceOperations = {
	name: '删除标签',
	value: 'tag:delete',
	description: '删除一个标签',
	options: [
		{
			displayName: '标签ID',
			name: 'id',
			type: 'number',
			required: true,
			default: null,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const id = this.getNodeParameter('id', index) as number;

		const body: IDataObject = {
			tag: { id },
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/delete`,
			body,
		}, index);
	}
};

export default TagDeleteOperate;
