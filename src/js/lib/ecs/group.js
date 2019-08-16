import Sgnl from '../util/sgnl.js';

/*
* Entity分组
* */
export default class Group {
	constructor(mask) {
		this._mask = mask;
		this._entities = new Set();
		this.onAdded = new Sgnl();
	}

	get entities() {
		return this._entities;
	}

	match(entity) {
		if((this._mask & entity.mask) === this._mask) {
			/*分组的实体*/
			this._entities.add(entity);
			/*回调事件*/
			this.onAdded.emit(entity);
		}
	}
}
