import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CommentReplyAddOperate: ResourceOperations = {
	name: '回复评论',
	value: 'comment:reply:add',
	description: '回复指定评论',
	options: [
		{
			displayName: '消息数据ID',
			name: 'msg_data_id',
			type: 'number',
			required: true,
			default: 0,
			description: '群发返回的 msg_data_id',
		},
		{
			displayName: '图文索引',
			name: 'index',
			type: 'number',
			default: 0,
			description:
				'多图文时，用来指定第几篇图文，从0开始，不带默认操作该 msg_data_id 的第一篇图文',
		},
		{
			displayName: '用户评论ID',
			name: 'user_comment_id',
			type: 'string',
			required: true,
			default: '',
		},
		{
			displayName: '回复内容',
			name: 'content',
			type: 'string',
			required: true,
			default: '',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const msgDataId = this.getNodeParameter('msg_data_id', index) as number;
		const articleIndex = this.getNodeParameter('index', index) as number;
		const userCommentId = this.getNodeParameter('user_comment_id', index) as string;
		const content = this.getNodeParameter('content', index) as string;

		const body: IDataObject = {
			msg_data_id: msgDataId,
			index: articleIndex,
			user_comment_id: userCommentId,
			content,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/comment/reply/add`,
			body,
		}, index);
	},
};

export default CommentReplyAddOperate;