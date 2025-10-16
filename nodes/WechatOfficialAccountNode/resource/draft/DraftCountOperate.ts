import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const DraftCountOperate: ResourceOperations = {
	name: '获取草稿总数',
	value: 'draft:count',
	description: '获取草稿的总数',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/draft/count`,
		}, index);
	},
};

export default DraftCountOperate;