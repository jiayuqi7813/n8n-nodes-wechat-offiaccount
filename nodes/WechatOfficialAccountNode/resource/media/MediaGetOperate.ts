import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaGetOperate: ResourceOperations = {
	name: '获取临时素材',
	value: 'media:get',
	options: [
		{
			displayName: '媒体文件ID',
			name: 'media_id',
			type: 'string',
			required: true,
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number, proxy?: string): Promise<IDataObject> {
		const mediaId = this.getNodeParameter('media_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/media/get`,
			qs: {
				media_id: mediaId,
			},
		}, index);
	},
};

export default MediaGetOperate;