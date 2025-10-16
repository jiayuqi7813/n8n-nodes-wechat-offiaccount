import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const ShortenGenOperate: ResourceOperations = {
	name: '生成短Key',
	value: 'other:shorten:gen',
	description: '将长信息转换为短key',
	options: [
		{
			displayName: '长信息',
			name: 'long_data',
			type: 'string',
			required: true,
			default: '',
			description: '需要转换的长信息，不超过4KB',
		},
		{
			displayName: '过期秒数',
			name: 'expire_seconds',
			type: 'number',
			default: 2592000,
			description: '过期秒数，最大值为2592000（即30天），默认为2592000',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const longData = this.getNodeParameter('long_data', index) as string;
		const expireSeconds = this.getNodeParameter('expire_seconds', index) as number;

		const body: IDataObject = {
			long_data: longData,
			expire_seconds: expireSeconds,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/shorten/gen`,
			body,
		}, index);
	},
};

export default ShortenGenOperate;
