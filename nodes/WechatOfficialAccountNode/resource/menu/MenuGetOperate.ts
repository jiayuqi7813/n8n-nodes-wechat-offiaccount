import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MenuGetOperate: ResourceOperations = {
	name: '获取当前菜单配置',
	value: 'menu:getCurrent',
	description: '获取公众号当前使用的自定义菜单的配置',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/get_current_selfmenu_info`,
		}, index);
	},
};

export default MenuGetOperate;