import { IExecuteFunctions } from 'n8n-workflow';

interface IProxyOptions {
	proxy?: string;
	timeout?: number;
	allowUnauthorizedCerts?: boolean;
	followRedirect?: boolean;
	maxRedirects?: number;
}

class OptionsUtils {
	/**
	 * 从节点参数中提取选项配置
	 */
	static extractOptions(context: IExecuteFunctions, index: number = 0): IProxyOptions {
		const options: IProxyOptions = {};

		try {
			// 获取代理设置
			const proxy = context.getNodeParameter('options.proxy', index, '') as string;
			if (proxy && proxy.trim()) {
				options.proxy = proxy.trim();
			}

			// 获取超时设置
			const timeout = context.getNodeParameter('options.timeout', index, 0) as number;
			if (timeout && timeout > 0) {
				options.timeout = timeout * 1000; // 转换为毫秒
			}

			// 获取SSL证书验证设置
			const allowUnauthorizedCerts = context.getNodeParameter('options.allowUnauthorizedCerts', index, false) as boolean;
			if (allowUnauthorizedCerts) {
				options.allowUnauthorizedCerts = true;
			}

			// 获取重定向设置
			const followRedirect = context.getNodeParameter('options.followRedirect', index, true) as boolean;
			options.followRedirect = followRedirect;

			// 获取最大重定向次数
			const maxRedirects = context.getNodeParameter('options.maxRedirects', index, 21) as number;
			if (maxRedirects && maxRedirects > 0) {
				options.maxRedirects = maxRedirects;
			}
		} catch (error) {
			// 如果参数不存在，忽略错误，使用默认值
		}

		return options;
	}
}

export default OptionsUtils;
