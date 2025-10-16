import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { IRequestOptions } from 'n8n-workflow/dist/Interfaces';
import OptionsUtils from './OptionsUtils';


class RequestUtils {
	static async originRequest(
		this: IExecuteFunctions,
		options: IRequestOptions,
		clearAccessToken = false,
		index = 0,
	) {
		const credentials = await this.getCredentials('wechatOfficialAccountCredentialsApi');
		const userOptions = OptionsUtils.extractOptions(this, index);

		options.baseURL = `https://${credentials.baseUrl}`;

		// 优先使用节点级别的代理配置，如果没有则使用凭证级别的代理配置
		if (userOptions.proxy) {
			options.proxy = userOptions.proxy;
		} else if (credentials.proxy) {
			options.proxy = credentials.proxy as string;
		}

		// 优先使用节点级别的超时配置，如果没有则使用凭证级别的超时配置
		if (userOptions.timeout) {
			options.timeout = userOptions.timeout;
		} else if (credentials.timeout) {
			options.timeout = Number(credentials.timeout) * 1000; // 转换为毫秒
		}

		// 优先使用节点级别的SSL配置，如果没有则使用凭证级别的SSL配置
		if (userOptions.allowUnauthorizedCerts) {
			options.rejectUnauthorized = false;
		} else if (credentials.allowUnauthorizedCerts) {
			options.rejectUnauthorized = false;
		}

		if (userOptions.followRedirect !== undefined) {
			options.followRedirect = userOptions.followRedirect;
		}

		if (userOptions.maxRedirects) {
			options.maxRedirects = userOptions.maxRedirects;
		}

		return this.helpers.requestWithAuthentication.call(this, 'wechatOfficialAccountCredentialsApi', options, {
			// @ts-ignore
			credentialsDecrypted: {
				data: {
					...credentials,
					accessToken: clearAccessToken ? '' : credentials.accessToken,
				},
			},
		});
	}

	static async request(this: IExecuteFunctions, options: IRequestOptions, index = 0) {
		return RequestUtils.originRequest.call(this, options, false, index).then((text) => {
			const data: any = JSON.parse(text);
			// 处理一次accesstoken过期的情况
			if (data.errcode && data.errcode === 42001) {
				return RequestUtils.originRequest.call(this, options, true, index)
					.then((text) => {
						const data: any = JSON.parse(text);
						if (data.errcode && data.errcode !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`Request Error: ${data.errcode}, ${data.errmsg}`,
							);
						}
						return data;
					});
			}

			if (data.errcode && data.errcode !== 0) {
				throw new NodeOperationError(
					this.getNode(),
					`Request Error: ${data.errcode}, ${data.errmsg}`,
				);
			}
			return data;
		});
	}
}

export default RequestUtils;
