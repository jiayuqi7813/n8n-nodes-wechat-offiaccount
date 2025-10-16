import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CommentReplyDeleteOperate: ResourceOperations = {
	name: '删除回复',
	value: 'comment:reply:delete',
	options: [
		{
			displayName: '消息数据ID',
			name: 'msg_data_id',
			type: 'string',
			required: true,
			default: '',
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
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const msgDataId = this.getNodeParameter('msg_data_id', index) as number;
		const articleIndex = this.getNodeParameter('index', index) as number;
		const userCommentId = this.getNodeParameter('user_comment_id', index) as string;

		const body: IDataObject = {
			msg_data_id: msgDataId,
			index: articleIndex,
			user_comment_id: userCommentId,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/comment/reply/delete`,
			body,
		}, index);
	},
};

export default CommentReplyDeleteOperate;