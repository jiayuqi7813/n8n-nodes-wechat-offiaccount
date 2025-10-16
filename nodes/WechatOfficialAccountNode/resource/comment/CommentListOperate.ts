import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const CommentListOperate: ResourceOperations = {
	name: '查看评论',
	value: 'comment:list',
	description: '查看指定文章的评论数据',
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
			description: '多图文时，用来指定第几篇图文，从0开始，不带默认返回该 msg_data_id 的第一篇图文',
		},
		{
			displayName: '起始位置',
			name: 'begin',
			type: 'number',
			required: true,
			default: 0,
		},
		{
			displayName: '获取数目',
			name: 'count',
			type: 'number',
			required: true,
			default: 50,
			description: '获取数目（>=50会被拒绝）',
		},
		{
			displayName: '评论类型',
			name: 'type',
			type: 'options',
			required: true,
			default: 0,
			options: [
				{
					name: '普通评论&精选评论',
					value: 0,
				},
				{
					name: '普通评论',
					value: 1,
				},
				{
					name: '精选评论',
					value: 2,
				},
			],
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const msgDataId = this.getNodeParameter('msg_data_id', index) as number;
		const articleIndex = this.getNodeParameter('index', index) as number;
		const begin = this.getNodeParameter('begin', index) as number;
		const count = this.getNodeParameter('count', index) as number;
		const type = this.getNodeParameter('type', index) as number;

		const body: IDataObject = {
			msg_data_id: msgDataId,
			index: articleIndex,
			begin,
			count,
			type,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/comment/list`,
			body,
		}, index);
	},
};

export default CommentListOperate;
