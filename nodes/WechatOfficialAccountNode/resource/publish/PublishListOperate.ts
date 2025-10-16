import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const PublishListOperate: ResourceOperations = {
	name: '获取成功发布列表',
	value: 'publish:list',
	description: '获取已成功发布的消息列表',
	options: [
		{
			displayName: '偏移位置',
			name: 'offset',
			type: 'number',
			required: true,
			default: 0,
			description: '从全部素材的该偏移位置开始返回，0表示从第一个素材返回',
		},
		{
			displayName: '返回数量',
			name: 'count',
			type: 'number',
			required: true,
			default: 1,
			description: '返回素材的数量，取值在1到20之间',
		},
		{
			displayName: '是否返回内容',
			name: 'no_content',
			type: 'boolean',
			default: false,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const offset = this.getNodeParameter('offset', index) as number;
		const count = this.getNodeParameter('count', index) as number;
		const no_content = this.getNodeParameter('no_content', index) as boolean;

		const body: IDataObject = {
			offset,
			count,
			no_content: no_content ? 1 : 0,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/freepublish/batchget`,
			body,
		}, index);
	},
};

export default PublishListOperate;