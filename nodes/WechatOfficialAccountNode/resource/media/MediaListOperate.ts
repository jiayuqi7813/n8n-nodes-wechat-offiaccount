import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaListOperate: ResourceOperations = {
	name: '获取素材列表',
	value: 'media:batchGetMaterial',
	description: '获取永久素材的列表',
	options: [
		{
			displayName: '素材类型',
			name: 'type',
			type: 'options',
			options: [
				{ name: '图片', value: 'image' },
				{ name: '视频', value: 'video' },
				{ name: '语音', value: 'voice' },
				{ name: '图文', value: 'news' },
			],
			required: true,
			default: 'image',
			description: '素材的类型',
		},
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const type = this.getNodeParameter('type', index) as string;
		const offset = this.getNodeParameter('offset', index) as number;
		const count = this.getNodeParameter('count', index) as number;

		const body: IDataObject = {
			type,
			offset,
			count,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/material/batchget_material`,
			body,
		}, index);
	},
};

export default MediaListOperate;