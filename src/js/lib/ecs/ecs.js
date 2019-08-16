import Entity from './entity.js';
import Group from './group.js';

const components = new Map();
const entities = new Map();
const systems = new Set();
/*注册的Group*/
const groups = new Map();
const compId = Symbol('_id');  // Unique object, used as identifier

/*属性组件掩码*/
let bitMask = 0;

const Entity_addComponents_proxy = {
	/*
	* 拦截 entity.addComponents()调用 更新Entity的Group
	* @target   		代理的函数 entity.addComponents
	* @thisArg  		代理函数的上下文 Entity
	* @argumentsList    代理函数的参数 entity.addComponents(...argumentsList)
	* */
    apply: function(target, thisArg, argumentsList) {
    	console.log("addComponents调用target",target);
    	console.log("addComponents调用thisArg",thisArg);
    	console.log("addComponents调用argumentsList",argumentsList);

    	/*调用代理的函数entity.addComponents*/
        target.apply(thisArg, argumentsList);
        /*更新Group*/
		updateGroups(thisArg);
		return thisArg;
    }
};

/*回调Group掩码信息*/
const getMask = (comps) => {
	return comps.reduce( (acc, id) => {
		if(components.has(id)) {
			return acc | components.get(id).mask;
		}
		return 0;
	}, 0);
};

/*Group添加*/
const updateGroups = (entity) => {
	/*注册Entity到Group分组中*/
	for (let group of groups.values()) {
		group.match(entity);
	}
};

export default {
	registerComponents(...comps) {
		/*遍历属性组件Class*/
		comps.forEach((ComponentClass) => {
			/*检查属性组件*/
			if (ComponentClass[compId] && ComponentClass[compId] === ComponentClass.name) {
				throw new Error('The component is already registered');
				return;
			}

			/*设置compId,id,mask*/
			ComponentClass[compId] = ComponentClass.name;
			ComponentClass.id = ComponentClass[compId];
			ComponentClass.mask = 1 << bitMask++;

			/*注册属性组件到组件Map*/
			components.set(ComponentClass.id, ComponentClass);
		});
	},

	/*创建实体*/
	createEntity(id) {
		let entity;
		/*检查是否存在*/
		if (entities[id]) {
			throw new Error('The entity already exists');
		}
		/*实例化*/
		entity = new Entity(id);
		/*赋值Id*/
		entities.set(id, entity);
		/*addComponents的代理*/
		entity.addComponents = new Proxy(entity.addComponents, Entity_addComponents_proxy);
		return entity;
	},
	/*获取id对应的实体*/
	getEntity(id) {
		return entities.get(id)
	},

	/*获取Components的实体分组*/
	getEntitiesByComponents(...comps) {
		/*获取掩码*/
		const mask = getMask(comps);
		/*检查是否已缓存*/
		if(groups.has(mask)) {
			return groups.get(mask);
		}
		/*创建分组*/
		const group = new Group(mask);
		/*遍历Entity实体*/
		for (let entity of entities.values()) {
			group.match(entity);
		}
		/*注册到Groups缓存*/
		groups.set(mask, group);
		/*返回获取的分组*/
		return group;
	},

	/*注册System*/
	addSystems(...sys) {
		/*调用Systems.add 注册系统实例*/
		sys.forEach(system => systems.add(system));
	},

	update(delta) {
		systems.forEach((system) => {
			system.update && system.update(delta);
		});
	}
};
