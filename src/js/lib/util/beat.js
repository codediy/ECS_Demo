export default class Beat {
    /*
    * @fps 设置的渲染间隔
    * @cb  渲染回调
    * */
	constructor(fps, cb) {
		this._fps = fps;
		/*渲染回调*/
		this._cb = cb;

		this._fpsInterval = 1000 / fps;
		this._currentTime = 0;
		this._frameCount = 0;
		this._accumulator = 0;
	}

	get currentFps() {
		return 1000 / (this._currentTime - this._previousTime);
	}

	start() {
		let me = this;

		/*记录时间*/
		this._startTime = window.performance.now();
		this._previousTime = this._startTime;
		this._previousDeltaTime = this._startTime;

		/*设置渲染回调 延迟渲染*/
		this._onFrame = (currentTime) => me.frame(currentTime);  // Wrapper to keep the scope (faster than .bind()?)
		/*刷新页面*/
		this.frame(this._startTime);

	}

	stop() {
		window.cancelAnimationFrame(this._timerID);
		this._cb = null;
		this._onFrame = null;
	}

	frame(currentTime) {
		// calc elapsed time since last loop
		/*延迟计算*/
		let delta = currentTime - this._previousDeltaTime;
		// if enough time has elapsed, draw the next frame
		/*检查是否需要更新*/
		if (delta >= this._fpsInterval) {
			// Adjust next execution time in case this frame took longer to execute
			this._previousDeltaTime = currentTime - (delta % this._fpsInterval);
			/*调用渲染回调*/
			this._cb(currentTime - this._previousTime);

			this._frameCount++;
			/*记录上次渲染时间*/
			this._previousTime = currentTime;
		}

		/*渲染*/
		this._currentTime = currentTime;
		/*注册下次渲染 每次渲染注册下次渲染*/
		this._timerID = window.requestAnimationFrame(this._onFrame);
	}
};
