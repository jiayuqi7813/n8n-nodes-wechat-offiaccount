import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const PublishStatusOperate: ResourceOperations = {
	name: '发布状态轮询',
	value: 'publish:status',
	options: [
		{
			displayName: '发布任务ID',
			name: 'publish_id',
			type: 'string',
			required: true,
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const publishId = this.getNodeParameter('publish_id', index) as string;

		const body: IDataObject = {
			publish_id: publishId,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/freepublish/get`,
			body,
		}, index);
	},
};

export default PublishStatusOperate;