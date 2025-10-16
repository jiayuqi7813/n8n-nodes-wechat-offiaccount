import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MenuQueryOperate: ResourceOperations = {
	name: '查询',
	value: 'menu:query',
	description: '查询自定义菜单的结构',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/menu/get`,
		}, index);
	},
};

export default MenuQueryOperate;