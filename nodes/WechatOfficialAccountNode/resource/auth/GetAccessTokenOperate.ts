import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import RequestUtils from '../../../help/utils/RequestUtils';

export default {
	name: '获取AccessToken',
	value: 'auth:getAccessToken',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		// 调用一次验证/刷新 access_token
		await RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/get_api_domain_ip`,
		}, index);

		const credentials = await this.getCredentials('wechatOfficialAccountCredentialsApi');

		return {
			accessToken: credentials.accessToken,
		};
	},
} as ResourceOperations;
