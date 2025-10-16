import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const QRCodeGenerateOperate: ResourceOperations = {
	name: '生成带参数的二维码',
	value: 'other:qrcode:generate',
	options: [
		{
			displayName: '二维码类型',
			name: 'action_name',
			type: 'options',
			options: [
				{ name: '临时二维码', value: 'QR_STR_SCENE' },
				{ name: '永久二维码', value: 'QR_LIMIT_STR_SCENE' },
			],
			required: true,
			default: 'QR_STR_SCENE',
		},
		{
			displayName: '有效时间（秒）',
			name: 'expire_seconds',
			type: 'number',
			default: 60,
			description: '二维码有效时间，以秒为单位。最大不超过2592000（即30天）。',
			displayOptions: {
				show: {
					action_name: ['QR_STR_SCENE'],
				},
			},
		},
		{
			displayName: '场景值ID',
			name: 'scene_str',
			type: 'string',
			default: '',
			description: '场景值ID（字符串形式的ID），字符串类型，长度限制为1到64',
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const actionName = this.getNodeParameter('action_name', index) as string;
		const expireSeconds = this.getNodeParameter('expire_seconds', index, null) as number;
		const sceneStr = this.getNodeParameter('scene_str', index) as string;

		const body: IDataObject = {
			action_name: actionName,
			action_info: {
				scene: {
					scene_str: sceneStr,
				},
			},
		};

		if (expireSeconds) {
			body.expire_seconds = expireSeconds;
		}

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/qrcode/create`,
			body,
		}, index);
	},
};

export default QRCodeGenerateOperate;
