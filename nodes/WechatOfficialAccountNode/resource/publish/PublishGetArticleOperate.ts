import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const PublishGetArticleOperate: ResourceOperations = {
	name: '获取已发布文章',
	value: 'publish:getArticle',
	description: '通过 article_id 获取已发布的图文信息',
	options: [
		{
			displayName: '文章ID',
			name: 'article_id',
			type: 'string',
			required: true,
			default: '',
			description: '要获取的草稿的 article_id',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const articleId = this.getNodeParameter('article_id', index) as string;

		const body: IDataObject = {
			article_id: articleId,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/freepublish/getarticle`,
			body,
		}, index);
	},
};

export default PublishGetArticleOperate;