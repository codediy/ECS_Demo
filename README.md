## ECS_DEMO
- ECS的实现分析
- 参考[ecs-game-engine](https://github.com/raohmaru/ecs-game-engine)

## ECS注册逻辑
### TOC
- 注册 ComponentClasses
- 注册 SystemInstance
- 注册 Entity-Components

1. 注册 ComponentClasses
```js
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
```
- 需要在System前注册，
- System注册时自动创建对应分组

2. 注册 SystemInstance
```js
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
```
- 注册System自动创建对应的Group
- Group根据ComponentClasses的mask进行创建
- Group会自动获取对应Component的Entity
3. 注册 Entity-Components
```js
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
```
- 注册Entity
- addComponents()调用自动注册Entity到Group中

## ECS更新逻辑
- 游戏启动
- 定时渲染
- 事件处理

1. 游戏启动
```js
//加载资源
game.prepare();
//启动回调
game.start();
game._beat.start();
```
2. 定时渲染
```js 
game._beat.frame();
game.frame();
ecs.update();
system.update();
```

3. 事件注册
```js 
// System/keyboard.js
/*注册按键事件*/
stage.addEventListener('keydown', this.onKeyDown.bind(this));
stage.addEventListener('keyup', this.onKeyUp.bind(this));
onKeyDown(e) {
		if(keyCodes[e.keyCode]) {
			this._keyboard[keyCodes[e.keyCode]] = true;
		}
}

onKeyUp(e) {
		if(keyCodes[e.keyCode]) {
			this._keyboard[keyCodes[e.keyCode]] = false;
		}
}
```
