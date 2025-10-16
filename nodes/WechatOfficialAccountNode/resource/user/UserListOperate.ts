import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const UserListOperate  : ResourceOperations = {
	name: '获取用户列表',
	value: 'user:getList',
	description: '获取账号的关注者列表',
	options: [
		{
			displayName: '下一批OpenID',
			name: 'next_openid',
			type: 'string',
			default: '',
			description: '上一批列表的最后一个OPENID，不填默认从头开始拉取',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const next_openid = this.getNodeParameter('next_openid', index) as string;

		const data: any = {};
		if (next_openid) {
			data.next_openid = next_openid;
		}

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/user/get`,
			qs: data,
		}, index);
	}
};

export default UserListOperate;
