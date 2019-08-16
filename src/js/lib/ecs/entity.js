let currentId = 1;

export default class Entity {
	constructor(id) {
		this._id = id || (currentId++).toString(36);
		this._components = new Map();
		/*属性组件掩码*/
		this._mask = 0;
	}

	get mask() {
		return this._mask;
	}
	/*注册属性组件*/
	addComponents(...components) {
		/*遍历属性组件*/
		components.forEach((component) => {
			/*属性组件集合*/
			this._components.set(component.constructor.id, component);
			/*掩码设置*/
			this._mask |= component.constructor.mask;
		});

		return this;
	}

	/*移除属性组件回调 需要注册一个删除回调函数*/
	removeComponents(...components) {
		components.forEach((component) => {
			const entityComponent = this._components.get(component);
			/*属性组件删除回调*/
			if (entityComponent) {
				this._components.delete(entityComponent.constructor.id);
				/*mask掩码变化*/
				this._mask &= ~entityComponent.constructor.mask;
			}
		});
		return this;
	}

	/*检查是否包含属性组件*/
	hasComponent(component) {
		return this._components.has(component);
	}

	getComponent(component) {
		return this._components.get(component);
	}
}
