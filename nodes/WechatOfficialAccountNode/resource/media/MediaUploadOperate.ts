import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import NodeUtils from '../../../help/utils/NodeUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaUploadOperate: ResourceOperations = {
	name: '上传临时素材',
	value: 'media:upload',
	description: '上传临时素材，media_id仅三天内有效',
	options: [
		{
			displayName: '媒体文件类型',
			name: 'type',
			type: 'options',
			options: [
				{ name: '图片', value: 'image' },
				{ name: '语音', value: 'voice' },
				{ name: '视频', value: 'video' },
				{ name: '缩略图', value: 'thumb' },
			],
			default: 'image',
			required: true,
		},
		{
			displayName: '文件',
			name: 'inputDataFieldName',
			type: 'string',
			placeholder: 'e.g. data',
			default: 'data',
			hint: '包含用于更新文件的二进制文件数据的输入字段的名称',
			description:
				'在左侧输入面板的二进制选项卡中，找到包含二进制数据的输入字段的名称，以更新文件',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const type = this.getNodeParameter('type', index) as string;
		const inputDataFieldName = this.getNodeParameter('inputDataFieldName', index) as string;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/media/upload`,
			qs: {
				type: type,
			},
			json: false,
			formData: {
				media: await NodeUtils.buildUploadFileData.call(this, inputDataFieldName, index),
			},
		}, index);
	},
};

export default MediaUploadOperate;
