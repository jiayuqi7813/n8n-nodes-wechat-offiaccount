import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';
import NodeUtils from "../../../help/utils/NodeUtils";

const DraftAddOperate: ResourceOperations = {
	name: '新建草稿',
	value: 'draft:add',
	description: '新增草稿',
	options: [
		{
			displayName: '草稿文章对象内容(Articles)',
			name: 'articles',
			type: 'json',
			required: true,
			default: '[]',
			description: '参考文档：https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html',
		},
	],
	async call(this: IExecuteFunctions, index: number, proxy?: string): Promise<IDataObject> {
		const articles = NodeUtils.getNodeJsonData(this, 'articles', index) as object;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/draft/add`,
			body: {
				articles,
			},
		}, index);
	},
};

export default DraftAddOperate;
