import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MenuDeleteOperate: ResourceOperations = {
	name: '删除',
	value: 'menu:delete',
	description: '删除当前使用的自定义菜单',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/menu/delete`,
		}, index);
	},
};

export default MenuDeleteOperate;