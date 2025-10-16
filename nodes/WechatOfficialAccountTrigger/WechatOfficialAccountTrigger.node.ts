import {INodeType, INodeTypeDescription, NodeOperationError} from 'n8n-workflow';
import { IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
import WechatMsgSignUtils from "../help/utils/WechatMsgSignUtils";

export class WechatOfficialAccountTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Wechat Official Account Trigger',
		name: 'wechatOfficialAccountTrigger',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:icon.png',
		group: ['trigger'],
		version: 1,
		description: 'Triggers the workflow when Server-Sent Events occur',
		activationMessage: 'You can now make calls to your SSE URL to trigger executions.',
		defaults: {
			name: 'Wechat Official Account Trigger',
		},
		// @ts-ignore
		inputs: [],
		// @ts-ignore
		outputs: ['main'],
		credentials: [
			{
				name: 'wechatOfficialAccountCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Token',
				name: 'token',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				required: true,
			},
			{
				displayName: '消息加密方式',
				name: 'signatureType',
				type: 'options',
				options: [
					{
						name: '明文模式',
						value: 'plaintext',
					},
					{
						name: '兼容模式',
						value: 'compatible',
					},
					{
						name: '安全模式',
						value: 'aes',
					},
				],
				default: 'plaintext',
			},
			{
				displayName: 'EncodingAESKey',
				name: 'aesKey',
				type: 'string',
				typeOptions: { password: true },
				default: '',
			},
		],

		webhooks: [
			{
				name: 'setup',
				httpMethod: 'GET',
				path: 'wechat',
				responseMode: 'responseNode'
			},
			{
				name: 'default',
				httpMethod: 'POST',
				path: 'wechat',
				responseMode: 'responseNode'
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const query: any = this.getQueryData();
		const request = this.getRequestObject();
		const body = request.body;
		const token = this.getNodeParameter('token') as string;
		const signatureType = this.getNodeParameter('signatureType') as string;

		if (!query.signature || !query.timestamp || !query.nonce) {
			console.log('Invalid signature empty');
			throw new NodeOperationError(this.getNode(), {
				message: 'Invalid signature',
				query: query,
			});
		}

		if (!WechatMsgSignUtils.checkSignature(token, query.signature, query.timestamp, query.nonce)) {
			console.log('Invalid signature false');

			throw new NodeOperationError(this.getNode(), {
				message: 'Invalid signature',
				query: query,
			});
		}

		// hi response
		if (request.method === 'GET' && query.echostr) {
			const response = this.getResponseObject();
			response.send(query.echostr);
			return {
				noWebhookResponse: true,
			};
		}

		let workflowStaticData = this.getWorkflowStaticData('global');

		// Encrypt message
		const encrypt_type = query.encrypt_type;
		if (encrypt_type && encrypt_type === 'aes') {
			if (
				!WechatMsgSignUtils.checkEncryptSignature(
					token,
					query.signature,
					query.timestamp,
					query.nonce,
					body.xml.Encrypt,
				)
			) {
				throw new NodeOperationError(this.getNode(), {
					message: 'Invalid Encrypt signature',
					query: query,
				});
			}

			// 解密消息体"Encrypt"密文
			const aesKey = this.getNodeParameter('aesKey') as string;
			if (!aesKey) {
				throw new NodeOperationError(this.getNode(), 'aesKey is required');
			}

			try {
				const decryptObject = WechatMsgSignUtils.decrypt(body.xml.encrypt, aesKey);

				body.xml = {
					...decryptObject.xml,
					encrypt: body.xml.encrypt,
				};
				body.appId = decryptObject.appId;

				workflowStaticData.encrypt_type = encrypt_type;
				workflowStaticData.token = token;
				workflowStaticData.aesKey = aesKey;
				workflowStaticData.appId = decryptObject.appId;
			} catch (error) {
				throw new NodeOperationError(this.getNode(), {
					message: 'Decrypt Msg Error',
					error: error,
				});
			}
		}

		workflowStaticData.signatureType = signatureType;

		const data: any = {
			query,
			body,
		};

		return {
			workflowData: [this.helpers.returnJsonArray(data)],
		};
	}
}
