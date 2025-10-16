import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagCreateOperate: ResourceOperations = {
	name: '创建标签',
	value: 'tag:create',
	description: '创建一个新的标签',
	options: [
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
		const name = this.getNodeParameter('name', index) as string;

		const body: IDataObject = {
			tag: { name },
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/tags/create`,
			body,
		}, index);
	}
};

export default TagCreateOperate;
