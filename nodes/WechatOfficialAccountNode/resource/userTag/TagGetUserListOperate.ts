import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagGetUserListOperate  : ResourceOperations = {
	name: '获取标签下粉丝列表',
	value: 'tag:getUserList',
	description: '获取标签下的粉丝列表',
	options: [
		{
			displayName: '标签ID',
			name: 'tagid',
			type: 'number',
			required: true,
			default: null,
		},
		{
			displayName: '起始OpenID',
			name: 'next_openid',
			type: 'string',
			default: '',
			description: '第一个拉取的OpenID，不填默认从头开始拉取',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const tagid = this.getNodeParameter('tagid', index) as number;
		const nextOpenId = this.getNodeParameter('next_openid', index) as string;

		const body: IDataObject = {
			tagid,
			next_openid: nextOpenId,
		};

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/user/tag/get`,
			body,
		}, index);
	}
};

export default TagGetUserListOperate;
