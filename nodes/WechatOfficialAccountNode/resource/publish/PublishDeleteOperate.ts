import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const PublishDeleteOperate: ResourceOperations = {
	name: '删除发布',
	value: 'publish:delete',
	description: '删除已发布的文章',
	options: [
		{
			displayName: '文章ID',
			name: 'article_id',
			type: 'string',
			required: true,
			default: '',
			description: '成功发布时返回的 article_id',
		},
		{
			displayName: '文章位置',
			name: 'index',
			type: 'number',
			default: 0,
			description: '要删除的文章在图文消息中的位置，第一篇编号为1，该字段不填或填0会删除全部文章',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const articleId = this.getNodeParameter('article_id', index) as string;
		const articleIndex = this.getNodeParameter('index', index) as number;

		const body: IDataObject = {
			article_id: articleId,
			index: articleIndex,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/freepublish/delete`,
			body,
		}, index);
	},
};

export default PublishDeleteOperate;