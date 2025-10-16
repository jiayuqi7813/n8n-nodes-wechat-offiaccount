import {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';


export class WechatOfficialAccountCredentialsApi implements ICredentialType {
	name = 'wechatOfficialAccountCredentialsApi';
	displayName = 'Wechat Official Account Credentials API';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'api.weixin.qq.com',
			required: true,
		},
		{
			displayName: 'Appid',
			description: '第三方用户唯一凭证，AppID和AppSecret可在“微信公众平台-设置与开发--基本配置”页中获得',
			name: 'appid',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'AppSecret',
			name: 'appsecret',
			description: '第三方用户唯一凭证密钥',
			// eslint-disable-next-line
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'AccessToken',
			name: 'accessToken',
			type: 'hidden',
			default: '',
			// eslint-disable-next-line n8n-nodes-base/cred-class-field-type-options-password-missing
			typeOptions: {
				expirable: true,
			},
		},
		{
			displayName: 'Proxy',
			name: 'proxy',
			type: 'string',
			default: '',
			placeholder: 'http://username:password@proxy.example.com:8080',
			description: '代理服务器地址，格式：http://[username:password@]host:port（可选）',
		},
		{
			displayName: 'Timeout',
			name: 'timeout',
			type: 'number',
			default: 10,
			description: '请求超时时间（秒）',
		},
		{
			displayName: 'Allow Unauthorized Certs',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description: '是否忽略SSL证书验证错误',
		},
	];

	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		console.log('preAuthentication credentials', credentials);
		
		// 构建请求选项，支持代理配置
		const requestOptions: any = {
			method: 'GET',
			url: `https://${credentials.baseUrl}/cgi-bin/token?grant_type=client_credential&appid=${credentials.appid}&secret=${credentials.appsecret}`,
		};

		// 如果有代理配置，添加到请求选项中
		if (credentials.proxy) {
			requestOptions.proxy = credentials.proxy;
		}

		if (credentials.timeout) {
			requestOptions.timeout = Number(credentials.timeout) * 1000; // 转换为毫秒
		}

		if (credentials.allowUnauthorizedCerts) {
			requestOptions.rejectUnauthorized = false;
		}

		const res = (await this.helpers.httpRequest(requestOptions)) as any;

		console.log('preAuthentication', res);

		if (res.errcode && res.errcode !== 0) {
			throw new Error('授权失败：' + res.errcode + ', ' + res.errmsg);
		}

		return { accessToken: res.access_token };
	}


	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			qs: {
				access_token: '={{$credentials.accessToken}}',
			},
		},
	};

	// async authenticate(
	// 	credentials: ICredentialDataDecryptedObject,
	// 	requestOptions: IHttpRequestOptions,
	// ): Promise<IHttpRequestOptions> {
	// 	requestOptions.baseURL = `https://${credentials.baseUrl}`;
	// 	requestOptions.qs = {
	// 		...(requestOptions.qs || {}),
	// 		access_token: credentials.accessToken,
	// 	};
	// 	// requestOptions.proxy = {
	// 	// 	host: '127.0.0.1',
	// 	// 	port: 8000,
	// 	// 	protocol: 'http',
	// 	// };
	// 	// requestOptions.skipSslCertificateValidation = true;
	//
	// 	return requestOptions;
	// }

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.baseUrl}}',
			url: '/cgi-bin/get_api_domain_ip',
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					key: 'errcode',
					value: 0,
					message: '凭证验证失败',
				},
			},
		],
	};
}
