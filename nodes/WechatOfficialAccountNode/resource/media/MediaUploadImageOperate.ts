import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import NodeUtils from '../../../help/utils/NodeUtils';
import { ResourceOperations } from '../../../help/type/IResource';

const MediaUploadImageOperate: ResourceOperations = {
	name: '上传图文消息内的图片',
	value: 'media:uploadImage',
	description: "本接口所上传的图片不占用公众号的素材库中图片数量的100000个的限制。图片仅支持jpg/png格式，大小必须在1MB以下。",
	options: [
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
		const inputDataFieldName = this.getNodeParameter('inputDataFieldName', index) as string;

		return RequestUtils.request.call(this, {
			method: 'POST',
			url: `/cgi-bin/media/uploadimg`,
			json: false,
			formData: {
				media: await NodeUtils.buildUploadFileData.call(this, inputDataFieldName, index),
			},
		}, index);
	},
};

export default MediaUploadImageOperate;
