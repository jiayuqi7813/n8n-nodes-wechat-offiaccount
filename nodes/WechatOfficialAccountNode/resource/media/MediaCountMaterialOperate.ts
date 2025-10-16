import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaCountMaterialOperate: ResourceOperations = {
	name: '获取素材总数',
	value: 'media:countMaterial',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/material/get_materialcount`,
		}, index);
	},
};

export default MediaCountMaterialOperate;