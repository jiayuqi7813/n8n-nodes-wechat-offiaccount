import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const TemplateListOperate: ResourceOperations = {
	name: '获取模板列表',
	value: 'template:list',
	description: '获取已添加至账号下所有模板列表',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/template/get_all_private_template`,
		}, index);
	},
};

export default TemplateListOperate;