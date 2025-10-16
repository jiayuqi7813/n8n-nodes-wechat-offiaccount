import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const TemplateDeleteOperate: ResourceOperations = {
	name: '删除模板',
	value: 'template:delete',
	description: '删除某账号下的模板',
	options: [
		{
			displayName: '模板ID',
			name: 'template_id',
			type: 'string',
			required: true,
			default: '',
			description: '公众账号下模板消息ID, 包括类目模板ID',
		},
	],
	async call(this: IExecuteFunctions, index: number, proxy?: string): Promise<IDataObject> {
		const templateId = this.getNodeParameter('template_id', index) as string;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/template/del_private_template`,
			body: {
				template_id: templateId,
			},
		}, index);
	},
};

export default TemplateDeleteOperate;