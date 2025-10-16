import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DraftDeleteOperate: ResourceOperations = {
	name: '删除草稿',
	value: 'draft:delete',
	options: [
		{
			displayName: '草稿ID',
			name: 'media_id',
			type: 'string',
			required: true,
			default: '',
			description: '要删除的草稿的media_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const mediaId = this.getNodeParameter('media_id', index) as string;

		const body: IDataObject = {
			media_id: mediaId,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/draft/delete`,
			body,
		}, index);
	},
};

export default DraftDeleteOperate;