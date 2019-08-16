import C  from './const.js';
import Beat   from '../util/beat.js';
import ecs    from '../ecs/ecs.js';
import Rrr    from '../rrr/rrr.js';
import Loader from '../net/loader.js';

export default class Game {
	/*
	* @param canvas     渲染上下文
	* @renderType   	渲染类型
	* @cfg      		配置信息
	* @states   		回调函数
	* */
	constructor(canvas, rendererType, cfg, states) {
		this._cfg = cfg;
		this._states = states;
		/*渲染方式*/
		this._graphics = new Rrr(canvas, rendererType, cfg);
		/*渲染帧控制*/
		this._beat = new Beat(cfg.fps, this.frame.bind(this));
		/*资源加载*/
		this._loader = new Loader(true);
		// Default properties
		this._scenes = [];
		this._currentScene = 0;
	}

	get ecs() {
		return ecs;
	}

	get graphics() {
		return this._graphics;
	}

	get stage() {
		return this._graphics.stage;
	}

	get camera() {
		return this._graphics.camera;
	}

	get assets() {
		return this._loader;
	}

	get currentScene() {
		return this._currentScene;
	}
	set currentScene(id) {
		if(typeof id === 'string') {
			this._currentScene = this._scenes[id];
		} else {
			const values = Object.values(this._scenes);
			this._currentScene = values[id];
		}
	}

	prepare() {
		this._loader.start()
			.complete.then(() => {
				/*加载完成调用回调函数ready()*/
				this._states.ready && this._states.ready();
			});
	}

	/*启动游戏逻辑*/
	start() {
		this._beat.start();
	}

	/*帧渲染回调*/
	frame(delta) {
		/*更新画面 调用System进行更新*/
		ecs.update(delta);
		/*渲染场景*/
		this._states.render && this._states.render(delta);
	}

	render() {
		this._graphics.render(this._currentScene);
	}

	addScene(scene) {
		this._scenes[scene.id] = scene;
		if(!this._currentScene) {
			this._currentScene = scene;
		}
	}

	addCamera(entity) {
		this._graphics.addCamera(entity.getComponent('Camera'));
	}
};

Object.assign(Game, C);
