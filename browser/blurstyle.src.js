(function(){
	let observer;
	let cssStyles;
	let chatActive = false;
	let filters = false;
	let bgAnim = true;
	let saturationValue = 170;
	let contrastValue = 110;

	/* логика проверки чата */
	function checkChatState() {
		const commons = {
			getChatStateAll: () => document.querySelector(".BattleChatComponentStyle-inputContainerAll"),
			getChatStateAllies: () => document.querySelector(".BattleChatComponentStyle-inputContainerAllies"),
		};

		const chatStateAll = commons.getChatStateAll();
		const chatStateAllies = commons.getChatStateAllies();

		if (chatStateAll || chatStateAllies) {
			chatActive = true;
		} else {
			chatActive = false;
		}
	}

	/* логика тегов */
	function animationTags(element, el)
	{
		if (element.tag.includes("fade"))
		{
			el.classList.add("animate", "fade");
		}

		if (element.tag.includes("scale"))
		{
			el.classList.add("animate", "scale");
		}

		if (element.tag.includes("scale3d"))
		{
			el.classList.add("animate", "scale3d");
		}

		if (element.tag.includes("slide"))
		{
			el.classList.add("animate", "slideIn");
		}
	}

	/* логика ховер тегов */
	function mouseHover(element, el)
	{
		Object.entries(element.styles).forEach(([style, value]) =>
		{
			el.style[style] = value;
		});

		if (element.tag.includes("BHV")) {
			el.addEventListener("mouseover", () => {
				el.style.transition = "border-color 1s, transform 0.7s";
				el.style.transform = "scale(0.97)";
				el.style.border = "0.150rem solid rgba(255, 255, 255, 1)";
			});

			el.addEventListener("mouseout", () => {
				el.style.transition = "border-color 1s, transform 0.7s";
				el.style.transform = "scale(1)";
				el.style.border = element.styles.border;
			});
		}
		else if (element.tag.includes("RHV"))
		{
			el.addEventListener("mouseover", () =>
			{
				el.style.transition = "background 0.5s";
				el.style.borderRadius = "1.1rem";
			});

			el.addEventListener("mouseout", () =>
			{
				el.style.transition = "background 0.5s";
				el.style.borderRadius = element.styles.borderRadius;
			});

			el.addEventListener("mousemove", () =>
			{
				el.style.borderRadius = "1.1rem";
			});
		}
	}

	/* логика наложения кастомного тайтла */
	function changeTitle(newTitle) {

		const allowedURLs = ['https://tankionline.com/play/', 'https://.*\.test-eu\.tankionline\.com/browser-public/index\.html.*'];

		const currentURL = window.location.href;

		const isAllowedURL = allowedURLs.some(url => new RegExp(url).test(currentURL));

		if (isAllowedURL && !document.title.includes("BlurStyle")) {
			document.title = newTitle;
		}
	}

	/* логика трансформации карточек */
	function handleMouseMove(e, card)
	{
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		const xPercent = (x / rect.width) * 110;
		const yPercent = (y / rect.height) * 110;

		const rotateX = (yPercent / 50 - 1) * 5;
		const rotateY = (xPercent / 50 - 1) * 5;

		card.style.transition = "box-shadow 0.7s, border-color 0.7s";
		card.style.transformOrigin = "center center";
		card.style.transform = `perspective(300px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1, 1, 1)`;
		card.style.boxShadow = "0rem 0rem 0.7rem 0.05rem rgba(255, 255, 255, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)";
	}

	function resetTransform(card)
	{
		card.style.transition = "transform 0.5s ease-in-out, box-shadow 0.7s, border-color 0.7s";
		card.style.transform = `perspective(300px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
		card.style.boxShadow = "0rem 0rem 0.3rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)";
	}

	/* логика фильтров */
	function applyFilters(saturation, contrast) {
		document.body.style.filter = `saturate(${saturation}%) contrast(${contrast}%)`;
	}

	/* сброс фильтров */
	function resetFilters() {
		document.body.style.filter = '';
	}

	/* чекер, чтобы эта падла лепилась только на тест и основы */
	function updateFilters() {
		const currentURL = window.location.href;
		const targetURLs = ['https://tankionline.com/play*', 'https://*.test-eu.tankionline.com/browser-public/index.html?*'];

		const isMatchingURL = targetURLs.some(targetURL => {
			const regex = new RegExp(targetURL.replace(/\*/g, '.*'));
			return regex.test(currentURL);
		});

		if (filters && isMatchingURL) {
			applyFilters(saturationValue, contrastValue);
		} else {
			resetFilters();
		}
	}

	/* переключение состояния фильтров */
	function toggleFilters() {
		filters = !filters;
		updateFilters();
		saveFilterSettings();
	}

	/* сохранение настроек фильтров в локальное хранилище */
	function saveFilterSettings() {
		localStorage.setItem('filters', filters.toString());
	}

	/* восстановление настроек фильтров из локального хранилища */
	function restoreFilterSettings() {
		const savedSetting = localStorage.getItem('filters');
		if (savedSetting) {
			filters = savedSetting === 'true';
			updateFilters();
		}
	}

	/* переключение состояния фильтров */
	document.addEventListener('keydown', function(event) {
		const allowedURLs = ['https://tankionline.com/play/', 'https://*.test-eu.tankionline.com/browser-public/index.html?*'];
		const currentURL = window.location.href;

		/* проверка на то, что текущий URL соответствует хотя бы одному из разрешенных URL */
		const isValidURL = allowedURLs.some(url => new RegExp(url.replace(/\*/g, '.*')).test(currentURL));

		checkChatState();

		/* проверки перед включением фильтра */
		if (!chatActive && event.key === '\\' && isValidURL) {
			toggleFilters();
		}
	});

	/* логика вариации таба с резистами */
	function resistanceTab() {
		let rTab = localStorage.getItem('rTab') === 'true';

		if (rTab) {
			applyTab();
		}

		document.addEventListener('keydown', (event) => {
			checkChatState();

			if (!chatActive && event.key === '=') {
				toggleScript();
			}
		});

		function applyTab() {
			const css = `
			td.BattleTabStatisticComponentStyle-nicknameCell > div > div > div {
				width: 8rem !important;
			}

			.BattleTabStatisticComponentStyle-nicknameCell {
				margin-right: 1rem;
			}

			.BattleTabStatisticComponentStyle-resistanceModuleCell {
					visibility: unset;
					margin-right: 11rem;
			}
			`;
			addStyle(css);
		}

		function addStyle(css) {
			const body = document.body || document.getElementsByTagName('body')[0];
			const style = document.createElement('style');

			style.className = 'css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			body.appendChild(style);
		}

		function toggleScript() {
			rTab = !rTab;

			if (rTab) {
				applyTab();
			} else {
				removeTab();
			}

			localStorage.setItem('rTab', rTab.toString());
		}

		function removeTab() {
			const styleElement = document.querySelector('.css');
			if (styleElement) {
				styleElement.remove();
			}
		}
	}

	/* логика наложения анимации фона */
	function backgroundAnimation() {
		const createStyleElement = () => {
			const style = document.createElement('style');
			style.textContent = `
				.Common-entranceGradient, #app-root, .Common-Container {
					position: relative;
					overflow: hidden;
					background: black;
				}

				.Common-entranceGradient::before, #app-root::before, .Common-container::before {
					content: "";
					position: absolute;
					inset: 0;
					--stripes: repeating-linear-gradient(
						100deg,
						#fff 0%,
						#fff 7%,
						transparent 10%,
						transparent 12%,
						#fff 16%
					);
					--stripesDark: repeating-linear-gradient(
						100deg,
						#000 0%,
						#000 7%,
						transparent 10%,
						transparent 12%,
						#000 16%
					);
					--rainbow: repeating-linear-gradient(
						100deg,
						#fff 10%,
						#000 15%,
						#fff 20%,
						#000 25%,
						#fff 30%
					);
					background-image: var(--stripes), var(--rainbow);
					background-size: 200%, 100%;
					animation: gradientBg 60s linear infinite;
					background-attachment: fixed;
					mix-blend-mode: difference;
					filter: blur(14rem) invert(100%);
					will-change: transform;
				}

				@keyframes gradientBg {
					from {
						background-position: 50% 50%, 50% 50%;
					}
					to {
						background-position: 350% 50%, 350% 50%;
					}
				}
			`;
			return style;
		};

		const toggleBG = () => {
			checkChatState();

			if (!chatActive) {
				bgAnim = !bgAnim;
				const action = bgAnim ? 'appendChild' : 'removeChild';
				document.head[action](styleElement);
				saveBgSettings();
			}
		};

		const handleKeyDown = (event) => {
			const keyCodeBracket = 221;

			if (event.keyCode === keyCodeBracket) {
				toggleBG();
			}
		};

		const styleElement = createStyleElement();
		document.head.appendChild(styleElement);

		document.addEventListener('keydown', handleKeyDown);

		/* сохранение настроек фона в локальное хранилище */
		function saveBgSettings() {
			localStorage.setItem('bgAnim', bgAnim.toString());
		}

		/* восстановление настроек фона из локального хранилища */
		function restoreBgSettings() {
			const savedSetting = localStorage.getItem('bgAnim');
			if (savedSetting) {
				bgAnim = savedSetting === 'true';
				const action = bgAnim ? 'appendChild' : 'removeChild';
				document.head[action](styleElement);
			}
		}
		restoreBgSettings();
	}

	/* логика наложения канвас анимации на загрузочный экран */
	(function() {
		const styleBlock = document.createElement("style");
		styleBlock.innerHTML = `
			.ApplicationLoaderComponentStyle-container {
				position: fixed;
				overflow: hidden;
			}

			.canvasWrapper {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 99;
			}

			canvas {
				display: block;
				position: fixed;
			}
		`;
		document.head.appendChild(styleBlock);

		class Star {
			constructor(canvas) {
				this.X = canvas.width / 2;
				this.Y = canvas.height / 2;
				this.SX = Math.random() * 10 - 5;
				this.SY = Math.random() * 10 - 5;

				const start = canvas.width > canvas.height ? canvas.width : canvas.height;
				this.X += (this.SX * start) / 10;
				this.Y += (this.SY * start) / 10;

				this.W = 1;
				this.H = 1;

				this.age = 0;
				this.dies = 500;

				starIndex++;
				stars[starIndex] = this;

				this.ID = starIndex;
				this.C = "#ffffff";
			}

			draw() {
				if (!canvas) return;

				this.X += this.SX;
				this.Y += this.SY;

				this.SX += this.SX / (50 / acceleration);
				this.SY += this.SY / (50 / acceleration);

				this.age++;

				if (
					this.age === Math.floor(50 / acceleration) ||
					this.age === Math.floor(150 / acceleration) ||
					this.age === Math.floor(300 / acceleration)
				) {
					this.W++;
					this.H++;
				}

				if (
					this.X + this.W < 0 ||
					this.X > canvas.width ||
					this.Y + this.H < 0 ||
					this.Y > canvas.height
				) {
					delete stars[this.ID];
					numStars--;
				}

				canvas.getContext("2d").fillStyle = this.C;
				canvas.getContext("2d").fillRect(this.X, this.Y, this.W, this.H);
			}
		}

		const stars = {};
		let starIndex = 0;
		let numStars = 0;
		let acceleration = 1;
		let canvas;
		let starsToDraw;
		let spaceAnim = true;

		if (localStorage.getItem("spaceAnim") !== null) {
			spaceAnim = localStorage.getItem("spaceAnim") === "true";
		}

		function toggleAnimation() {
			spaceAnim = !spaceAnim;
			if (spaceAnim) {
				applyAnimationToBackground(document.querySelector(".ApplicationLoaderComponentStyle-container"));
			} else {
				removeAnimationFromBackground(document.querySelector(".ApplicationLoaderComponentStyle-container"));
			}

			localStorage.setItem("spaceAnim", spaceAnim);
		}

		function applyAnimationToBackground(loadBg) {
			if (!loadBg) return;

			canvas = document.createElement("canvas");
			canvas.id = "field";

			const canvasWrapper = document.createElement("div");
			canvasWrapper.className = "canvasWrapper";
			loadBg.appendChild(canvasWrapper);
			canvasWrapper.appendChild(canvas);

			canvas.getContext("2d").fillStyle = "rgba(0, 0, 0, 0.8)";
			canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);

			canvas.width = loadBg.clientWidth;
			canvas.height = loadBg.clientHeight;

			starsToDraw = (canvas.width * canvas.height) / 5000;

			function draw() {
				if (!spaceAnim || !loadBg || !canvas || !canvas.getContext) {
					clearInterval(animationInterval);
					return;
				}

				if (canvas.width !== loadBg.clientWidth) {
					canvas.width = loadBg.clientWidth;
				}

				if (canvas.height !== loadBg.clientHeight) {
					canvas.height = loadBg.clientHeight;
				}

				canvas.getContext("2d").fillStyle = "rgba(0, 0, 0, 0.8)";
				canvas.getContext("2d").fillRect(0, 0, canvas.width, canvas.height);

				for (let i = numStars; i < starsToDraw; i++) {
					new Star(canvas);
					numStars++;
				}

				for (const star in stars) {
					stars[star].draw();
				}
			}

			const animationInterval = setInterval(draw, 20);

			loadBg.dataset.animationInterval = animationInterval;
			loadBg.dataset.canvasId = canvas.id;
		}

		function removeAnimationFromBackground(loadBg) {
			if (!loadBg) return;

			const animationInterval = loadBg.dataset.animationInterval;
			const canvasId = loadBg.dataset.canvasId;

			clearInterval(animationInterval);

			if (canvasId) {
				const canvasElement = document.getElementById(canvasId);
				if (canvasElement) {
					canvasElement.parentNode.remove();
				}
			}

			delete loadBg.dataset.animationInterval;
			delete loadBg.dataset.canvasId;
		}

		const observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
					mutation.addedNodes.forEach(function(node) {
						if (
							node.nodeType === 1 &&
							node.classList.contains("ApplicationLoaderComponentStyle-container")
						) {
							applyAnimationToBackground(node);
						}
					});
				} else if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
					mutation.removedNodes.forEach(function(node) {
						if (
							node.nodeType === 1 &&
							node.classList.contains("ApplicationLoaderComponentStyle-container")
						) {
							removeAnimationFromBackground(node);
						}
					});
				}
			});
		});

		const observerConfig = {
			childList: true,
			subtree: true,
		};
		observer.observe(document.body, observerConfig);

		document.querySelectorAll(".ApplicationLoaderComponentStyle-container").forEach(function(element) {
			applyAnimationToBackground(element);
		});

		document.addEventListener("keydown", function(event) {
			if (event.key === "Insert") {
				toggleAnimation();
			}
		});
	})();

	/* логика перенаправления ресурсов */
	function gmOverride() {
		const overrides = [
			/* худ и прочее в битве */
			{	/* припасы в битве | прозрачные белые припасы */
				from: `supplies_atlas`,
				to: `https://xeon.fun/battle/hud/supplies.png`
			},
	
			{	/* сток билборд в катке | блюрстайл лого */
				from: `/0/16716/156/240/30545000607201/image.webp`,
				to: `https://xeon.fun/battle/bilboard/bilboard.jpg`,
				external: true
			},
	
			/* дефолт космос небо | кастом космос небо */
			{   // верх
				from: '/0/16721/110/123/30545000606213/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/up.png'
			},
	
			{   // низ
				from: '/0/16721/110/124/30545000606433/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/down.png'
			},
	
			{   // право
				from: '/0/16721/110/121/30545000607406/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/back.png'
			},
	
			{   // лево
				from: '/0/16721/110/120/30545000605752/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/right.png'
			},
	
			{   // перед
				from: '/0/16721/107/207/30545000605173/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/f.png'
			},
	
			{   // зад
				from: '/0/16721/110/122/30545000606256/image.webp',
				to: 'https://xeon.fun/battle/skybox/parkour/left.png'
			}
		];
	
		const createPattern = (url) => {
			const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			return new RegExp(escapedUrl);
		};
	
		const originalFetch = unsafeWindow.fetch;
		unsafeWindow.fetch = async (url, options) => {
			for (const override of overrides) {
				const pattern = createPattern(override.from);
				if (pattern.test(url)) {
					console.log(`[Blurstyle] успешная замена ресурса: \nкаво: ${url}\nкуда: ${override.to}`);
					return new Promise((resolve, reject) => {
						GM_xmlhttpRequest({
							method: 'GET',
							url: override.to,
							responseType: 'blob',
							onload: response => {
								if (response.status === 200) {
									resolve(new Response(response.response, {
										status: 200,
										statusText: 'OK',
										headers: { 'Content-Type': response.response.type }
									}));
								} else {
									reject(new Error(`ошибочка вышла: ${response.status}`));
								}
							},
							onerror: reject
						});
					});
				}
			}
			return originalFetch(url, options);
		};
	}

	/* логика наложения кастомного тайтла */
	function changeTitle(newTitle) {

		const allowedURLs = ['https://tankionline.com/play/', 'https://.*\.test-eu\.tankionline\.com/browser-public/index\.html.*'];

		const currentURL = window.location.href;

		const isAllowedURL = allowedURLs.some(url => new RegExp(url).test(currentURL));

		if (isAllowedURL && !document.title.includes("BlurStyle")) {
			document.title = newTitle;
		}
	}

	/* логика замены картинок в формате дата юри */
	function replaceImage(element, data) {
		if (element && (element.src || element.href)) {
			const currentUrl = element.src || element.href;

			if (currentUrl.endsWith(data.origImage)) {
				if (element.src) {
					element.src = data.newImage;
				} else if (element.href) {
					element.href = data.newImage;
				}
			}
		}
	}

    const replaceToUri = [
        { 	/* лого в промежуточном загрузочном экране | лого BlurStyle */
            selector: "#root > div.LobbyLoaderComponentStyle-container > img",
            origImage: "/static/images/logo.e64f36db.svg",
            newImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjI1OSIgdmlld0JveD0iMCAwIDI2MCAyNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNi4yNjY3IDI2LjZMMCA1Mi44NjY3TDAuMjY2NjY3IDEwNC43MzNMMC42NjY2NjcgMTU2LjZMMjUuMDY2NyAxNTYuNDY3QzM4LjQgMTU2LjQ2NyA0OS4zMzMzIDE1Ni44NjcgNDkuMzMzMyAxNTcuNEM0OS4zMzMzIDE1Ny45MzMgMzguMjY2NyAxNjkuNCAyNC42NjY3IDE4M0wwIDIwNy42NjdWMjMzLjI2N1YyNTlIMTAzLjczM0gyMDcuMzMzTDIzMy43MzMgMjMyLjczM0wyNjAgMjA2LjQ2N1YxNjQuNzMzVjEyM0gyMzcuNzMzSDIxNS4zMzNMMjM3LjczMyAxMDAuNkwyNjAgNzguMzMzM1YzOS4yNjY3VjAuMzMzMzJIMTU2LjRINTIuNjY2N0wyNi4yNjY3IDI2LjZaTTIwMi41MzMgNTMuMTMzM0MyMDQuOCA1My42NjY3IDIwNi42NjcgNTQuNzMzMyAyMDYuNjY3IDU1LjUzMzNDMjA2LjY2NyA1Ni4zMzMzIDE5Ni45MzMgNjYuNzMzMyAxODQuOTMzIDc4LjczMzNMMTYzLjMzMyAxMDAuMzMzSDE0Ni45MzNIMTMwLjY2N1Y4OVY3Ny42NjY3SDEwNS4zMzNIODBWOTEuOTMzM1YxMDYuMzMzTDkyLjI2NjcgMTE4LjZMMTA0LjY2NyAxMzFIMTU1LjZIMjA2LjY2N1YxNjlWMjA3SDEzMC40SDU0TDY3LjMzMzMgMTkzLjY2N0w4MC42NjY3IDE4MC4zMzNIMTI4LjkzM0gxNzcuMzMzVjE2Ny42NjdWMTU1SDEzMy4wNjdIODguNjY2N0w3MS4wNjY3IDEzNy40TDUzLjMzMzMgMTE5LjY2N1Y5N1Y3NC4zMzMzTDYzLjczMzMgNjQuMDY2N0M3Mi41MzMzIDU1LjI2NjcgNzQuOCA1My44IDc5LjMzMzMgNTMuMjY2N0M4OC41MzMzIDUyLjQ2NjcgMTk4LjEzMyA1Mi4zMzMzIDIwMi41MzMgNTMuMTMzM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
        },

		{ 	/* лого в основном загрузочном экране | лого BlurStyle */
			selector: "#root > div.ApplicationLoaderComponentStyle-container.Common-flexCenterAlignCenterColumn > img.ApplicationLoaderComponentStyle-logo",
			origImage: "/static/images/logo.e64f36db.svg",
			newImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjI1OSIgdmlld0JveD0iMCAwIDI2MCAyNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNi4yNjY3IDI2LjZMMCA1Mi44NjY3TDAuMjY2NjY3IDEwNC43MzNMMC42NjY2NjcgMTU2LjZMMjUuMDY2NyAxNTYuNDY3QzM4LjQgMTU2LjQ2NyA0OS4zMzMzIDE1Ni44NjcgNDkuMzMzMyAxNTcuNEM0OS4zMzMzIDE1Ny45MzMgMzguMjY2NyAxNjkuNCAyNC42NjY3IDE4M0wwIDIwNy42NjdWMjMzLjI2N1YyNTlIMTAzLjczM0gyMDcuMzMzTDIzMy43MzMgMjMyLjczM0wyNjAgMjA2LjQ2N1YxNjQuNzMzVjEyM0gyMzcuNzMzSDIxNS4zMzNMMjM3LjczMyAxMDAuNkwyNjAgNzguMzMzM1YzOS4yNjY3VjAuMzMzMzJIMTU2LjRINTIuNjY2N0wyNi4yNjY3IDI2LjZaTTIwMi41MzMgNTMuMTMzM0MyMDQuOCA1My42NjY3IDIwNi42NjcgNTQuNzMzMyAyMDYuNjY3IDU1LjUzMzNDMjA2LjY2NyA1Ni4zMzMzIDE5Ni45MzMgNjYuNzMzMyAxODQuOTMzIDc4LjczMzNMMTYzLjMzMyAxMDAuMzMzSDE0Ni45MzNIMTMwLjY2N1Y4OVY3Ny42NjY3SDEwNS4zMzNIODBWOTEuOTMzM1YxMDYuMzMzTDkyLjI2NjcgMTE4LjZMMTA0LjY2NyAxMzFIMTU1LjZIMjA2LjY2N1YxNjlWMjA3SDEzMC40SDU0TDY3LjMzMzMgMTkzLjY2N0w4MC42NjY3IDE4MC4zMzNIMTI4LjkzM0gxNzcuMzMzVjE2Ny42NjdWMTU1SDEzMy4wNjdIODguNjY2N0w3MS4wNjY3IDEzNy40TDUzLjMzMzMgMTE5LjY2N1Y5N1Y3NC4zMzMzTDYzLjczMzMgNjQuMDY2N0M3Mi41MzMzIDU1LjI2NjcgNzQuOCA1My44IDc5LjMzMzMgNTMuMjY2N0M4OC41MzMzIDUyLjQ2NjcgMTk4LjEzMyA1Mi4zMzMzIDIwMi41MzMgNTMuMTMzM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
		},

        { 	/* лого в первоначальном экране | лого BlurStyle */
            selector: "#root > div > div > div > div.EntranceComponentStyle-ContainerForm.MainEntranceComponentStyle-mainContainer > form > div > img",
            origImage: "/static/images/tanki_online_white.b4613c5f.svg",
            newImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjI1OSIgdmlld0JveD0iMCAwIDI2MCAyNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNi4yNjY3IDI2LjZMMCA1Mi44NjY3TDAuMjY2NjY3IDEwNC43MzNMMC42NjY2NjcgMTU2LjZMMjUuMDY2NyAxNTYuNDY3QzM4LjQgMTU2LjQ2NyA0OS4zMzMzIDE1Ni44NjcgNDkuMzMzMyAxNTcuNEM0OS4zMzMzIDE1Ny45MzMgMzguMjY2NyAxNjkuNCAyNC42NjY3IDE4M0wwIDIwNy42NjdWMjMzLjI2N1YyNTlIMTAzLjczM0gyMDcuMzMzTDIzMy43MzMgMjMyLjczM0wyNjAgMjA2LjQ2N1YxNjQuNzMzVjEyM0gyMzcuNzMzSDIxNS4zMzNMMjM3LjczMyAxMDAuNkwyNjAgNzguMzMzM1YzOS4yNjY3VjAuMzMzMzJIMTU2LjRINTIuNjY2N0wyNi4yNjY3IDI2LjZaTTIwMi41MzMgNTMuMTMzM0MyMDQuOCA1My42NjY3IDIwNi42NjcgNTQuNzMzMyAyMDYuNjY3IDU1LjUzMzNDMjA2LjY2NyA1Ni4zMzMzIDE5Ni45MzMgNjYuNzMzMyAxODQuOTMzIDc4LjczMzNMMTYzLjMzMyAxMDAuMzMzSDE0Ni45MzNIMTMwLjY2N1Y4OVY3Ny42NjY3SDEwNS4zMzNIODBWOTEuOTMzM1YxMDYuMzMzTDkyLjI2NjcgMTE4LjZMMTA0LjY2NyAxMzFIMTU1LjZIMjA2LjY2N1YxNjlWMjA3SDEzMC40SDU0TDY3LjMzMzMgMTkzLjY2N0w4MC42NjY3IDE4MC4zMzNIMTI4LjkzM0gxNzcuMzMzVjE2Ny42NjdWMTU1SDEzMy4wNjdIODguNjY2N0w3MS4wNjY3IDEzNy40TDUzLjMzMzMgMTE5LjY2N1Y5N1Y3NC4zMzMzTDYzLjczMzMgNjQuMDY2N0M3Mi41MzMzIDU1LjI2NjcgNzQuOCA1My44IDc5LjMzMzMgNTMuMjY2N0M4OC41MzMzIDUyLjQ2NjcgMTk4LjEzMyA1Mi4zMzMzIDIwMi41MzMgNTMuMTMzM1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="
        },

		{ 	/* лого во вкладке | лого BlurStyle */
			selector: "head > link[rel='shortcut icon']",
			origImage: "/favicon.ico",
			newImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjYwIiBoZWlnaHQ9IjI1OSIgdmlld0JveD0iMCAwIDI2MCAyNTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0yNi4yNjY3IDI2LjZMMCA1Mi44NjY3TDAuMjY2NjY3IDEwNC43MzNMMC42NjY2NjcgMTU2LjZMMjUuMDY2NyAxNTYuNDY3QzM4LjQgMTU2LjQ2NyA0OS4zMzMzIDE1Ni44NjcgNDkuMzMzMyAxNTcuNEM0OS4zMzMzIDE1Ny45MzMgMzguMjY2NyAxNjkuNCAyNC42NjY3IDE4M0wwIDIwNy42NjdWMjMzLjI2N1YyNTlIMTAzLjczM0gyMDcuMzMzTDIzMy43MzMgMjMyLjczM0wyNjAgMjA2LjQ2N1YxNjQuNzMzVjEyM0gyMzcuNzMzSDIxNS4zMzNMMjM3LjczMyAxMDAuNkwyNjAgNzguMzMzM1YzOS4yNjY3VjAuMzMzMzJIMTU2LjRINTIuNjY2N0wyNi4yNjY3IDI2LjZaTTIwMi41MzMgNTMuMTMzM0MyMDQuOCA1My42NjY3IDIwNi42NjcgNTQuNzMzMyAyMDYuNjY3IDU1LjUzMzNDMjA2LjY2NyA1Ni4zMzMzIDE5Ni45MzMgNjYuNzMzMyAxODQuOTMzIDc4LjczMzNMMTYzLjMzMyAxMDAuMzMzSDE0Ni45MzNIMTMwLjY2N1Y4OVY3Ny42NjY3SDEwNS4zMzNIODBWOTEuOTMzM1YxMDYuMzMzTDkyLjI2NjcgMTE4LjZMMTA0LjY2NyAxMzFIMTU1LjZIMjA2LjY2N1YxNjlWMjA3SDEzMC40SDU0TDY3LjMzMzMgMTkzLjY2N0w4MC42NjY3IDE4MC4zMzNIMTI4LjkzM0gxNzcuMzMzVjE2Ny42NjdWMTU1SDEzMy4wNjdIODguNjY2N0w3MS4wNjY3IDEzNy40TDUzLjMzMzMgMTE5LjY2N1Y5N1Y3NC4zMzMzTDYzLjczMzMgNjQuMDY2N0M3Mi41MzMzIDU1LjI2NjcgNzQuOCA1My44IDc5LjMzMzMgNTMuMjY2N0M4OC41MzMzIDUyLjQ2NjcgMTk4LjEzMyA1Mi4zMzMzIDIwMi41MzMgNTMuMTMzM1oiIGZpbGw9IiNGOTdBMUYiLz4KPC9zdmc+Cg=="
		},

		{ 	/* иконка-кнопка с чатом в битве | кастом иконка */
			selector: "#root > div > div > div.BattleChatComponentStyle-rootDesktop > div > div > div.Common-flexCenterAlignCenter > img",
			origImage: "/chatAlert.fac11a72.svg",
			newImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzVweCIgaGVpZ2h0PSIzNXB4IiB2aWV3Qm94PSIwIDAgNjQgNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0iIzAwMDAwMCI+Cgo8ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIvPgoKPGcgaWQ9IlNWR1JlcG9fdHJhY2VyQ2FycmllciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cgo8ZyBpZD0iU1ZHUmVwb19pY29uQ2FycmllciI+IDxkZWZzPiA8c3R5bGU+LmNscy0xe2ZpbGw6I2Y1N2MwMDt9LmNscy0ye2ZpbGw6Izk5OTt9LmNscy0ze2ZpbGw6IzY2Njt9PC9zdHlsZT4gPC9kZWZzPiA8dGl0bGUvPiA8ZyBkYXRhLW5hbWU9Im91dGxpbmUgY29sb3IiIGlkPSJvdXRsaW5lX2NvbG9yIj4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNMjcsNTVhMSwxLDAsMCwxLS40Ny0uMTJBMSwxLDAsMCwxLDI2LDU0VjMxYTEsMSwwLDAsMSwxLTFINTBhMSwxLDAsMCwxLDEsMVY0OGExLDEsMCwwLDEtMSwxSDM2LjI1bC04LjY5LDUuODNBMSwxLDAsMCwxLDI3LDU1Wm0xLTIzVjUyLjEzbDcuMzktNWExLDEsMCwwLDEsLjU1LS4xN0g0OVYzMloiLz4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNTksNjBhMSwxLDAsMCwxLS41Ni0uMTdMNDkuNzUsNTRIMzZhMSwxLDAsMCwxLTEtMXYtLjIyYTEsMSwwLDAsMSwxLTEsMSwxLDAsMCwxLC42My4yMkg1MC4wNmExLDEsMCwwLDEsLjU2LjE3TDU4LDU3LjEyVjM3SDU0YTEsMSwwLDAsMSwwLTJoNWExLDEsMCwwLDEsMSwxVjU5YTEsMSwwLDAsMS0uNTMuODhBMSwxLDAsMCwxLDU5LDYwWiIvPiA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0yMS43Nyw1NS4xYTUsNSwwLDAsMS00LjU3LTNMNC41NiwyMy44M2E1LDUsMCwwLDEsMi41Mi02LjZsMjAuMTctOUExLDEsMCwwLDEsMjguMDcsMTBsLTIwLjE3LDlhMywzLDAsMCwwLTEuNTIsNEwxOSw1MS4zMkEzLDMsMCwwLDAsMjIuNjksNTNhMSwxLDAsMSwxLC42MiwxLjlBNC44NSw0Ljg1LDAsMCwxLDIxLjc3LDU1LjFaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE2Ljc0LDIyLjY4YTEsMSwwLDAsMS0uOTItLjYsMSwxLDAsMCwxLC41MS0xLjMybDguMjEtMy42N2ExLDEsMCwxLDEsLjgyLDEuODNsLTguMjIsMy42N0ExLDEsMCwwLDEsMTYuNzQsMjIuNjhaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTE2LjQ0LDI5LjM4QTEsMSwwLDAsMSwxNiwyNy40N2w2Ljc4LTNhMSwxLDAsMCwxLC44MiwxLjgybC02Ljc4LDNBMSwxLDAsMCwxLDE2LjQ0LDI5LjM4WiIvPiA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik0xOC44OSwzNC44NWExLDEsMCwwLDEtLjQxLTEuOTFsMi4yOS0xYTEsMSwwLDAsMSwuODIsMS44MmwtMi4yOSwxQTEsMSwwLDAsMSwxOC44OSwzNC44NVoiLz4gPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMsNDMuODVhLjg0Ljg0LDAsMCwxLS4yNywwbC0uMzktLjExYTUsNSwwLDAsMS0zLjUtNi4xM0wyNyw3LjY3YTUsNSwwLDAsMSw2LjE0LTMuNTFMNTYuMzEsMTAuNWE0LjksNC45LDAsMCwxLDMsMi4zMyw1LDUsMCwwLDEsLjQ5LDMuOEw1NS41NCwzMi4yNmExLDEsMCwwLDEtMS45Mi0uNTJMNTcuOSwxNi4xMWEzLDMsMCwwLDAtLjI5LTIuMjgsMi45NCwyLjk0LDAsMCwwLTEuODItMS40TDMyLjY1LDYuMDhBMywzLDAsMCwwLDI5LDguMkwyMC43NywzOC4wOWEzLDMsMCwwLDAsMi4xLDMuNjlsLjQuMTFhMSwxLDAsMCwxLS4yNywyWiIvPiA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik00Ny40NiwxNy4zNmExLjI0LDEuMjQsMCwwLDEtLjI3LDBMMzguNTEsMTVhMSwxLDAsMCwxLS43LTEuMjNBMSwxLDAsMCwxLDM5LDEzbDguNjgsMi4zOGExLDEsMCwwLDEtLjI2LDJaIi8+IDxwYXRoIGNsYXNzPSJjbHMtMyIgZD0iTTQ4Ljc3LDIzLjk0YTEuMjQsMS4yNCwwLDAsMS0uMjcsMEwzNCwyMEExLDEsMCwxLDEsMzQuNTYsMThMNDksMjJhMSwxLDAsMCwxLS4yNiwyWiIvPiA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik00MC44NiwyOGEuNzUuNzUsMCwwLDEtLjI2LDBsLTguMTUtMi4yM0ExLDEsMCwwLDEsMzMsMjMuODFMNDEuMTIsMjZhMSwxLDAsMCwxLC43MSwxLjIyQTEsMSwwLDAsMSw0MC44NiwyOFoiLz4gPC9nPiA8L2c+Cgo8L3N2Zz4="
		}
    ];

    function replaceChecker() {
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                replaceImages();
            }
        });
    });

    observer.observe(document, { attributes: true, attributeFilter: ['src'], subtree: true });
    }

	function replaceImages() {
		replaceToUri.forEach((data) => {
			const element = document.querySelector(data.selector);
			if (element) {
				replaceImage(element, data);
			}
		});
	}

	/* массив стилей */
	function styles()
	{
		const elements = [
			{ /* logo аним фрейм */
				cssStyles: `
					@keyframes logoAnim {
						0%, 100% {
							transform: scale(0.7);
                            filter: drop-shadow(0rem 0rem 0.5rem rgba(255, 165, 0, 1))
						}
						50% {
							transform: scale(0.5);
                            filter: drop-shadow(0rem 0rem 0.5rem rgba(255, 165, 0, 0))
						}
					}

					.LobbyLoaderComponentStyle-logo {
						animation: logoAnim 2s infinite;
						position: relative;
					}
				`
			},

			{ /* fade аним фрейм */
				cssStyles: `
					@keyframes fadeIn {
						from {
							opacity: 0;
						}
						to {
							opacity: 1;
						}
					}

					.fade {
						animation: fadeIn 0.65s ease;
					}
				`
			},

			{ /* scale аним фрейм */
				cssStyles: `
					@keyframes scaleIn {
						0% {
							transform: scale(0.9);
						}
						50% {
							transform: scale(1.025);
						}
						100% {
							transform: scale(1);
						}
					}

					.scale {
						animation: scaleIn 0.7s ease-in-out;
					}
				`
			},

			{ /* slide аним фрейм */
				cssStyles: `
					@keyframes slideIn {
						0% {
						opacity: 0.5;
						transform: translateY(20%);
						}
						100% {
						opacity: 1;
						transform: translateY(0);
						}
					}


					.slideIn {
						animation: slideIn 0.4s ease-out;
					}
				`
			},

			{ /* стилизация body */
				tag: ["QS"],
				selector: "body",
				styles:
				{
					background: "black"
				}
			},

            { /* фикс страницы ТСТО из-за стилизации body */
                tag: ["QS"],
                selector: "body > div.content-wrapper > main",
                styles:
                {
                    background: "black"
                }
            },

			{ /* стилизация общего блока */
				tag: ["QS"],
				selector: ".Common-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgb(0, 0, 0, 1) 0%, rgb(0, 0, 0, 1) 0%)"
				}
			},

			{ /* стилизация первоначального экрана */
				tag: ["QS"],
				selector: ".Common-entranceGradient",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgb(0, 0, 0, 1) 0%, rgb(0, 0, 0, 1) 0%)"
				}
			},

			{ /* стилизация первоначального экрана */
				tag: ["QS", "scale"],
				selector: ".MainEntranceComponentStyle-mainContainer",
				styles:
				{
					zIndex: "999"
				}
			},

			{ /* стилизация раздела с челленджами */
				cssStyles: `
					div.QuestsChallengesComponentStyle-containerParametrsChallenge > div:nth-child(5) {
						display: none !important;
					}
				`
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "BHV", "fade"],
				selector: ".InputComponentStyle-input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".SecuritySettingsComponentStyle-activation2FaButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "fade"],
				selector: ".SettingsComponentStyle-scrollingMenu",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
                    overflow: "hidden auto"
				}
			},

			{ /* стилизация чата в битве */
			tag: ["QS", "slide"],
			selector: ".BattleChatComponentStyle-inputContainerAllies",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация чата в битве */
			tag: ["QS", "slide"],
			selector: ".BattleChatComponentStyle-inputContainerAll",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация чата в битве */
			tag: ["QS"],
			selector: ".BattleChatComponentStyle-btnToggleTeamAllies",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация чата в битве */
			tag: ["QS"],
			selector: ".BattleChatComponentStyle-btnToggleTeamAll",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация таба в битве */
				tag: ["QS", "scale"],
				selector: ".BattleTabStatisticComponentStyle-containerInsideTeams",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация таба в битве */
				tag: ["QS", "scale"],
				selector: ".BattleTabStatisticComponentStyle-containerInsideResults",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация таба в битве */
				tag: ["QS"],
				selector: ".BattleTabStatisticComponentStyle-header",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация игроков в табе */
				tag: ["QSA", "BHV"],
				selector: ".BattleTabStatisticComponentStyle-rowBackGround",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.05rem rgba(0,0,0,0.170)",
					marginBottom: "0.50%",
					top: "0.5rem"
				}
			},

			{ /* стилизация игроков в табе */
				tag: ["QSA"],
				selector: ".BattleTabStatisticComponentStyle-scoreCell",
				styles:
				{
					borderLeft: "none"
				}
			},

			{ /* стилизация игроков в табе */
				tag: ["QSA"],
				selector: ".BattleTabStatisticComponentStyle-dlCell",
				styles:
				{
					borderLeft: "none"
				}
			},

			{ /* стилизация игрока в табе */
				tag: ["QS", "BHV"],
				selector: ".BattleTabStatisticComponentStyle-selectedRowBackGround",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.075) 0%)",
					backdropFilter: "blur(2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.05rem rgba(0,0,0,0.170)",
					marginBottom: "0.50%",
					top: "0.5rem"
				}
			},

			{ /* стилизация окна поиска битвы */
				tag: ["QS", "slide"],
				selector: ".MatchmakingWaitComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.150) 0%, rgba(0, 0, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					left: "36vw",
					top: "8vw",
					width: "27.8vw",
					height: "7.4vw",
					zIndex: "5"
				}
			},

			{ /* стилизация окна поиска битвы */
				tag: ["QS", "fade"],
				selector: ".MatchmakingWaitComponentStyle-contentContainer",
				styles:
				{
					position: "absolute",
					transform: "scale(1.1)",
					top: "27%",
					width: "20.75rem"
				}
			},

			{ /* стилизация окна поиска битвы */
			tag: ["QS"],
			selector: "#root > div.MatchmakingWaitComponentStyle-container.slideIn > div.MatchmakingWaitComponentStyle-contentContainer > div.MatchmakingWaitComponentStyle-currentTimeContainer > div > span",
			styles:
				{
					fontSize: "1rem"
				}
			},

			{ /* стилизация окна поиска битвы */
				tag: ["QS"],
				selector: "div.MatchmakingWaitComponentStyle-container > div",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация окна поиска битвы */
				tag: ["QS", "BHV", "fade"],
				selector: ".MatchmakingWaitComponentStyle-cancelButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 1rem 0.10rem rgba(0, 0, 0, 0.6), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "absolute",
					right: "2%",
					top: "4rem",
					height: "3.5rem",
					width: "8rem"
				}
			},

			{ /* стилизация окна поиска битвы */
				tag: ["QS"],
				selector: "div.MatchmakingWaitComponentStyle-cancelButton > span",
				styles:
				{
					margin: "0"
				}
			},

			{ /* стилизация окна поиска битвы */
			tag: ["QS"],
			selector: "#root > div.Common-container > div.Common-blockCenter.MainScreenComponentStyle-containerForMenuGradient > div.Common-displayFlex > div > div.Common-backgroundImageContain",
			styles:
				{
					position: "absolute",
					top: "1.5rem",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация окна поиска битвы */
			tag: ["QS"],
			selector: "#root > div.Common-container > div.Common-blockCenter.MainScreenComponentStyle-containerForMenuGradient > div.Common-displayFlex > div > h3",
			styles:
				{
					top: "calc(50% - 0.5em + 2.438em)",
					color: "rgba(255, 255, 255, 1)"
				}
			},

			{ /* стилизация раздела с битвами */
			cssStyles: `
				.InputComponentStyle-blurBackground {
					display: none !important;
				}
			`
			},

            { /* стилизация раздела с битвами */
			cssStyles: `
				.UsersTableStyle-scrollCommandTable:hover {
					scrollbar-width: thin !important;
				}
			`
			},

			{ /* стилизация раздела с битвами */
			tag: ["QSA", "BHV", "scale", "scale3d"],
			selector: ".Common-backgroundImageCover.modeLimitIcon",
			styles:
				{
					border: "0.150rem solid rgba(0, 0, 0, 1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QSA", "BHV", "scale", "scale3d"],
			selector: ".BattleCreateComponentStyle-blockCard .Common-flexStartAlignStretchColumn .Common-backgroundImageCover",
			styles:
				{
					border: "0.150rem solid rgba(0, 0, 0, 1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QSA", "BHV", "scale", "scale3d"],
			selector: ".BattleCreateComponentStyle-scrollBattlePick .Common-flexStartAlignStretchColumn .blockCard",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
			cssStyles: `
				.ProBattlesComponentStyle-borderLineCell {
					border-left: none !important;
				}
			`
			},

			{ /* стилизация увед точек */
			tag: ["QSA", "fade"],
			selector: ".MainScreenComponentStyle-new.FooterComponentStyle-marginEllips",
			styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед точек в настройках */
			tag: ["QSA", "fade"],
			selector: "li.SettingsMenuComponentStyle-menuItemOptions > div.ItemNotificationMarkerStyle-base",
			styles:
				{
					filter: "saturate(0)",
					top: "15%"
				}
			},

			{ /* стилизация увед точек */
				tag: ["QSA", "fade"],
				selector: ".ItemNotificationMarkerStyle-base",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед количества в режимах */
			tag: ["QSA", "fade"],
			selector: ".ScrollingCardsComponentStyle-cardCount",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
				}
			},

			{ /* стилизация увед количества каток в разделе с битвами */
			tag: ["QSA", "fade"],
			selector: ".FormatsSectionComponentStyle-numberBattles",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
				}
			},

			{ /* стилизация увед точек */
			tag: ["QSA", "fade"],
			selector: "div.MenuComponentStyle-battleTitleCommunity > div > span",
			styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед скидок */
				tag: ["QSA", "fade"],
				selector: ".Common-discount",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед скидок */
				tag: ["QSA", "fade"],
				selector: ".SquarePriceButtonComponentStyle-discountLabel",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед скидок */
				tag: ["QSA", "fade"],
				selector: ".SuppliesComponentStyle-discountLabel",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед скидок */
				tag: ["QS", "fade"],
				selector: "div.GarageCommonStyle-animatedBlurredLeftBlock > div > img",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация увед скидок */
				tag: ["QSA", "fade"],
				selector: ".GarageCommonStyle-discountLabel",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация кнопки забрать все в контах */
				tag: ["QS", "BHV", "fade"],
				selector: ".SuperMissionComponentStyle-buttonCollect",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация шапки новостного меню */
				tag: ["QS"],
				selector: ".NewsComponentStyle-header",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация новостного меню */
				tag: ["QS"],
				selector: ".NewsComponentStyle-newsWindow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 0%)",
					borderRight: "0.150rem solid rgba(255, 255, 255, 0.2)",
					animation: "fadeIn 0.3s ease-in-out"
				}
			},

			{ /* стилизация новостного меню */
			tag: ["QSA"],
			selector: ".NewsComponentStyle-newsItemContainer",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация новостного меню */
			tag: ["QSA"],
			selector: "div.NewsComponentStyle-newsItemDate > img",
			styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация новостного меню */
				tag: ["QS", "fade"],
				selector: ".NewsComponentStyle-closeArea",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)"
				}
			},

			{ /* стилизация шапки блока с чатом */
				tag: ["QS", "fade"],
				selector: ".ChatComponentStyle-upMenu",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)"
				}
			},

			{ /* стилизация ресайз полоски с чатом */
			tag: ["QS"],
			selector: ".ChatComponentStyle-chatResize",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)"
				}
			},

			{ /* стилизация блока с чатом */
				tag: ["QS", "BHV"],
				selector: ".ChatComponentStyle-channelSelect",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.8rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "0.6rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация блока с чатом */
				tag: ["QS"],
				selector: ".ChatComponentStyle-chatWindow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.3) 0%)",
					backdropFilter: "blur(1rem)",
					animation: "fadeIn 0.3s ease-in-out"
				}
			},

			{ /* стилизация сообщений в блоке с чатом */
				tag: ["QSA", "BHV", "scale"],
				selector: ".ChatComponentStyle-messageRow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.8rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "12px",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация блока с чатом */
				tag: ["QS", "fade"],
				selector: ".ChatComponentStyle-closeArea",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)"
				}
			},

			{ /* стилизация логотипа в шапке */
			tag: ["QS"],
			selector: ".UserInfoContainerStyle-blockForIconTankiOnline",
			styles:
				{
					display: "none"
				}
			},

			{ /* стилизация кнопки играть в главном меню */
				tag: ["QS", "BHV", "scale", "scale3d"],
				selector: ".MainScreenComponentStyle-playButtonContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.150) 0%, rgba(0, 0, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem 2rem 2rem 2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "fixed",
					height: "5.4vw",
					width: "28vw",
					top: "2vw",
					left: "36vw"
				}
			},

			{ /* стилизация кнопки играть в главном меню */
				cssStyles: `
				.MainScreenComponentStyle-playButtonContainer > span {
					color: rgba(255, 255, 255, 1) !important;
				}
			`
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".LargeShowcaseItemComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{	/* стилизация разделов в главном меню */
				tag: ["QSA", "BHV", "fade", "scale3d"],
				selector: ".PrimaryMenuItemComponentStyle-itemCommonLi.PrimaryMenuItemComponentStyle-menuItemContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "1vw",
					height: "5vw",
					width: "20vw",
					right: "1.88vw",
					bottom: "5.1rem"
				}
			},

			{	/* стилизация разделов в главном меню */
				tag: ["QSA", "fade"],
				selector: "#root > div > div.Common-blockCenter.MainScreenComponentStyle-containerForMenuGradient > div.MainScreenComponentStyle-blockMainMenu > ul > li > div",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация разделов в главном меню */
				tag: ["QSA", "fade"],
				selector: ".PrimaryMenuItemComponentStyle-notificationIconNewNews",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация иконок в табе */
				tag: ["QSA", "fade"],
				selector: ".Common-maskImageContain.BattleTabStatisticComponentStyle-colorIconBattleOptions",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация нижних разделов в лобби */
			tag: ["QS"],
			selector: ".FooterComponentStyle-footer",
			styles:
				{
					height: "10rem"
				}
			},

			{ /* стилизация нижних разделов в лобби */
			tag: ["QS", "fade"],
			selector: "#root > div > div.Common-blockCenter.MainScreenComponentStyle-containerForMenuGradient > footer > ul",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-end",
					position: "absolute",
					bottom: "1.5vw",
					left: "-1.95vw",
					width: "20.4vw"
				}
			},

			{ /* стилизация нижних разделов в лобби */
			tag: ["QSA", "BHV", "fade", "scale3d"],
			selector: ".FooterComponentStyle-containerMenu",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.050)",
					borderRadius: "4.5rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginRight: "0.6rem",
					width: "4.5rem",
					height: "4.5rem",
					bottom: "0.150rem",
					left: "0.250vw",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация промежуточного загрузочного экрана */
				tag: ["QS", "fade"],
				selector: ".LobbyLoaderComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.6) 0%)",
					backdropFilter: "blur(0.5rem)"
				}
			},

			{ /* стилизация диалоговых окон */
				tag: ["QS", "scale"],
				selector: ".DialogContainerComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					outline: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация диалоговых окон */
				tag: ["QS", "BHV", "fade"],
				selector: ".DialogContainerComponentStyle-keyButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация диалоговых окон */
				tag: ["QS", "BHV", "fade"],
				selector: ".DialogContainerComponentStyle-enterButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 128, 0, 0.150) 0%, rgba(0, 128, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QS"],
				selector: ".MainScreenComponentStyle-containerPanel",
				styles:
				{
					background: "none",
					border: "none"
						/* backdropFilter: "blur(0.5rem)",
						border: "0.150rem solid rgba(255, 255, 255, 0.1)",
						borderBottomLeftRadius: "2rem",
						borderBottomRightRadius: "2rem",
						width: "99.7%",
						boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)" */
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QS", "fade"],
				selector: ".MainScreenComponentStyle-containerPanel .UserInfoContainerStyle-blockLeftPanel",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "fixed",
					left: "2vw",
					width: "33rem",
					height: "5.2vw",
					top: "2vw"
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QS", "fade"],
				selector: ".MainScreenComponentStyle-containerPanel .UserScoreComponentStyle-blockRightPanel",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "fixed",
					right: "2vw",
					width: "33rem",
					height: "5.2vw",
					top: "2vw"
				}
			},

			{ /* стилизация шапки в главном меню игры */
			tag: ["QSA"],
			selector: ".UserScoreComponentStyle-addCoinCrystal",
			styles:
				{
					position: "initial"
				}
			},

			{ /* стилизация элементов в главном меню игры */
				tag: ["QS"],
				selector: ".ChallengeTimerComponentStyle-textTime",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					height: "1.3rem",
					transform: "scale(0.94)"
				}
			},

			{ /* стилизация элементов в главном меню игры/заданках */
			tag: ["QSA"],
			selector: ".BattlePickComponentStyle-timerButton, .MainQuestComponentStyle-commonBlockTimerButton",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация элементов в главном меню игры */
				tag: ["QSA"],
				selector: ".PrimaryMenuItemComponentStyle-discountNotification",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					borderRadius: "1rem",
					height: "1.7rem",
					transform: "scale(0.94)",
					right: "2rem"
				}
			},

			{ /* стилизация элементов в разделе магаза */
				tag: ["QS"],
				selector: ".BasePaymentComponentStyle-backButtonContainer",
				styles:
				{
					background: "none",

				}
			},

			{ /* стилизация элементов в разделе магаза */
				tag: ["QS", "fade"],
				selector: ".Common-flexSpaceBetweenAlignStretchColumn.Common-flexWrapNowrap.Common-overflowScrollFriends",
				styles:
				{
					background: "none",

				}
			},

			{ /* стилизация элементов в разделе магаза */
			tag: ["QS", "fade"],
			selector: ".CoinPaymentComponentStyle-noScroll",
			styles:
				{
					background: "none",

				}
			},

			{ /* стилизация элементов в разделе магаза */
				tag: ["QS", "BHV", "fade"],
				selector: ".BasePaymentComponentStyle-backButtonContainer .Common-flexCenterAlignCenter.Common-whiteSpaceNoWrap",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация элементов в разделе магаза */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ChoosePaymentMethodComponentStyle-paymentModeContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					height: "2.9rem"
				}
			},

			{ /* стилизация элементов в разделе магаза */
				tag: ["QSA"],
				selector: ".ChoosePaymentMethodComponentStyle-paymentModeContainer .ChoosePaymentMethodComponentStyle-paymentModePreview",
				styles:
				{
					borderRadius: "0.8rem"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QS"],
			selector: ".IconStyle-iconAddBattle",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QS"],
			selector: ".ProBattlesComponentStyle-createBattleButton > h3",
			styles:
				{
					borderRadius: "1rem"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QS", "fade"],
			selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn",
			styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "none",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)",
					marginBottom: "0.8rem"
				}
			},

			{ /* стилизация раздела с битвами */
				cssStyles: `
					.BattleInfoComponentStyle-blockSelectedOptionsSettings {
						box-shadow: none !important;
					}
				`
			},

			{ /* стилизация раздела с битвами */
			tag: ["QS"],
			selector: ".BattleInfoComponentStyle-selectBattle.Common-backgroundImageCover.Common-backgroundImage",
			styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QS", "RHV"],
			selector: ".BattleModesComponentStyle-button .Common-flexCenterAlignCenter, .Common-flexStartAlignStartColumn .BattleModesComponentStyle-button, .BattleModesComponentStyle-fund",
			styles: {}
			},

			{ /* стилизация раздела с битвами */
			tag: ["QSA", "RHV"],
			selector: ".BattleOptionsSectionComponentStyle-checkBoxSettingsCreateBattle .Common-flexSpaceBetweenAlignCenter",
			styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация элементов в главном меню игры */
				tag: ["QS"],
				selector: ".AnnouncementHomeScreenComponentStyle-headerTimer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					height: "1.3rem",
					transform: "scale(0.94)"
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QSA", "RHV"],
				selector: ".HeaderCommonStyle-icons",
				styles:
				{
					justifyContent: "center",
					border: "none"
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QS"],
				selector: "div.UserScoreComponentStyle-blockRightPanel > div",
				styles:
				{
					flexDirection: "initial"
				}
			},

			{ /* стилизация шапки во всех меню игры */
			tag: ["QS"],
			selector: ".BreadcrumbsComponentStyle-rightButtonsContainer > div",
			styles:
				{
					transform: "scale(1.1)",
					flexDirection: "initial"
				}
			},

			{ /* стилизация шапки во всех меню игры */
				tag: ["QS", "fade"],
				selector: ".BreadcrumbsComponentStyle-headerContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0px solid rgba(255, 255, 255, 0.150)",
				}
			},

			{ /* стилизация туториал всплывашек */
				tag: ["QS", "fade"],
				selector: ".TutorialModalComponentStyle-contentWrapper",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderLeft: "0.150rem solid rgba(255, 255, 255, 0.1)",
					animation: "none"
				}
			},

			{ /* стилизация туториал всплывашек */
				tag: ["QSA", "BHV", "fade"],
				selector: ".TutorialModalComponentStyle-navigationButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация лобби-меню в главном меню */
				tag: ["QS", "slide"],
				selector: ".InvitationWindowsComponentStyle-commonItem",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					top: "8vw",
					left: "2vw",
					width: "33rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* фикс иконок в шапке */
				tag: ["QS", "fade"],
				selector: ".BreadcrumbsComponentStyle-iconLogout",
				styles:
				{
					borderRadius: "none"
				}
			},

			{ /* фикс иконок в шапке */
				tag: ["QS", "fade"],
				selector: ".Common-backgroundImageCover",
				styles:
				{
					borderRadius: "none"
				}
			},

			{ /* фикс иконок в шапке */
				tag: ["QS", "fade"],
				selector: ".Common-backgroundImageContain",
				styles:
				{
					borderRadius: "none"
				}
			},

			{ /* фикс иконок в шапке */
				tag: ["QS", "fade"],
				selector: ".IconStyle-iconLogOff",
				styles:
				{
					borderRadius: "none"
				}
			},

			{ /* стилизация лобби-меню в главном меню */
				tag: ["QSA", "RHV"],
				selector: ".InvitationWindowsComponentStyle-commonItem *",
				styles:
				{
					border: "none"
				}
			},

			{ /* стилизация кланового диалогового окна */
				tag: ["QS", "scale"],
				selector: ".ClanCreateComponentStyle-blockCreatureClan",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "60%"
				}
			},

			{ /* стилизация кланового диалогового окна */
			tag: ["QS"],
			selector: ".ClanCreateComponentStyle-rectangle",
			styles:
				{
					background: "none"
				}
			},

			{ /* стилизация кланового диалогового окна */
			tag: ["QS"],
			selector: ".ClanCreateComponentStyle-descriptionInfo",
			styles:
				{
					background: "none"
				}
			},

			{ /* стилизация кланового диалогового окна */
			tag: ["QS"],
			selector: ".ClanCreateComponentStyle-containerButtons",
			styles:
				{
					background: "none"
				}
			},

			{ /* стилизация чекбоксов */
				cssStyles: `
					.CheckBoxStyle-checkbox > label > span:not(#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm > form > div.EntranceComponentStyle-blockCheckedLink.Common-flexStartAlignStartColumn > div.EntranceComponentStyle-checkbox > div > label > span) {
						background: radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%);
						border: 0.150rem solid rgba(255, 255, 255, 0.2);
						border-radius: 1.2rem;
					}

					.CheckBoxStyle-checkbox > label > span:not(#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm > form > div.EntranceComponentStyle-blockCheckedLink.Common-flexStartAlignStartColumn > div.EntranceComponentStyle-checkbox > div > label > span)::before {
						background: radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 0%);
						margin-top: 0.2rem;
						border-radius: 5rem;
						height: 1.1rem;
						width: 1rem;
					}
				`
			},

			{ /* стилизация меню челленджа */
				tag: ["QS", "BHV", "fade", "scale3d"],
				selector: ".BattlePassLobbyComponentStyle-menuBattlePass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.150) 0%, rgba(0, 0, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "absolute",
					margin: "0",
					top: "16.9rem",
					right: "2vw"
				}
			},

			{ /* стилизация меню челленджа */
				tag: ["QSA"],
				selector: ".BattlePassLobbyComponentStyle-blockBattlePass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "none",
					right: "0.1rem"
				}
			},

			{ /* стилизация меню челленджа */
				tag: ["QSA"],
				selector: ".BattlePassLobbyComponentStyle-commonDescription",
				styles:
				{
					borderRight: "none"
				}
			},

			{ /* стилизация инфо-всплывашки в разделе гаража */
				tag: ["QS", "fade"],
				selector: ".ItemDescriptionComponentStyle-commonBlockModal",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderLeft: "0.150rem solid rgba(255, 255, 255, 0.1)"
				}
			},

			{ /* стилизация ивентового меню челленджа */
				tag: ["QS", "BHV", "fade", "scale3d"],
				selector: ".EventBattlePassLobbyComponentStyle-buttonEventBattlePass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.150) 0%, rgba(0, 0, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					position: "absolute",
					top: "33rem",
					width: "21.5rem",
					right: "2vw"
				}
			},

			{ /* стилизация ивентового меню челленджа */
				tag: ["QS"],
				selector: ".EventBattlePassLobbyComponentStyle-commonBlockProgressBar",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* фикс ивентового блока */
			tag: ["QS"],
			selector: ".AnnouncementComponentStyle-extContent",
			styles:
				{
					zIndex: "1"
				}
			},

			{ /* стилизация рекламного блока в мейн меню */
				tag: ["QS", "BHV", "fade", "scale3d"],
				selector: ".AnnouncementHomeScreenComponentStyle-mainContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.150) 0%, rgba(0, 0, 0, 0.150) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					bottom: "2.79rem"
				}
			},

			{ /* фикс стилизации анонс блока в главном меню */
				cssStyles: `
					.AnnouncementHomeScreenComponentStyle-announceContainer {
						background: linear-gradient(rgba(0, 25, 38, 0) 0%, rgb(0, 25, 38) 100%) !important;
						border: none !important;
						border-radius: 0rem !important;
						transform: none !important;
					}
				`
			},

			{ /* стилизация рекламного блока в мейн меню */
				cssStyles: `
					.AnnouncementHomeScreenComponentStyle-announceDescriptionContainer {
						border-top-left-radius: 0.85rem !important;
    					border-top-right-radius: 0.85rem !important;
					}
				`
			},

			{ /* стилизация рекламного блока в мейн меню */
				tag: ["QS"],
				selector: "#root > div > div.AnnouncementHomeScreenComponentStyle-mainContainer > div.Common-flexCenterAlignCenterColumn",
				styles:
				{
					borderBottomLeftRadius: "1rem",
					borderBottomRightRadius: "1rem",
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)"
				}
			},

			{ /* скрытие анимации загрузки в промежуточном загрузочном экране */
				tag: ["QS"],
				selector: ".LobbyLoaderComponentStyle-loaderContainer",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация окна с премом в главном меню */
				tag: ["QS", "scale"],
				selector: ".ModalStyle-rootHover .Common-displayFlex:first-child",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(1rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.050)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация кнопки купить прем */
				tag: ["QS", "BHV", "fade"],
				selector: ".UserTitleComponentStyle-premiumButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.150)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация кнопки в шапке с премом в главном меню игры */
				tag: ["QS", "RHV"],
				selector: "#root > div > div.Common-flexStartAlignStart > div.MainScreenComponentStyle-containerPanel > div.UserInfoContainerStyle-blockLeftPanel > div > div",
				styles:
				{
					background: "none",
					border: "none",
					boxShadow: "none"
				}
			},

			{ /* стилизация шапки в главном меню игры */
				tag: ["QS", "RHV"],
				selector: ".UserInfoContainerStyle-blockLeftPanel .UserInfoContainerStyle-containerProgressMainScreen",
				styles:
				{
					position: "absolute",
					left: "18rem"
				}
			},

			{ /* стилизация выпадающих менюшек*/
				tag: ["QS", "slide"],
				selector: ".ContextMenuStyle-menu",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.3rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.050)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация диалоговых окон с контекстом */
				tag: ["QSA", "RHV"],
				selector: ".ContextMenuStyle-menu *",
				styles:
				{}
			},

			{ /* стилизация всплывающих подсказок */
				tag: ["QS", "scale"],
				selector: ".TooltipStyle-tooltip",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
                    filter: "saturate(0)"
				}
			},

			{ /* стилизация карточек в режимах битв */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "20px",
					backdropFilter: "blur(1rem)",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.5)",
				}
			},

			{ /* стилизация хоткеев */
				tag: ["QSA", "fade"],
				selector: ".MainQuestComponentStyle-timerData",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
						borderRadius: "1.1rem"
					}
			},

			{ /* стилизация хоткеев */
				tag: ["QSA", "fade"],
				selector: ".HotKey-commonBlockForHotKey",
				styles:
				{
					borderRadius: "1.1rem",
					transform: "scale(0.94)"
				}
			},

			{ /* стилизация хоткеев */
				tag: ["QSA", "fade"],
				selector: ".HotKey-inlineBlockForHotKey",
				styles:
					{
						borderRadius: "1.1rem",
						transform: "scale(0.94)"
					}
			},

			{ /* стилизация хоткеев */
				tag: ["QS", "fade"],
				selector: ".ApplicationLoaderComponentStyle-helpChangeKey",
				styles:
				{
					borderRadius: "1rem",
				}
			},

			{ /* стилизация хоткеев */
				tag: ["QSA", "fade"],
				selector: ".Common-buttonQE",
				styles:
				{
					borderRadius: "1.1rem",
					transform: "scale(0.94)"
				}
			},

			{ /* стилизация хоткеев */
				tag: ["QSA", "fade"],
				selector: "div.BreadcrumbsComponentStyle-backButton > h3",
				styles:
				{
					borderRadius: "1.1rem",
					transform: "scale(0.94)"
				}
			},

			{ /* дел бордеров из шапки в главном меню */
				tag: ["QSA", "RHV"],
				selector: ".MainScreenComponentStyle-containerPanel *",
				styles:
				{
					border: "none",
					boxShadow: "none"
				}
			},

			{ /* дел бордеров из шапки во всех разделах */
				tag: ["QSA", "RHV"],
				selector: ".BreadcrumbsComponentStyle-headerContainer *",
				styles:
				{
					border: "none",
					boxShadow: "none"
				}
			},

			{ /* дел бордера из прем окна */
				tag: ["QS"],
				selector: "#modal-root > div > div > div.Common-flexCenterAlignCenterColumn",
				styles:
				{
					border: "none",
				}
			},

			{ /* дел разделителя с блока под шапкой во всех разделах */
				tag: ["QS"],
				selector: ".MenuComponentStyle-decorLineMenu",
				styles:
				{
					display: "none",
				}
			},

			{ /* мыло на бэкграунд модальных окон */
				tag: ["QS", "fade"],
				selector: ".ModalStyle-rootHover",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
				}
			},

			{ /* стилизация модального окна покупки в магазе */
				tag: ["QS", "scale"],
				selector: ".SuccessfulPurchaseComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация модального окна покупки в магазе */
				tag: ["QS", "BHV", "fade"],
				selector: ".SuccessfulPurchaseComponentStyle-container .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "scale"],
				selector: ".ChangeOwnerDialogComponentStyle-container ",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
						backdropFilter: "blur(0.5rem)",
						outline: "0.150rem solid rgba(255, 255, 255, 0.1)",
						borderRadius: "1.2rem",
						boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
					}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ClanInvitationsItemComponentStyle-buttonReject",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS"],
				selector: ".ClanInvitationsComponentStyle-invitationsLine",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "scale"],
				selector: ".ClanInvitationsComponentStyle-invitationContent",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0.75), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS"],
				selector: ".ClanCommonStyle-content",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
					}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanInvitationsComponentStyle-buttonDeclineAll",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
						backdropFilter: "blur(0.5rem)",
						border: "0.150rem solid rgba(255, 255, 255, 0.2)",
						borderRadius: "1.1rem",
						boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
					}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ClanCommonStyle-buttonSendRequest",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
						backdropFilter: "blur(0.5rem)",
						border: "0.150rem solid rgba(255, 255, 255, 0.2)",
						borderRadius: "1.1rem",
						boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
					}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: "#modal-root > div > div > div.ClanCommonStyle-members.ClanInvitationsListComponentStyle-members > table > thead > tr",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA"],
				selector: "#modal-root > div > div > div.ClanCommonStyle-members.ClanInvitationsListComponentStyle-members > table > thead > tr *",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: "#root > div > div > div.ClanCommonStyle-members > table > thead > tr",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
						backdropFilter: "blur(0.5rem)",
						border: "0.150rem solid rgba(255, 255, 255, 0.2)",
						borderRadius: "1.1rem",
						boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
					}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA"],
				selector: "#root > div > div > div.ClanCommonStyle-members > table > thead > tr *",
				styles:
					{
						background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
					}
			},

			{ /* стилизация раздела званок */
				tag: ["QS", "scale"],
				selector: ".UserProgressComponentStyle-modalWrapper",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "72%"
				}
			},

			{ /* стилизация одного из модальных окон */
				tag: ["QS", "fade"],
				selector: "#modal-root > div > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "none",
					borderRadius: "1.2rem",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0rem 0rem rgba(0,0,0,0)",
				}
			},

			{ /* стилизация карточек в кнопке играть */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".BattlePickComponentStyle-commonStyleBlock.cardImgEvents",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.1rem rgba(0, 0, 0, 0.75)"
				}
			},

			{ /* стилизация списка заявок в друзья */
				tag: ["QS", "fade"],
				selector: ".FriendRequestComponentStyle-cellName",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "-1%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация списка заявок в друзья */
				tag: ["QS", "fade"],
				selector: ".FriendRequestComponentStyle-cellActions",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "-1%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация списка заявок в друзья */
				tag: ["QSA", "BHV", "fade"],
				selector: ".TableComponentStyle-row",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "0.50%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},


			{ /* стилизация кнопочек в списке заявок в друзья */
				tag: ["QSA", "BHV", "fade"],
				selector: ".FriendRequestComponentStyle-buttonDecline",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0.2) 0%, rgba(255, 0, 0, 0.150) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "0.50%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация кнопочек в списке заявок в друзья */
				tag: ["QSA", "BHV", "fade"],
				selector: ".FriendRequestComponentStyle-buttonAccept",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(60, 179, 113, 0.2) 0%, rgba(60, 179, 113, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "0.50%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация списка заявок в друзья */
				tag: ["QS"],
				selector: ".TableComponentStyle-thead",
				styles:
				{
					marginBottom: "0.725rem"
				}
			},

			{ /* стилизация кнопочек в списке заявок в друзья */
				tag: ["QS", "BHV", "fade"],
				selector: ".FriendRequestComponentStyle-buttonDeclineAll",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0.150) 0%, rgba(255, 0, 0, 0.150) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "0.50%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация кнопочек в списке заявок в друзья */
				tag: ["QS"],
				selector: ".FriendRequestComponentStyle-buttonDeclineAllInvisible",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					marginBottom: "0.50%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация списка друзей */
				tag: ["QSA", "BHV", "fade"],
				selector: ".FriendListComponentStyle-blockList.nickNameClass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.4rem",
					marginBottom: "-1%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация списка друзей */
				tag: ["QSA"],
				selector: ".FriendListComponentStyle-stringCommunity",
				styles:
				{
					paddingTop: "0.5rem"
				}
			},

			{ /* стилизация прогресса возле званки */
				cssStyles: `
					div.UserInfoContainerStyle-containerProgressMainScreen > div.Common-flexStartAlignStartColumn {
						background: rgba(222, 184, 135, 0.3) !important;
						backdrop-filter: blur(0.1rem);
					}

					div.UserInfoContainerStyle-containerProgressMainScreen > div.Common-flexStartAlignStartColumn::after {
						background: rgba(222, 184, 135, 1) !important;
						filter: saturate(1.5) drop-shadow(0rem 0rem 0.2rem rgba(255, 165, 0, 1));
						box-shadow: rgba(222, 184, 135, 1) 0em 0em 0.275em 0em;
					}

					.UserInfoContainerStyle-xpIcon {
						filter: saturate(0);
					}

					div.UserInfoContainerStyle-progressValue {
						color: rgba(255, 255, 255, 1) !important;
					}

					div.UserInfoContainerStyle-progressValue > span {
						color: rgba(255, 255, 255, 1) !important;
					}
				`
			},

			{ /* стилизация прогресса возле званки */
				cssStyles: `
					/* LGBT animation */
					td.BattleTabStatisticComponentStyle-gsCell > span.GearScoreStyle-bestGS.bgClipText, div.TankParametersStyle-marginBlockGear > span.GearScoreStyle-bestGS, span.GearScoreStyle-bestGS.bgClipText {
						color: rgba(255,255,255,0.1);
						background: #ed8080;
						background: -webkit-gradient(linear, left top, right top, color-stop(0%,#ed8080), color-stop(16%,#2a77d6), color-stop(32%,#5eb524), color-stop(48%,#eacd25), color-stop(64%,#ed8080), color-stop(80%,#2a77d6), color-stop(100%,#5eb524));
						background-size: 300% 300%;
						-webkit-background-clip: text;
						background-repeat: no-repeat;
						background-position: top left;
						background-color: #222;
						animation:LGBT infinite 3s linear;
					}

					@keyframes LGBT {
						0% {
							background-position: top left;
						}
						100% {
							background-position: top right;
						}
					}
				`
			},

			{ /* стилизация списка друзей */
				tag: ["QSA"],
				selector: ".FriendListComponentStyle-substrateRhombus",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
				}
			},

			{ /* стилизация кнопочек в разделе друзей */
				tag: ["QS", "fade", "BHV"],
				selector: ".FriendListComponentStyle-buttonCloseAddFriends",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.5)"
				}
			},

			{ /* стилизация кнопочек в разделе друзей */
				tag: ["QS", "fade", "BHV"],
				selector: ".FriendListComponentStyle-buttonAddFriends",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.5)"
				}
			},

			{ /* стилизация кнопочек в разделе друзей */
				tag: ["QS"],
				selector: "div.FriendListComponentStyle-containerButtonFriends > div > img",
				styles:
				{
					filter: "invert(0)"
				}
			},

			{ /* стилизация кнопочек в разделе друзей */
				tag: ["QS", "fade"],
				selector: ".FriendListComponentStyle-buttonDisableAdd",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 1rem 0.05rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.5)"
				}
			},

			{ /* стилизация списка друзей в инвайт меню */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-flexStartAlignCenter.Common-whiteSpaceNoWrap.nickNameClass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.4rem",
					marginBottom: "-1%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация списка друзей в инвайт меню */
				tag: ["QSA", "fade"],
				selector: ".Common-flexStartAlignCenter.Common-whiteSpaceNoWrap",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.4rem",
					marginBottom: "-1%",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация списка друзей в инвайт меню */
				tag: ["QSA"],
				selector: ".InvitationWindowsComponentStyle-substrateRank",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация кнопочек в инвайт меню */
				tag: ["QS", "BHV", "fade"],
				selector: ".InvitationWindowsComponentStyle-backButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация кнопочек в инвайт меню */
				tag: ["QSA", "BHV", "fade"],
				selector: ".InvitationWindowsComponentStyle-inviteButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0px 0px 0px rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация полосы поиска */
				tag: ["QSA", "fade", "BHV"],
				selector: ".SearchInputComponentStyle-searchInput .Font-normal",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.5)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "fade", "BHV", "scale3d"],
				selector: ".SettingsMenuComponentStyle-menuItemOptions",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0.5rem 0.05rem rgba(0, 0, 0, 0.55), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "17rem",
					height: "3rem",
					marginBottom: "0.7rem",
					top: "3.8rem"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".GameSettingsStyle-button",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".KeyboardSettingsComponentStyle-buttonResetAllKeys",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "BHV", "fade"],
				selector: ".KeyboardSettingsComponentStyle-keyInput",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "BHV", "fade"],
				selector: ".AccountSettingsComponentStyle-buttonChangesOptions",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".AccountSettingsComponentStyle-buttonConnectOptions",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "BHV", "fade"],
				selector: "div.AccountSettingsComponentStyle-blockChangePassword > div > input, .SecuritySettingsComponentStyle-codeInputBlock > div > div > input[type=text]",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".AccountSettingsComponentStyle-buttonCaptchaOptions",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".TwitchSettingsRendersStyle-button",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: "div.AccountSettingsComponentStyle-containerFormOptions > div > div.AccountSettingsComponentStyle-blockInputEmail > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "fade"],
				selector: "div.AccountSettingsComponentStyle-containerFormOptions:nth-child(1) > form > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QSA", "BHV", "fade"],
				selector: ".KeyMappingWithIconComponentStyle-commonBlockSupplies",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация ползунков в разделе настроек */
				tag: ["QSA", "fade"],
				selector: ".InputRangeComponentStyle-range",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					backdropFilter: "blur(0.2rem)"
				}
			},

			{ /* стилизация активного раздела */
				cssStyles: `
					.InputRangeComponentStyle-range::-webkit-slider-thumb {
						background: radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%) !important;
						border-radius: 1rem !important;
					}
				`
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".SecuritySettingsComponentStyle-button",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".KeyMappingWithIconComponentStyle-overdrives",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS", "BHV", "fade"],
				selector: ".SettingsButtonsComponentStyle-buttonsWidthBackReset",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 0, 0, 0.2)",
					borderRadius: "1.2rem",
					backdropFilter: "blur(0.2rem)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела настроек */
				tag: ["QS"],
				selector: ".SettingsMenuComponentStyle-slideMenuOptions",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация выпадающего списка */
				tag: ["QSA", "fade", "BHV"],
				selector: ".DropDownStyle-dropdownControl",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация выпадающего списка */
				tag: ["QSA", "slide", "BHV"],
				selector: ".VerticalScrollStyle-outerContainerStyle .Common-flexStartAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.4rem"
				}
			},

			{ /* стилизация активного раздела */
				cssStyles: `
					.Common-activeMenu {
						color: rgba(222, 184, 135, 1) !important;
						animation: fadeIn 0.3s ease-in-out;
					}

					.MenuComponentStyle-mainMenuItem:hover {
						color: rgba(222, 184, 135, 1) !important;
					}

					.Common-menuItemActive {
						background: rgba(222, 184, 135, 1) !important;
						box-shadow: rgba(222, 184, 135, 1) 0rem 0rem 0.375rem !important;
						filter: drop-shadow(rgba(222, 184, 135, 1) 0rem 0rem 0.5rem) !important;
						animation: scaleIn 0.7s ease-in-out;
					}

					.MenuComponentStyle-commonBlock > span {
						background: none !important;
						animation: fadeIn 0.3s ease-in-out;
					}

					.MenuComponentStyle-commonBlock > span {
						background: none !important;
						animation: fadeIn 0.3s ease-in-out;
					}

					div.MenuComponentStyle-battleTitleCommunity > div > div > div > span {
						background: none !important;
						animation: fadeIn 0.3s ease-in-out;
					}
				`
			},

			{ /* стилизация заголовка раздела */
				cssStyles: `
					div.BreadcrumbsComponentStyle-breadcrumbs > div > span {
						color: rgba(222, 184, 135, 1) !important;
					}
				`
			},

			{ /* стилизация кнопок в битве */
				tag: ["QSA", "fade", "BHV"],
				selector: ".BattleHudComponentStyle-hudButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация всплывающих сообщений в битве */
			tag: ["QS"],
			selector: ".BattleMessagesComponentStyle-container",
			styles:
				{
					alignItems: "flex-start",
					paddingLeft: "1.1rem"
				}
			},

			{ /* стилизация всплывающих сообщений в битве */
				tag: ["QSA"],
				selector: ".BattleMessagesComponentStyle-message",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.1rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.4), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.2)"
				}
			},

			{ /* стилизация кнопочек в менюшке паузы */
				tag: ["QSA", "BHV", "fade"],
				selector: ".BattlePauseMenuComponentStyle-menuButton.BattlePauseMenuComponentStyle-enabledButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.4), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.2)",
					height: "4rem",
					justifyContent: "center"
				}
			},

			{ /* стилизация кнопочек в менюшке паузы */
				tag: ["QSA", "fade"],
				selector: ".BattlePauseMenuComponentStyle-menuButton.BattlePauseMenuComponentStyle-disabledButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.4), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.2)",
					height: "4rem",
					justifyContent: "center"
				}
			},

			{ /* стилизация кнопочек в менюшке паузы */
				tag: ["QS", "fade", "BHV"],
				selector: ".BattlePauseMenuComponentStyle-redMenuButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0) 0%, rgba(255, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 0, 0, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.4), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.2)",
					height: "4rem",
					justifyContent: "center"
				}
			},

			{ /* стилизация меню паузы */
				tag: ["QS", "fade"],
				selector: ".BattlePauseMenuComponentStyle-blackGlobalWrapper",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.3rem)"
				}
			},

			{ /* стилизация меню паузы */
				tag: ["QS", "scale"],
				selector: ".BattlePauseMenuDialogComponentStyle-content",
				styles:
				{
					display: "flex",
					justifyContent: "center"
				}
			},

			{ /* стилизация меню паузы */
				tag: ["QS", "fade"],
				selector: ".BattlePauseMenuComponentStyle-wrapperTimer",
				styles:
				{
					position: "absolute",
					top: "94%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					zIndex: "999"
				}
			},

			{ /* стилизация меню паузы */
				tag: ["QS", "fade"],
				selector: ".BattlePauseMenuComponentStyle-container",
				styles:
				{
					gap: "0.5rem",
					border: "0.150rem solid rgba(255, 255, 255, 0.120)",
					borderRadius: "1.2rem",
					padding: "3.5rem",
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)"
				}
			},

			{ /* стилизация окна с полученной званкой */
				tag: ["QS", "scale"],
				selector: ".RankupComponentStyle-wrapper",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.8rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					width: "60%"
				}
			},

			{ /* стилизация окна с полученной званкой */
				tag: ["QS"],
				selector: ".RankupRewardComponentStyle-buttonNext",
				styles:
				{
					background: "none",
					boxShadow: "none"
				}
			},

			{ /* стилизация заданок в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: ".BattleResultQuestProgressComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация заданок в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: ".BattleResultQuestProgressComponentStyle-container-true",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация заданок в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: ".BattleResultQuestProgressComponentStyle-container-false",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QS", "fade"],
				selector: ".BattleResultUserInfoComponentStyle-progressVictoryContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0.2rem 0.05rem rgba(0, 0, 0, 0.5), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация ммной статы */
			tag: ["QSA"],
			selector: ".GearScoreStyle-bestGsLight",
			styles:
				{
					marginRight: "0"
				}
			},

			{ /* стилизация ммной статы */
			tag: ["QSA"],
			selector: "td.BattleKillBoardComponentStyle-col2 > span.GearScoreStyle-bestGS.bgClipText",
			styles:
				{
					marginRight: "0.649em"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QS"],
				selector: ".BattleResultHeaderComponentStyle-flashLight",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QSA", "fade"],
				selector: ".BattleRewardsComponentStyle-normalRow",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QSA", "fade"],
				selector: ".BattleRewardsComponentStyle-selectedRow",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QS"],
				selector: ".BattleRewardsComponentStyle-selectedRow",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QS"],
				selector: ".BattleResultNavigationComponentStyle-commonBlockBattleResultNavigation",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация списка игроков в ммной стате */
				tag: ["QSA", "fade"],
				selector: "#selfUserBg",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(128, 128, 128, 0.2) 0%, rgba(128, 128, 128, 0.2) 0%)",
					backdropFilter: "blur(0.3rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация списка игроков в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: "#blueCommand",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.3rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация списка игроков в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: "#enemyCommand",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 0, 0, 0.1) 0%, rgba(255, 0, 0, 0.05) 0%)",
					backdropFilter: "blur(0.3rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация кнопочки купить премиум в ммной стате */
				tag: ["QS", "BHV", "fade"],
				selector: "#root > div > div > div.BattleRewardsComponentStyle-commonBlockButtonRewards > div > div > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					width: "30%"
				}
			},

			{ /* стилизация навигационных кнопочек в ммной стате */
				tag: ["QSA", "BHV", "fade"],
				selector: ".BattleResultNavigationComponentStyle-button",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация навигационных кнопочек в ммной стате */
				tag: ["QS", "BHV", "fade"],
				selector: "div.Common-flexCenterAlignCenter.BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация навигационных кнопочек в ммной стате */
				tag: ["QS", "fade"],
				selector: ".BattleResultNavigationComponentStyle-disabledButtonWithTimer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация ммной статы */
				tag: ["QS", "fade"],
				selector: ".BlockResultTankComponentStyle-gsContainer",
				styles:
				{
					top: "-2.5rem"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "BHV", "fade"],
				selector: ".ItemDescriptionComponentStyle-captionDevice",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "fade"],
				selector: ".ContainersComponentStyle-possibleRewardsBlock",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{  /* стилизация раздела с контейнерами */
			tag: ["QS", "fade"],
			selector: ".DeviceButtonComponentStyle-blockAlterations",
			styles:
				{
					alignItems: "flex-start"
				}
			},

			{ /* стилизация раздела с контейнерами */
			tag: ["QS"],
			selector: ".ContainersComponentStyle-navigationBlockForCategories",
			styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QSA", "BHV"],
				selector: "div.ContainersComponentStyle-rewards > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					margin: "0.2rem"
				}
			},

			{ /* стилизация раздела с контейнерами и гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".DeviceButtonComponentStyle-blockAlterations .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "BHV", "fade"],
				selector: ".ContainersComponentStyle-moreButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS"],
				selector: ".ContainersComponentStyle-rewards",
				styles:
				{
					justifyContent: "center"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS"],
				selector: ".ContainersComponentStyle-navigationBlock",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "fade"],
				selector: ".ContainerInfoComponentStyle-lootBoxDescriptionContainer",
				styles:
				{
					background: "none",
					borderRight: "none"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS"],
				selector: ".ContainersComponentStyle-leftPane",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS"],
				selector: ".ContainersComponentStyle-rightPane",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "fade"],
				selector: ".ContainersComponentStyle-containers",
				styles:
				{}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ContainerInfoComponentStyle-possibleRewardsContainer .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация дропа с контейнеров */
				tag: ["QSA", "BHV", "fade"],
				selector: ".RewardCardComponentStyle-smoothAppearance",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация дропа с контейнеров */
				tag: ["QSA", "BHV", "fade"],
				selector: ".RewardCardComponentStyle-fastAppearance",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация дропа с контейнеров */
				tag: ["QSA", "BHV", "scale"],
				selector: "#root > div > div > div.AnimationOpenContainerComponentStyle-rewardWrapper > div.AnimationOpenContainerComponentStyle-rewardContainer > div.Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация дропа с контейнеров */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClosedContainerStyle-moreButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация дропа с контейнеров */
				tag: ["QS"],
				selector: ".AnimationOpenContainerComponentStyle-receivedReward",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale"],
				selector: ".ScrollingCardsComponentStyle-scrollCard.cardImg",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "RHV", "fade"],
				selector: ".ProBattlesComponentStyle-commonBlockHotkeyV",
				styles:
				{
					border: "none",
					borderRadius: "1.1rem",
					transform: "scale(0.94)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "fade"],
				selector: "div.QuestsComponentStyle-emptyList0 > h2",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "fade"],
				selector: ".TableMainQuestComponentStyle-commonBlockTimerButtonTable",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с контейнерами */
				tag: ["QS", "fade"],
				selector: "div.ContainerInfoComponentStyle-lootBoxContainer > div > div > h2",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "fade"],
				selector: ".SuperMissionComponentStyle-descriptionSuperMission",
				styles:
				{
					background: "none",
					borderRight: "none"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS"],
				selector: "div.SuperMissionComponentStyle-descriptionSuperMission > div",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS"],
				selector: ".SuperMissionComponentStyle-gradientBackground",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "fade"],
				selector: ".SuperMissionComponentStyle-buttonDisable",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "fade"],
				selector: ".SuperMissionComponentStyle-rewardsContainer .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "fade"],
				selector: ".MainQuestComponentStyle-rewardsContainer .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "fade"],
				selector: ".TableMainQuestComponentStyle-rewardsContainerTable .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "fade"],
				selector: ".MainQuestComponentStyle-rewardsInDescriptionModal .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "BHV", "fade"],
				selector: ".MainQuestComponentStyle-buttonContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "BHV", "fade"],
				selector: ".MainQuestComponentStyle-containerButtonStore",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "scale"],
				selector: ".MainQuestComponentStyle-cardRewardGiven",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "fade"],
				selector: ".TableMainQuestComponentStyle-cardRewardGivenTable",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QS", "fade"],
				selector: ".MainQuestComponentStyle-needRank",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".MainQuestComponentStyle-colorCardPlay",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".MainQuestComponentStyle-commonCard",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "fade"],
				selector: ".TableMainQuestComponentStyle-cardLockedTable",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA"],
				selector: ".MainQuestComponentStyle-colorLockedGradient",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "fade"],
				selector: "#root > div > div.QuestsComponentStyle-content > div > div.ContractCardComponentStyle-card > div:nth-child(5) > div, #root > div > div.QuestsComponentStyle-content > div > div.ContractCardComponentStyle-card > div:nth-child(4) > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.150)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale"],
				selector: ".ContractCardComponentStyle-card",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".MainQuestComponentStyle-cardPlay",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "fade"],
				selector: ".MainQuestComponentStyle-cardPlayCommon",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".MainQuestComponentStyle-cardRewardCompleted",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.6rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.6)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "fade"],
				selector: ".TableMainQuestComponentStyle-cardRewardCompletedTable",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.6rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.6)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA", "BHV", "fade"],
				selector: ".MainQuestComponentStyle-cardCommonLocked",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с миссиями */
				tag: ["QSA"],
				selector: ".TableMainQuestComponentStyle-colorLockedGradientTable",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация всплывающего инфо-окна */
				tag: ["QS", "slide"],
				selector: ".NotificationViewStyle-commonBlockNotification",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.5rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация всплывающего инфо-окна */
				tag: ["QSA", "BHV", "fade"],
				selector: "div.NotificationViewStyle-commonBlockButtonYesNo > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация всплывающего инфо-окна */
				tag: ["QS"],
				selector: ".NotificationViewStyle-positionBlock",
				styles:
				{
					border: "none"
				}
			},

			{ /* стилизация всплывающего инфо-окна */
				tag: ["QS"],
				selector: ".NotificationViewStyle-progressNotification",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: ".TankParametersStyle-leftParamsContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

            { /* стилизация гаража */
            tag: ["QSA", "fade"],
            selector: ".TankParametersStyle-parametersBlockGear .Common-flexStartAlignCenter",
            styles:
                {
                    filter: "saturate(0)"
                }
            },

			{ /* стилизация гаража */
            tag: ["QSA"],
            selector: ".MountedItemsStyle-resistanceContainer",
            styles:
                {
                    zIndex: "99"
                }
            },

			{ /* стилизация гаража */
			tag: ["QS"],
			selector: "div > div.GarageMainScreenStyle-blockParameters > div > div.Common-flexStartAlignStartColumn.CssCommonAnimations-appearFromLeft",
			styles:
				{
					bottom: "4.8rem"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "BHV", "fade"],
				selector: "div.GarageSuppliesComponentStyle-containerButtons > div > div.GarageSuppliesComponentStyle-check",
				styles:
				{
					backgroundSize: "initial",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.9rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "BHV", "fade"],
				selector: "div.GarageSuppliesComponentStyle-containerButtons > div > div.GarageSuppliesComponentStyle-checkDown",
				styles:
				{
					backgroundSize: "initial",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.9rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "BHV", "fade"],
				selector: ".MountedItemsStyle-commonBlockDrone",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					width: "47%"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".SkinCellStyle-widthHeight",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: ".GarageCommonStyle-positionContentAlteration .Common-flexSpaceBetweenAlignStartColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderRight: "none"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "BHV", "fade"],
				selector: ".MountedItemsStyle-commonBlockPaint",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)",
					width: "47%"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".MountedItemsComponentStyleMobile-commonBlockForTurretsHulls",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".MountedItemsComponentStyleMobile-commonBlockForTurretsHulls",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".MountedItemsStyle-commonForCellResistenceName",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".GarageProtectionsComponentStyle-equipmentResistance",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-flexCenterAlignCenter.Common-borderRadius4px",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".SuppliesComponentStyle-cellAdd",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: "#root > div > div.GarageCommonStyle-garageContainer > div.GarageCommonStyle-positionContent > div.GarageMainScreenStyle-blockParameters > div.TanksPartBaseComponentStyle-tankPartContainer > div > div.TanksPartComponentStyle-tankPartUpgrades.GarageCommonStyle-animatedBlurredRightBlock",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: "#root > div > div > div.GarageCommonStyle-garageContainer > div.GarageCommonStyle-positionContent > div.GarageMainScreenStyle-blockParameters > div.TanksPartBaseComponentStyle-tankPartContainer > div > div.TanksPartComponentStyle-tankPartUpgrades.GarageCommonStyle-animatedBlurredRightBlock",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "BHV", "fade"],
				selector: "div.GarageSuppliesComponentStyle-containerButtons > div > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: "div.TanksPartComponentStyle-descriptionContainer > div.GarageCommonStyle-animatedBlurredLeftBlock > div:nth-child(2)",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QS", "fade"],
				selector: ".TanksPartComponentStyle-blockForImageResistanceModule",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".SquarePriceButtonComponentStyle-commonBlockButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-itemStyle.garage-item",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.250rem 0.05rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".ListItemsComponentStyle-itemsListContainer.CssCommonAnimations-appearFromBottom",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA"],
				selector: ".ListItemsComponentStyle-itemsWrapper .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".GarageProtectionsComponentStyle-iconEquipResist",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".MountedItemsStyle-improvementArrow",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".SkinCellStyle-mountIcon",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".MountedItemsStyle-improvementArrow",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".MountedItemsStyle-improvementArrow",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: ".GarageItemComponentStyle-improvementArrow",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация гаража */
				tag: ["QSA", "fade"],
				selector: "div.MountedItemsComponentStyleMobile-commonButtonUpdate > div.Common-flexCenterAlignCenter > div.Common-backgroundImage",
				styles:
				{
					filter: "saturate(0)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: ".ClanHeaderComponentStyle-blockInform",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: "#root > div > div > div.ClanCommonStyle-center.ClanCommonStyle-marginContent > div > div.ClanInfoComponentStyle-clanForeignActions > div.Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: ".ClanInfoComponentStyle-clanActionDescription",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: ".ClanInfoComponentStyle-messageClan",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanInvitationsComponentStyle-sendButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanProfileEditComponentStyle-clanDescriptionEdit",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ClanProfileEditComponentStyle-buttonCancel",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "fade"],
				selector: ".ClanProfileEditComponentStyle-containerParametersClanBlockInform",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanInfoComponentStyle-buttonEditProfile",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: "#root > div > div > div.FriendListComponentStyle-containerMembers > table > thead > tr",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA"],
				selector: "#root > div > div > div.FriendListComponentStyle-containerMembers > table > thead > tr *",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ClanCommonStyle-row",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.4rem"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA"],
				selector: ".ClanCommonStyle-rowEmpty",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS"],
				selector: "#root > div > div > div.FriendListComponentStyle-containerMembers > table > tbody > div",
				styles:
				{
					top: "0.4rem"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanMembersListComponentStyle-buyClanPlaceButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ClanCommonStyle-buttonInvite",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "BHV", "fade"],
				selector: ".PopupMessageComponentStyle-buttonsContainer .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QSA", "fade"],
				selector: ".ClanStatisticsComponentStyle-areCommon",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS"],
				selector: ".ClanHeaderComponentStyle-logo",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация раздела с кланом */
				tag: ["QS", "fade"],
				selector: ".ClanFounderComponentStyle-infoClan",
				styles:
				{
					marginLeft: "1.7em"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: ".ShowcaseItemComponentStyle-header",
				styles:
				{
					background: "none",
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: ".ShopItemComponentStyle-headerContainer",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA", "BHV", "scale"],
				selector: ".SmallShowcaseItemComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					margin: "0rem 0rem 1rem 0.45rem",
					transform: "none"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA", "BHV", "scale"],
				selector: ".shop-item-component",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					margin: "0rem 0rem 1rem 0.45rem"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "BHV", "fade"],
				selector: ".ShopFooterComponentStyle-reportButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "BHV", "fade"],
				selector: ".PromoCodesComponentStyle-sendButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "fade"],
				selector: ".ShopFooterComponentStyle-container",
				styles:
				{
					borderTop: "none",
					backdropFilter: "none"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS"],
				selector: ".VerticalScrollStyle-innerContainerStyle",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: ".ShowcaseItemComponentStyle-footer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: ".shop-item-component .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "fade"],
				selector: ".BasePaymentComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "BHV", "fade"],
				selector: ".BasePaymentComponentStyle-buttonContainer .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с магазином */
				tag: ["QSA"],
				selector: "div > div.ShopCategoryComponentStyle-itemsContainer > div > div",
				styles:
				{
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация раздела с магазином */
				tag: ["QS"],
				selector: "div.BasePaymentComponentStyle-container > div > div",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с магазином */
				tag: ["QS"],
				selector: "div.CoinPaymentComponentStyle-commonContainer > div",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".MediumShowcaseItemComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA", "fade"],
				selector: ".ShowcaseItemComponentStyle-disabledBackground",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.4) 0%)",
					backdropFilter: "blur(0.1rem)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: "div.ShopCategoryComponentStyle-itemsContainer > div > div > div",
				styles:
				{
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS", "scale", "scale3d"],
				selector: ".ShopSpecialOfferSectionHeaderStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QS"],
				selector: ".ShopSpecialOfferSectionHeaderStyle-ray",
				styles:
				{
					borderRadius: "1rem"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: ".LargeShowcaseItemComponentStyle-footer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с магазом */
				tag: ["QSA"],
				selector: "div.LargeShowcaseItemComponentStyle-container.Common-backgroundImageCover > div",
				styles:
				{
					boxShadow: "none"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS"],
				selector: ".ApplicationLoaderComponentStyle-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 0%)"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS"],
				selector: "#root > div.ApplicationLoaderComponentStyle-container.Common-flexCenterAlignCenterColumn > div:nth-child(1)",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS"],
				selector: ".ApplicationLoaderComponentStyle-loader",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS", "scale"],
				selector: ".ApplicationLoaderComponentStyle-logo",
				styles:
				{
					zIndex: "999"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS", "scale"],
				selector: "div.ApplicationLoaderComponentStyle-container.Common-flexCenterAlignCenterColumn > div.Common-flexCenterAlignCenter",
				styles:
				{
					zIndex: "999"
				}
			},

			{ /* стилизация загрузочного экрана */
				tag: ["QS", "scale"],
				selector: ".ApplicationLoaderComponentStyle-helpChangeTip",
				styles:
				{
					zIndex: "999"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QSA", "BHV", "scale"],
				selector: ".UserProgressComponentStyle-progressItemCompleted",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QSA", "BHV", "scale"],
				selector: ".UserProgressComponentStyle-progressItemUncompleted",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-rankProgressBarContainerRanks .Common-flexStartAlignStart",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-rankProgressBarContainerRanks .UserProgressComponentStyle-rankProgressBarGained",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QSA", "BHV", "fade"],
				selector: ".UserProgressComponentStyle-itemContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS", "BHV", "fade"],
				selector: ".UserProgressComponentStyle-buyPremium .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-buyPremium .Common-flexCenterAlignCenter > span",
				styles:
				{
					position: "absolute",
					left: "2.2rem"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-buyPremiumText",
				styles:
				{
					position: "absolute",
					width: "50rem",
					top: "1rem",
					left: "13rem"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".ScrollBarStyle-leftScrollArrow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					/* width: "0rem",
					boxShadow: "-0.3rem 0rem 0.5rem 0.08rem rgba(0, 0, 0, 1)",
					left: "-0.2rem" */
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".ScrollBarStyle-rightScrollArrow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					/* width: "0rem",
					boxShadow: "-0.3rem 0rem 0.5rem 0.08rem rgba(0, 0, 0, 1)",
					right: "-0.2rem" */
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-progressLegendPlus",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-progressLegendPlusImage",
				styles:
				{
					borderRadius: "1rem"
				}
			},

			{ /* стилизация раздела званок */
				tag: ["QS"],
				selector: ".UserProgressComponentStyle-progressLegendPlusGradient",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-flexStartAlignCenter.Common-flexWrapNowrap.modeLimitIcon",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "99%",
					marginBottom: "0.50%"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-emptyBattlesList",
				styles:
				{
					marginRight: "-24.5rem",
					transform: "scale(1.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-mainContainer .Common-flexStartAlignCenterColumn .Common-flexStartAlignStartColumn",
				styles:
				{
					borderRight: "none"
				}
			},

			{ /* стилизация гаража */
			cssStyles: `
					.GarageSuppliesComponentStyle-check {
							width: 6rem !important;
							height: 2.7rem !important;
						}

					.GarageSuppliesComponentStyle-checkDown {
						width: 6rem !important;
						height: 2.7rem !important;
					}
				`
			},

			{ /* стилизация раздела с битвами */
			cssStyles: `
					#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn {
						border-left: none !important;
					}
				`
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-navigationBlock",
				styles:
				{
					borderBottom: "none"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".BattleModesComponentStyle-blockModesFilter .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "none",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".BattleCreateComponentStyle-mainContainer .Common-flexStartAlignCenterColumn .Common-flexStartAlignStartColumn .Common-flexCenterAlignCenter",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "none",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA"],
				selector: ".MainSectionComponentStyle-transformLinearGradientImgCard",
				styles:
				{
					borderRadius: "0.8rem"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".InformationComponentStyle-blockCard",
				styles:
				{
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(0, 0, 0, 1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA"],
				selector: ".MainSectionComponentStyle-linearGradientImgCard",
				styles:
				{
					borderRadius: "1rem",
					bottom: "-0.1rem",
					width: "100.2%"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA"],
				selector: ".BattleModesComponentStyle-blockModesFilter .Common-flexCenterAlignCenter .Common-maskImageContain",
				styles:
				{
					position: "static",
					border: "none",
					borderRadius: "none"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-createBattleButton",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderTop: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-mainContainer .Common-flexStartAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderRight: "none",
					marginBottom: "1rem"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".BattleInfoComponentStyle-customOptions",
				styles:
				{
					border: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".BattleInfoComponentStyle-invite",
				styles:
				{
					border: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".BattleOptionsSectionComponentStyle-checkBoxSettingsCreateBattle .Common-flexSpaceBetweenAlignCenter",
				styles:
				{
					border: "none"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".ProBattlesComponentStyle-rightPanel",
				styles:
				{
					border: "none"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS"],
				selector: "div.FormatsSectionComponentStyle-selectedCard > div:nth-child(4)",
				styles:
				{
					background: "linear-gradient(0deg, rgb(200 200 200 / 50%) 0%, rgba(118, 255, 51, 0) 100%)",
					borderTop: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA"],
				selector: "div.FormatsSectionComponentStyle-unSelectedCard > div:nth-child(4)",
				styles:
				{
					borderTop: "none",
				}
			},

			{ /* стилизация раздела с режимами */
				tag: ["QSA"],
				selector: "div.ScrollingCardsComponentStyle-scrollCard > div:nth-child(4)",
				styles:
				{
					borderTop: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".FormatsSectionComponentStyle-card",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.3)",
					borderRadius: "1.1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA"],
				selector: ".BattleCreateComponentStyle-blockCard .Common-flexStartAlignStretchColumn .Common-backgroundImageCover .MapCardComponentStyle-linearGradient",
				styles:
				{
					borderRadius: "0.8rem",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "BHV", "fade"],
				selector: "div.BattleCreateComponentStyle-commonInputButtons.ProBattleCommonStyleMobile-commonInputButtons > form > div > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "BHV", "fade"],
				selector: "div.MainSectionComponentStyle-parameters > div > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".TierItemComponentStyle-receivedItem > .PremiumTierItemComponentStyle-parametersTierCommon > h3, .TierItemComponentStyle-getItemNow > .PremiumTierItemComponentStyle-parametersTierCommon > h3",
				styles:
				{
					zIndex: "1",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS", "fade"],
				selector: ".BattleCreateComponentStyle-imagePrivate",
				styles:
				{
					zIndex: "1",
					filter: "saturate(0)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".MainSectionComponentStyle-commonBlockCheckBoxCreateBattle.ProBattleCommonStyleMobile-commonBlockCheckBoxCreateBattle",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "fade"],
				selector: ".SettingsComponentStyle-scrollCreateBattle.Common-scrollBarHoverVisible",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "none",
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QSA", "BHV", "fade"],
				selector: "#root > div > div.BattleCreateComponentStyle-mainContainer > div.ProBattlesComponentStyle-rightPanel.Common-flexSpaceBetween > div > div.Common-flexStartAlignStretchColumn > div > div.Common-flexCenterAlignCenter.Common-alignSelfFlexEnd",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация кнопок в разделе с битвами */
				tag: ["QS"],
				selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter.ProBattleCommonStyleMobile-buttonContainer",
				styles:
				{
					justifyContent: "flex-end"
				}
			},

			{ /* стилизация кнопки войти за браво */
				tag: ["QS", "BHV", "fade"],
				selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter > div.Common-flexCenterAlignCenterColumn > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "96%"
				}
			},

			{ /* стилизация кнопки войти за альфа | дм */
				tag: ["QS", "BHV", "fade"],
				selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					height: "95.5%"
				}
			},

			{ /* стилизация кнопки войти за альфа | дм */
				tag: ["QS"],
				selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter.ProBattleCommonStyleMobile-buttonContainer > div.Common-flexCenterAlignCenter > div",
				styles:
				{
					background: "none",
					border: "none",
					boxShadow: "none"
				}
			},

			{ /* стилизация кнопки войти за альфа | дм */
				tag: ["QS"],
				selector: "#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter > div > div.Common-flexCenterAlignCenter.ButtonComponentStyle-disabled",
				styles:
				{
					background: "none",
					border: "none",
					boxShadow: "none"
				}
			},

			{ /* стилизация кнопки запуска битвы */
				tag: ["QS", "BHV", "fade"],
				selector: "#root > div > div.BattleCreateComponentStyle-mainContainer > div.ProBattlesComponentStyle-rightPanel.Common-flexSpaceBetween > div > div.Common-flexCenterAlignCenter.JoinToBattleComponentStyle-buttonJoin.ProBattleCommonStyleMobile-buttonContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "95%"
				}
			},

			{ /* стилизация кнопки запуска битвы */
				tag: ["QS"],
				selector: "#root > div > div.BattleCreateComponentStyle-mainContainer > div.ProBattlesComponentStyle-rightPanel.Common-flexSpaceBetween > div > div.Common-flexCenterAlignCenter.JoinToBattleComponentStyle-buttonJoin.ProBattleCommonStyleMobile-buttonContainer > span",
				styles:
				{
					color: "rgba(255, 255, 255, 1)"
				}
			},

			{ /* стилизация списка игроков в разделе битв */
				tag: ["QSA", "BHV", "fade"],
				selector: ".UsersTableStyle-centerCell.UsersTableStyle-fontCell.UsersTableStyle-rowBattle",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.3rem"
				}
			},

			{ /* стилизация списка игроков в разделе битв */
				tag: ["QSA", "fade"],
				selector: ".UsersTableStyle-cellName.UsersTableStyle-rowBattleEmpty.UsersTableStyle-centerCell.UsersTableStyle-fontCell",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.3rem"
				}
			},

			{ /* стилизация списка игроков в разделе битв */
				tag: ["QSA", "BHV", "fade"],
				selector: ".UsersTableStyle-row.UsersTableStyle-rowBattle.UsersTableStyle-rowWidth",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.3rem"
				}
			},

			{ /* стилизация списка игроков в разделе битв */
				tag: ["QSA", "fade"],
				selector: ".UsersTableStyle-row.UsersTableStyle-rowBattleEmpty.UsersTableStyle-rowWidth",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					marginBottom: "0.3rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "fade"],
				selector: ".Common-entranceGradient .Common-container",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 0%)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA", "BHV", "scale", "scale3d"],
				selector: ".HeaderComponentStyle-siteLink.menuItemClass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "BHV", "fade"],
				selector: "#email",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "BHV", "fade"],
				selector: "#username",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					bottom: "0.3rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA", "BHV", "fade"],
				selector: "#password",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA", "BHV", "fade"],
				selector: "#password1",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					top: "0.3rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA", "BHV", "fade"],
				selector: ".EntranceComponentStyle-styleButtons",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "BHV", "fade"],
				selector: "div.RegistrationComponentStyle-containerItem > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1.2rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "BHV", "fade"],
				selector: ".HeaderComponentStyle-blockForIconToggleSound",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA"],
				selector: ".EntranceComponentStyle-styleButtons > span",
				styles:
				{
					color: "rgba(255, 255, 255, 1)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QSA"],
				selector: "#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter > form > div.RegistrationComponentStyle-containerItem > div.DropDownStyle-dropdownRoot.UidInputComponentStyle-dropDownRoot > div > div > div > div > span",
				styles:
				{
					color: "rgba(255, 255, 255, 1)"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS"],
				selector: "#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter > form > div.RegistrationComponentStyle-containerItem > div > div.Common-flexCenterAlignCenterColumn.EntranceComponentStyle-commonBlockMessageError.textError",
				styles:
				{
					top: "0.9rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS"],
				selector: "#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm.Common-flexCenterAlignCenter.Common-displayFlex.Common-alignCenter > form > div > div:nth-child(2) > div.Common-flexCenterAlignCenterColumn.EntranceComponentStyle-commonBlockMessageError.textError",
				styles:
				{
					top: "1.45rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS"],
				selector: "#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm > form > div > div:nth-child(2) > div.Common-flexCenterAlignCenterColumn.EntranceComponentStyle-commonBlockMessageError.textError",
				styles:
				{
					top: "0.9rem"
				}
			},

			{ /* стилизация рег формы */
				tag: ["QS", "BHV", "fade"],
				selector: "#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm > form > div.EntranceComponentStyle-blockCheckedLink.Common-flexStartAlignStartColumn > div.EntranceComponentStyle-checkbox > div > label > span",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
				}
			},

			{ /* стилизация рег формы */
				cssStyles: `
					#root > div > div.Common-entranceGradient > div.Common-contentSpaceBetween > div.EntranceComponentStyle-ContainerForm > form > div.EntranceComponentStyle-blockCheckedLink.Common-flexStartAlignStartColumn > div.EntranceComponentStyle-checkbox > div > label > span::before {
						filter: saturate(0);
					}
				`
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS"],
				selector: "#parallax-root > div.parallax",
				styles:
				{
					background: "black"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: ".navbar",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "fade"],
				selector: ".generic-box.panel",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: ".generic-box.error-box",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".generic-box.profile-entity-card",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: ".generic-box.user-achievements",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "fade"],
				selector: ".generic-box.leaderboard",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "BHV", "fade"],
				selector: ".search-panel__input-wrapper > input",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.7rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".generic-selector__itself",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.7rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".search-panel__button-search",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.7rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "slide"],
				selector: ".my-favorites__list",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "0.7rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: ".progress-bar",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: "#app-root > main > div.generic-box.panel.stats-panel > section.stats-panel__foot > div.stats-panel__achievements-wrapper > div > div.stats-panel__achievements-bar-wrapper > div",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: ".progress-bar__bar",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					position: "absolute",
					height: "1.5rem",
					left: "0.1rem"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "fade"],
				selector: "#app-root > main > div.generic-box.panel.stats-panel > section.stats-panel__foot > div.stats-panel__achievements-wrapper > div > div.stats-panel__achievements-bar-wrapper > div > div.progress-bar__bar",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					position: "absolute",
					height: "1.55rem",
					bottom: "0.1rem",
					left: "0.1rem"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QS", "slide"],
				selector: ".lang-selector__list",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.2rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem"
				}
			},

			{ /* стилизация сайта с рейтингами */
				tag: ["QSA", "fade"],
				selector: ".lang-selector__list-item",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "fade"],
				selector: ".QuestsChallengesComponentStyle-maxTierBlock",
				styles:
				{
					borderLeft: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-maxTierBlockFree",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockGradient",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockImage",
				styles:
				{
					backgroundImage: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockGradientTiersCommon",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockGradientTiersPremium",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockGradientTiersEvent",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-tiers",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-premiumTier",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".EventBattlePassLobbyComponentStyle-commonBlockProgressBarChallenge",
				styles:
				{
					background: "none"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItemPremium",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 204, 0, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QSA", "fade"],
				selector: ".Common-flexCenterAlignCenterColumn.TierItemComponentStyle-tierPremium",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 204, 0, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					height: "11.92rem"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".Common-flexCenterAlignCenterColumn.TierItemComponentStyle-receivedItem",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "BHV", "fade"],
				selector: ".Common-flexCenterAlignCenterColumn.TierItemComponentStyle-getItemNow",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QSA", "fade"],
				selector: ".Common-flexCenterAlignCenterColumn.TierItemComponentStyle-tierCommon",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					height: "11.92rem"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "BHV", "fade"],
				selector: ".ChallengePurchaseComponentStyle-buttonBattlePass",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QSA", "BHV", "fade"],
				selector: ".ChallengeTierComponentStyle-blockTier .Common-flexCenterAlignCenterColumn",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					backdropFilter: "blur(0.5rem)",
					border: "0.150rem solid rgba(255, 204, 0, 0.2)",
					borderRadius: "1rem",
					boxShadow: "0rem 0rem 0rem 0rem rgba(0, 0, 0, 0), inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "fade"],
				selector: ".QuestsChallengesComponentStyle-eventTier",
				styles:
				{
					background: "none",
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS"],
				selector: ".QuestsChallengesComponentStyle-blockGradientEvent",
				styles:
				{
					background: "none",
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "fade"],
				selector: ".EventBattlePassLobbyComponentStyle-commonBlockProgressBarEvent",
				styles:
				{
					background: "none",
				}
			},

			{ /* стилизация разделов с челленджами */
				tag: ["QS", "fade"],
				selector: ".QuestsChallengesComponentStyle-maxTierBlockEvent",
				styles:
				{
					borderLeft: "none"
				}
			},

			{ /* стилизация увед окна с ошибкой */
				tag: ["QS", "slide"],
				selector: ".HeaderComponentStyle-messageContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(176, 176, 176, 0.7) 0%, rgba(176, 176, 176, 0.7) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "1.2rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)"
				}
			},

			{ /* стилизация избранных красок в гараже */
				tag: ["QSA", "BHV", "fade"],
				selector: ".PaintsCollectionComponentStyle-favoriteIconContainer",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "inset 0rem 0rem 0.5rem 0.15rem rgba(0,0,0,0.3)",
					width: "1.5rem",
					height: "1.5rem"
				}
			},

			{ /* стилизация избранных красок в гараже */
				tag: ["QSA"],
				selector: ".PaintsCollectionComponentStyle-favoriteIconContainer > img",
				styles:
				{
					width: "1.5rem",
					height: "1.5rem"
				}
			},

			{ /* стилизация таймеров в миссиях */
				tag: ["QSA"],
				selector: ".TableMainQuestComponentStyle-timerTable, .ContractCardComponentStyle-timer",
				styles:
				{
					background: "rgba(255, 255, 255, 1)",
					borderRadius: "0.7rem"
				}
			},

			{ /* стилизация таймеров в миссиях */
				tag: ["QSA"],
				selector: ".MainQuestComponentStyle-timer",
				styles:
				{
					background: "rgba(255, 255, 255, 1)",
					borderRadius: "0.7rem"
				}
			},

			{ /* стилизация таймеров в миссиях */
				tag: ["QSA"],
				selector: ".Common-headerTimer",
				styles:
				{
					background: "rgba(255, 255, 255, 1)",
					borderRadius: "0.7rem"
				}
			},

			{ /* стилизация кнопки-иконки логов в битве */
				tag: ["QS", "slide"],
				selector: "#root > div > div > div.BattleChatComponentStyle-rootDesktop > div > div > div.Common-flexCenterAlignCenter",
				styles:
				{
					position: "absolute",
					right: "1.2rem"
				}
			},

            { /* стилизация чата в битве */
                cssStyles: `
                    .BattleChatComponentStyle-inputContainerAll.slideIn > input {
                        flex-grow: 0.8 !important;
                    }
                `
			},

            { /* стилизация чата в битве */
                cssStyles: `
                    .BattleChatComponentStyle-inputContainerAllies > input {
                        flex-grow: 0.1 !important;
                    }
                `
            },

            { /* стилизация чата в битве */
                cssStyles: `
                    .BattleChatComponentStyle-inputContainerAll > input {
                        flex-grow: 0.4 !important;
                    }
                `
            },

            { /* стилизация раздела создания битвы */
                cssStyles: `
                    #root > div > div.BattleCreateComponentStyle-mainContainer > div.ProBattlesComponentStyle-rightPanel.Common-flexSpaceBetween > div > div.MainSectionComponentStyle-commonBlockCheckBoxCreateBattle.ProBattleCommonStyleMobile-commonBlockCheckBoxCreateBattle > div:hover {
                        scrollbar-width: thin !important;
                    }
                `
			},

			{ /* стилизация закупа припасов в гараже */
				tag: ["QS", "fade"],
				selector: ".SaleByKitStyle-commonBlockModal",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					borderRight: "0.15rem solid rgba(255, 255, 255, 0.1)"
				}
			},

			{ /* стилизация закупа припасов в гараже */
				tag: ["QSA", "scale", "BHV"],
				selector: ".SaleByKitStyle-commonCard",
				styles:
				{
					background: "radial-gradient(50% 100% at 50% 100%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 0%)",
					border: "0.150rem solid rgba(255, 255, 255, 0.1)",
					borderRadius: "2rem",
					boxShadow: "none"
				}
			},

            { /* стилизация чата в битве/стилизация списка никнеймов в друзьях/инвайтах/списка битв */
                cssStyles: `
                    .UserGroupTitleButtonComponentStyle-commonBlockGroup, .FriendListComponentStyle-nickName, .InvitationWindowsComponentStyle-usersScroll > div > div > div:nth-child(2), .ProBattleCommonStyleMobile-blockModesFilter > div.Common-flexCenterAlignCenter > div.Common-flexStartAlignCenter > p, .BattleModesComponentStyle-button > div.Common-flexStartAlignCenter.BattleModesComponentStyle-fund > div.Common-flexStartAlignCenter:nth-child(2), .BattleModesComponentStyle-button > .Common-flexCenterAlignCenter, .BattleCreateComponentStyle-mainContainer.ProBattlesComponentStyle-mainContainer.Common-flexStartAlignStart > div.Common-flexStartAlignCenterColumn > div, .MapCardComponentStyle-message > span, .MapCardComponentStyle-imgSelectCard {
                        filter: saturate(0) !important;
                    }

					.FriendListComponentStyle-greenTextOnline, .InvitationWindowsComponentStyle-onlineLabel, .ProBattlesComponentStyle-createBattleButton > p, .FormatsSectionComponentStyle-selectedCard.cardImg > div.Common-flexCenterAlignCenterColumn > h2 {
						color: rgba(222, 184, 135, 1) !important;
					}

					.FormatsSectionComponentStyle-unSelectedCard:hover > div:nth-child(4) > h2 {
						color: rgba(222, 184, 135, 1) !important;
					}
                `
            },

			{ /* стилизация раздела с битвами/раздела званий/карточек/гаража */
				cssStyles: `
					.ProBattleCommonStyleMobile-blockModesFilter .Common-maskImageContain, .ProBattlesComponentStyle-cellName span, .UserProgressComponentStyle-rankScore, .UserProgressComponentStyle-rankProgressBarContainerLegend, .BattlePickComponentStyle-blockForCrystalXP > div:nth-child(2), .Common-backgroundImageCover.modeLimitIcon > div.Common-flexSpaceBetweenAlignStretch > div > div > img, td.Common-flexSpaceBetweenAlignCenter.ProBattlesComponentStyle-cellName > div.Common-flexStartAlignCenter > img, .GarageCommonStyle-animatedBlurredRightBlock > div.Common-flexSpaceBetweenAlignStretch, .Common-flexCenterAlignCenterColumn.blockCard, .ProBattlesComponentStyle-commonBlockHotkeyV > div > div, .ProBattlesComponentStyle-chatIcon, .SkinCellStyle-nameDevices {
						filter: saturate(0) !important;
					}

					.MainQuestComponentStyle-messageReward {
						color: rgba(222, 184, 135, 1) !important;
					}

					.iconsMission:hover .MainQuestComponentStyle-messageReward {
						color: transparent !important;
					}
				`
			},

			{ /* стилизация раздела с битвами/инвайт меню */
				tag: ["QSA"],
				selector: ".Common-displayFlex .BattleCardComponentStyle-containerTicker span, .InvitationWindowsComponentStyle-inviteButton span",
				styles:
				{
					color: "rgb(255 206 142)"
				}
			},

			{ /* стилизация раздела с битвами */
				tag: ["QS"],
				selector: "div.BattleCardComponentStyle-mapName > div.BattleCardComponentStyle-containerTicker.Common-displayFlex > span",
				styles:
				{
					color: "white"
				}
			},

			{ /* стилизация раздела с друзьями */
				tag: ["QSA"],
				selector: ".FriendListComponentStyle-opacityText, .InvitationWindowsComponentStyle-battleLabel",
				styles:
				{
					marginTop: "0"
				}
			},

			{ /* стилизация раздела с заданками */
				cssStyles: `
					.MainQuestComponentStyle-progress, .TableMainQuestComponentStyle-progressTableMission {
						filter: saturate(0) drop-shadow(0rem 0rem 0.2rem rgba(255, 255, 255, 1));
					}

					.MainQuestComponentStyle-scrollContainer {
						scrollbar-width: thin !important;
					}
				`
			},

			{ /* стилизация ммной статы/магаза/кнопок навигации/челленджа */
				cssStyles: `
					.BattleResultQuestProgressComponentStyle-progressContainer, .BlockResultTankComponentStyle-gsContainer > img, .BattleResultUserInfoComponentStyle-containerProgress > .Common-displayFlexColumn, .BattleResultUserInfoComponentStyle-xp > img, .BattleRewardsComponentStyle-commonBlockButtonRewards > div > table > tr > td > img, .BattleResultNavigationComponentStyle-button > img, .HeaderComponentStyle-backArrowBlock, .BreadcrumbsComponentStyle-rightButtonsContainer > .Common-flexCenterAlignCenter > .Common-backgroundImageContain, .BreadcrumbsComponentStyle-iconLogout, .IconStyle-iconBackArrow, .IconStyle-iconLogOff, .TierItemComponentStyle-receivedItem > .TierIconComponentStyle-icons, .TierHeaderComponentStyle-descriptionTier {
						filter: saturate(0) !important;
					}

					.BattleResultQuestProgressComponentStyle-text:nth-child(2), .BattleResultUserInfoComponentStyle-rankNameContainer > span, .BattleResultUserInfoComponentStyle-xp > span, .BattleRewardsComponentStyle-commonBlockButtonRewards > div > table > tr > td:nth-child(2) > span, .BasePaymentComponentStyle-buttonContainer > div > span, .PaymentInfoComponentStyle-currency, .SuccessfulPurchaseComponentStyle-container > .Common-flexCenterAlignCenter > span, .SuccessfulPurchaseComponentStyle-content > .Common-flexCenterAlignCenter > span, .SuccessfulPurchaseComponentStyle-reward > .Common-flexEndAlignStartColumn > span {
						color: rgba(222, 184, 135, 1) !important;
					}

					.BattleResultUserInfoComponentStyle-containerProgress > .Common-displayFlexColumn::after {
						box-shadow: rgb(255, 188, 9) 0px 0px 0.575em 0px;
					}
				`
			},

			{ /* стилизация раздела с заданками/клана */
				tag: ["QSA"],
				selector: ".MainQuestComponentStyle-cardPlay > div > h4, .MainQuestComponentStyle-commonDescriptionProgress > div > h4, .MainQuestComponentStyle-commonCard > div > h4, .ClanCommonStyle-onlineNickName, .ClanInfoComponentStyle-buttonEditProfile > span, .ClanMembersListComponentStyle-buyClanPlaceButton > span, .ClanCommonStyle-buttonInvite > span, .TutorialModalComponentStyle-mediaContainer.MainQuestComponentStyle-mediaContainer > div > h2, .MainQuestComponentStyle-buttonContainer > span, .ClanStatisticsComponentStyle-areCommonSpanOnline, .ClanInvitationsComponentStyle-sendButton > span, .ClanInfoComponentStyle-clanForeignActions > div.Common-flexCenterAlignCenter:nth-child(3) > span",
				styles:
				{
					color: "rgba(222, 184, 135, 1)"
				}
			},

			{ /* стилизация раздела с настройками/заданками */
				tag: ["QSA"],
				selector: ".GameSettingsStyle-button > span, .SettingsComponentStyle-slider > p > span, .TwitchSettingsRendersStyle-button > span, .TwitchSettingsRendersStyle-nick, .ChatComponentStyle-chatRegularUser, .MainQuestComponentStyle-cardRewardCompleted.iconsMission.MainQuestComponentStyle-animationImgHover> div.Common-flexCenterAlignCenterColumn > h4, .SuperMissionComponentStyle-buttonCollect > span, .SecuritySettingsComponentStyle-button > span, .SecuritySettingsComponentStyle-activation2FaButton > span",
				styles:
				{
					color: "rgba(222, 184, 135, 1)"
				}
			},

			{ /* стилизация раздела с гаражом*/
				tag: ["QSA"],
				selector: ".GarageItemComponentStyle-descriptionDevice > div > .Common-whiteSpaceNoWrap.Font-bold.Common-whiteSpaceNoWrap",
				styles:
				{
					color: "rgba(239, 239, 239, 1)"
				}
			},

			{ /* стилизация раздела с гаражом */
				tag: ["QSA"],
				selector: ".GarageItemComponentStyle-descriptionDevice > h2, .GarageCommonStyle-animatedBlurredRightBlock > div > div > h2:nth-child(2)",
				styles:
				{
					color: "rgba(222, 184, 135, 1)",
					textShadow: "rgb(255, 204, 0) 0px 0px 0.375em",
					zIndex: "9"
				}
			},

			{ /* стилизация раздела с гаражом */
				tag: ["QSA"],
				selector: ".SquarePriceButtonComponentStyle-commonBlockButton > .Common-flexEndAlignEnd > span, .ItemDescriptionComponentStyle-textModal > a > u, .TutorialModalComponentStyle-navigationButton > span, .GarageCommonStyle-animatedBlurredRightBlock > div.Common-displayFlexColumn > div > span.Font-bold.Common-flexEnd.Common-whiteSpaceNoWrap, .TanksPartComponentStyle-tankPartUpgrades.GarageCommonStyle-animatedBlurredRightBlock > div > div > span",
				styles:
				{
					color: "rgba(222, 184, 135, 1)"
				}
			},

			{ /* стилизация контекстного меню/чата/клана */
				cssStyles: `
					.ContextMenuStyle-menuItem.ContextMenuStyle-menuItemRank > div > div > div > span, #root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn > div.Common-flexStartAlignCenter > div > span, .ChatComponentStyle-channelSelect {
						color: rgba(222, 184, 135, 1) !important;
					}

					.ClanCommonStyle-offlineNickName {
						color: rgb(167, 167, 167) !important;
					}
				`
			},

			{ /* стилизация раздела с контами */
				cssStyles: `
					.DeviceButtonComponentStyle-blockAlterations > div > span {
						color: rgba(222, 184, 135, 1) !important;
					}

					.ContainersComponentStyle-countBlock > div {
						box-shadow: rgba(222, 184, 135, 1) 0em 0em 1em 0em !important;
						background: rgba(222, 184, 135, 1);
					}
				`
			},

			{ /* стилизация списка битв/всплывающего окна */
				tag: ["QSA"],
				selector: ".JoinToBattleComponentStyle-buttonJoin > span, .NotificationViewStyle-blockButtonAndTimer > div > div > span, .NotificationViewStyle-descriptionNotification > div > span:nth-child(2), .BattleSelectDialogComponentStyle-container > span > a > u, .UserProgressComponentStyle-buttonOk > div > h2, .PopupMessageComponentStyle-buttonsContainer > .Common-flexCenterAlignCenter:nth-child(2) > span",
				styles:
				{
					color: "rgba(222, 184, 135, 1)"
				}
			},

			{ /* стилизация списка битв */
				cssStyles: `
					#root > div > div.ProBattlesComponentStyle-mainContainer > div.Common-flexStartAlignCenterColumn > div.Common-flexStartAlignStretchColumn {
						margin-bottom: 0.8rem !important;
					}
				`
			},

			{ /* стилизация карточек в режимах битв/рег меню/финальной статистики/контейнеров */
				cssStyles: `
					.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard:hover > div:nth-child(1) > h2, .Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard:hover > span, .HeaderComponentStyle-siteLink.menuItemClass:hover > .EntranceComponentStyle-fontStyleLabel, .HeaderComponentStyle-siteLink.menuItemClass:hover > .HeaderComponentStyle-textLink > span, .ButtonComponentStyle-disabled.BattleResultNavigationComponentStyle-disabledButtonWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter > span, .BattleResultNavigationComponentStyle-buttonNextWithTimer.BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter > span {
						color: rgba(222, 184, 135, 1) !important;
					}

					.Common-flexSpaceBetweenAlignCenterColumn.descriptionMode.blockCard:hover > div:nth-child(2), .HeaderComponentStyle-siteLink.menuItemClass:hover > .Common-flexCenterAlignCenter, .BattleResultNavigationComponentStyle-buttonWithTimer.Common-flexCenterAlignCenterColumn.Common-displayFlexColumn.Common-displayFlex.Common-alignCenter > img, .TableComponentStyle-thead, .ContainersComponentStyle-chatIcon {
						filter: saturate(0);
					}
				`
			},

			{ /* стилизация бэкграунда карточек в гараже/ммной статы */
				tag: ["QSA"],
				selector: ".SkinCellComponentStyle-gradientCategoryDevices-LEGENDARY, .SkinCellComponentStyle-gradientCategoryDevices-EPIC, .SkinCellComponentStyle-gradientCategoryDevices-RARE, .SkinCellComponentStyle-gradientCategoryDevices-SPECIAL, .BattleResultHeaderComponentStyle-resultBg",
				styles:
				{
					display: "none"
				}
			},

			{ /* стилизация бэкграунда иконок в миссиях */
				tag: ["QSA"],
				selector: ".MainQuestComponentStyle-backgroundIcon",
				styles:
				{
					backgroundImage: "none"
				}
			},

			{ /* стилизация иконок в шапке/таблиц */
				cssStyles: `
					.BreadcrumbsComponentStyle-headerContainer > div.BreadcrumbsComponentStyle-rightButtonsContainer > div.Common-flexCenterAlignCenter > div, .UserScoreComponentStyle-blockRightPanel > .Common-flexCenterAlignCenter > .Common-maskImage.Common-maskImageContain, div.ProBattlesComponentStyle-mainContainer > div.Common-flexCenterAlignStart.Common-alignSelfStart.Common-flexStartAlignStart.Common-flexWrapNowrap.Common-scrollBarVisible > div > table > thead {
						border-radius: 0rem !important;
						filter: saturate(0) !important;
					}
				`
			},

			{ /* стилизация раздела с битвами */
				cssStyles: `
					.NewBattleCreateInputStyle-settings .Common-backgroundImageContain {
						z-index: 1 !important;
						filter: saturate(0) !important;
					}

					.ProBattlesComponentStyle-borderLineCell.ProBattlesComponentStyle-cellPlayers.ProBattlesComponentStyle-fontCellRegular, .BattleCardComponentStyle-battleInfo {
						background: none !important;
					}
				`
			},
		];

		elements.forEach((element) =>
		{
			let selectedElements;

			if (element.tag && element.tag.includes("QSA"))
			{
				selectedElements = document.querySelectorAll(element.selector);
			}
			else if (element.tag && element.tag.includes("QS"))
			{
				const singleElement = document.querySelector(element.selector);
				selectedElements = singleElement ? [singleElement] : [];
			}

			if (selectedElements)
			{
				selectedElements.forEach((el) =>
				{
					if (el && !el.classList.contains("animate") && !el.dataset.animated)
					{
						el.dataset.animated = true;

						animationTags(element, el);
						mouseHover(element, el);

						el.addEventListener("animationend", () =>
						{
							el.classList.remove("animate");
						},
						{
							once: true
						});

						if (el.classList.contains("scale3d"))
						{
							el.addEventListener("mousemove", (e) => handleMouseMove(e, el));
							el.addEventListener("mouseenter", () => el.classList.add("is-hovered"));
							el.addEventListener("mouseleave", () =>
							{
								el.classList.remove("is-hovered");
								resetTransform(el);
							});
						}
					}
				});
			}
		});

		const checkStyles = cssStyles ? cssStyles.textContent : '';
		const updateStyles = elements.reduce((acc, element) =>
		{
			if (element.cssStyles && !checkStyles.includes(element.cssStyles))
			{
				acc += element.cssStyles;
			}
			return acc;
		}, '');

		if (updateStyles)
		{
			if (!cssStyles)
			{
				cssStyles = document.createElement("style");
				document.head.appendChild(cssStyles);
			}
			cssStyles.textContent = checkStyles + updateStyles;
		}
	}

	function initObserver()
	{
		observer = new MutationObserver(styles);

		const config = {
			childList: true,
			subtree: true,
		};

		observer.observe(document.body, config);
	}

	/* инициализация */
	changeTitle("BlurStyle");
	updateFilters();
	restoreFilterSettings();
	backgroundAnimation();
	resistanceTab();
	replaceChecker();
    replaceImages();
	initObserver();
	gmOverride();
})();
