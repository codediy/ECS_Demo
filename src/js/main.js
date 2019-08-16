import cfg           from './config.js';
import $             from './util/dom.js';
import Game          from './lib/core/game.js';
import Scene         from './lib/core/scene.js';

import Movement      from './systems/movement.js';
import Render        from './systems/render.js';
import Translation   from './systems/translation.js';
import Keyboard      from './systems/keyboard.js';
import Director      from './systems/director.js';
import Puppeteer     from './systems/puppeteer.js';

import Sprite        from './components/sprite.js';
import Background    from './components/background.js';
import Position      from './components/position.js';
import Velocity      from './components/velocity.js';
import Translate     from './components/translate.js';
import Camera        from './components/camera.js';
import Movable       from './components/movable.js';
import Direction     from './components/direction.js';

// variables
let game;
const $statistics = $('#statistics');

function init() {
	/*创建Game
	* @param  canvas元素
	* @type   渲染类型
	* @cfg    配置信息
	* @cb     回调函数
	* */
	game = new Game($('#stage'), Game.CANVAS, cfg, {ready, render});

	/*
	*  注册属性组件Class
	*  需要在System前注册
	*  System注册的时候 自动获取关心的属性分组 game.ecs.getEntitiesByComponents()
	*  System
	*   -> Group
	* 	-> {
	* 	    	Component1
	* 			-> {
	* 				Entity1,
	* 				Entity2,
	* 				...
	* 			},
	* 			Component2
	* 			-> {
	* 				Entity1,
	* 				Entity2,
	* 				...
	* 			,
	* 			...
	* 	   }
	*
	* */
	game.ecs.registerComponents(
		Position,
		Velocity,
		Direction,
		Movable,
		Sprite,
		Background,
		Translate,
		Camera
	);

	/*注册系统实例System
	* 需要在Entity前注册
	* Entity添加属性组件的时候 自动添加到System关系的分组Group中
	* */
	game.ecs.addSystems(
		new Movement(game),
		new Translation(game),
		/*输入系统*/
		new Keyboard(game),
		/*镜头控制*/
		new Director(game),
		new Puppeteer(game),
		/*渲染系统*/
		new Render(game)
	);

	/*注册场景*/
	const scene0 = new Scene(game, 'scene0', 240, 320);
	game.addScene(scene0);
	game.currentScene = 0;

	/*实体*/
	const square = game.ecs
		/*实体标志符*/
		.createEntity('square')
		/*注册实体属性组件 自动添加 Entity到Group中, */
		.addComponents(
			new Sprite(createPlayerSprite()),
			new Position(32, 0),
			new Velocity(16, 16),
			new Movable()
		);
	/*场景添加实体*/
	scene0.addSprite(square, 1);

	/*实体*/
	const player = game.ecs
		.createEntity('player')
		.addComponents(
			new Sprite('assets/player.png', 32, 32),
			new Position(32, 32),
			new Velocity(8, 8),
			new Movable(),
			new Direction()
		);

	/*场景添加Sprite实体*/
	scene0.addSprite(player, 1);

	/*实体*/
	const player50 = game.ecs
		.createEntity('player50')
		.addComponents(
			new Sprite('assets/knot.png', 32, 32),
			new Position(32, 64),
			new Velocity(8, 8),
			new Movable(),
			new Direction()
		);
	/*属性组件修改*/
	player50.getComponent('Sprite').transformation.scaleX = .5;
	/*场景添加Sprite实体*/
	scene0.addSprite(player50, 1);

	/*实体*/
	const player200 = game.ecs
		.createEntity('player200')
		.addComponents(
			new Sprite('assets/knot.png', 32, 32),
			new Position(32, 96),
			new Velocity(8, 8),
			new Movable(),
			new Direction()
		);
	player200.getComponent('Sprite').transformation.scaleX = 2;
	/*场景添加Sprite实体*/
	scene0.addSprite(player200, 1);

	/*实体*/
	const bg1 = game.ecs
		.createEntity('bg1')
		.addComponents(
			new Background({
				view    : createBGSprite(),
				width   : game.stage.width,
				height  : game.stage.height,
				parallax: true
				// fixed: true
			}),
			// new Translate(1, 1)
		);
	/*场景添加backGround实体*/
	scene0.addBackground(bg1, 0);

	/*实体*/
	const bg0 = game.ecs
		.createEntity('bg0')
		.addComponents(
			new Background({
				view  : '#cdf443',
				width : game.stage.width/2,
				height: game.stage.height/2,
				x     : 64,
				y     : 32
			 })
		);
	/*场景添加backGround实体*/
	scene0.addBackground(bg0, 0);

	/*实体*/
	const bg3 = game.ecs
		.createEntity('bg3')
		.addComponents(
			new Background({
				view  : createBGSprite(),
				width : game.stage.width/2,
				height: game.stage.height/2,
				x     : 64,
				y     : 32
			}),
			new Translate(0, 1)
		);
	/*场景添加backGround实体*/
	scene0.addBackground(bg3, 0);

	/*实体*/
	const bg2 = game.ecs
		.createEntity('bg2')
		.addComponents(
			new Background({
				view  : createBGSprite(),
				width : game.stage.width,
				height: game.stage.height/2,
				x     : 0,
				y     : game.stage.height/2
			}),
			new Translate(-1, -1)
		);
	/*场景添加backGround实体*/
	scene0.addBackground(bg2, 0);

	/*实体*/
	const camera = game.ecs
		.createEntity('camera')
		.addComponents(
			new Camera(game)
		);
	/*镜头控制*/
	camera.getComponent('Camera').follow(player);
	game.addCamera(camera);
	/*加载资源
	* prepare() 加载完后 调用ready()回调
	* ready()  回调 启动Beat()
	* Beat()的渲染回调中 调用System的更新回调
	* Game
	* 	-> Beat
	* 	-> {
	* 			System1.update ->{
	* 				Group -> {Entity,Entity}
	* 			},
	* 			System2.update -> {
	* 				Group -> {Entity,Entity}
	* 			},
	* 	   }
	*
	*
	* */
	game.prepare();
}

function ready() {
	/*启动游戏逻辑*/
	game.start();
}

function render(delta) {
	$statistics.textContent = 1000 / delta;
}

/*精灵渲染*/
function createPlayerSprite() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = 32;
	canvas.height = 32;
	ctx.fillStyle = '#306426';
	ctx.fillRect(0, 0, 32, 32);

	return canvas;
}

/*背景渲染*/
function createBGSprite() {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = 32;
	canvas.height = 32;
	ctx.strokeStyle = '#659a56';
	ctx.lineWidth = 2;
	ctx.moveTo(0, 12);
	ctx.lineTo(8, 20);
	ctx.lineTo(16, 12);
	ctx.lineTo(24, 20);
	ctx.lineTo(32, 12);
	ctx.stroke();

	return canvas;
}

init();
