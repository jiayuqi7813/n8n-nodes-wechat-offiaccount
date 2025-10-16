import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const UserGetOperate  : ResourceOperations = {
	name: '获取用户信息',
	value: 'user:info',
	description: '获取用户基本信息',
	options: [
		{
			displayName: 'OpenID',
			name: 'openid',
			type: 'string',
			required: true,
			default: '',
			description: '普通用户的标识，对当前公众号唯一',
		},
		{
			displayName: '语言',
			name: 'lang',
			type: 'string',
			default: 'zh_CN',
			description: '返回国家地区语言版本，zh_CN 简体，zh_TW 繁体，en 英语',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const openid = this.getNodeParameter('openid', index) as string;
		const lang = this.getNodeParameter('lang', index) as string;

		const query: IDataObject = {
			openid,
			lang,
		};

		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/user/info`,
			qs: query,
		}, index);
	}
};

export default UserGetOperate;
