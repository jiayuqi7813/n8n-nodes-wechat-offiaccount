import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import RequestUtils from '../../../help/utils/RequestUtils';
import {ResourceOperations} from "../../../help/type/IResource";

const TagGetOperate  : ResourceOperations = {
	name: '获取标签列表',
	value: 'tag:get',
	description: '获取公众号已创建的标签',
	options: [],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		return RequestUtils.request.call(this, {
			method: 'GET',
			url: `/cgi-bin/tags/get`,
		}, index);
	}
};

export default TagGetOperate;
