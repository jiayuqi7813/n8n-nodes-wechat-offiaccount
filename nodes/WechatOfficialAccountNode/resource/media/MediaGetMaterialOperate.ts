import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaGetMaterialOperate: ResourceOperations = {
	name: '获取永久素材',
	value: 'media:getMaterial',
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
			method: 'POST',
			url: `/cgi-bin/material/get_material`,
			body: {
				media_id: mediaId,
			},
		}, index);
	},
};

export default MediaGetMaterialOperate;
