import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

const DraftUpdateOperate: ResourceOperations = {
	name: '修改草稿',
	value: 'draft:update',
	options: [
		{
			displayName: '草稿ID',
			name: 'media_id',
			type: 'string',
			required: true,
			default: '',
			description: '要修改的草稿的media_id',
		},
		{
			displayName: '要更新的文章在图文消息中的位置',
			name: 'index',
			type: 'number',
			required: true,
			default: 0,
			description: '要更新的文章在图文消息中的位置（多图文消息时，此字段才有意义），第一篇为0',
		},
		{
			displayName: '草稿对象(Articles)内容',
			name: 'articles',
			type: 'json',
			required: true,
			default: '{}',
			description: '草稿的内容，参考文档：https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Update_draft.html',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const media_id = this.getNodeParameter('media_id', index) as string;
		const media_index = this.getNodeParameter('index', index) as string;
		const articles = NodeUtils.getNodeJsonData(this, 'articles', index) as object;

		const body: IDataObject = {
			media_id,
			index: media_index,
			articles,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/draft/update`,
			body,
		}, index);
	},
};

export default DraftUpdateOperate;
