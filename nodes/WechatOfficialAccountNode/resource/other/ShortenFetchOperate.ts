import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ShortenFetchOperate: ResourceOperations = {
	name: '获取长信息',
	value: 'other:shorten:fetch',
	description: '通过短key获取长信息',
	options: [
		{
			displayName: '短Key',
			name: 'short_key',
			type: 'string',
			required: true,
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const shortKey = this.getNodeParameter('short_key', index) as string;

		const body: IDataObject = {
			short_key: shortKey,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/shorten/fetch`,
			body,
		}, index);
	},
};

export default ShortenFetchOperate;