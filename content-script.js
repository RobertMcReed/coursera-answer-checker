'use strict';

(() => {
	const state = {
		regex: null,
		textPair: [],
		indicator: null,
		fading: false,
	};
	
	const prom = (fn) => (...args) => new Promise((resolve) => {
		fn(...args, (data) => resolve(data));
	});
	
	const setPattern = ({ pattern }) => {
		try {
			const regex = new RegExp(pattern, 'g');
			state.regex = regex;
			console.log('[INFO] SETTING REGEX', pattern);
		} catch (e) {
			console.error('[ERROR] Pattern Set Failed', e.message, pattern);
		}
	};
	
	const updatePattern = () =>
		prom(chrome.storage.sync.get)('pattern')
			.then(setPattern);
	
	const getSelectedText = () => {
		if (window.getSelection) {
			return window.getSelection().toString();
			} else if (document.selection && document.selection.type !== 'Control') {
			return document.selection.createRange().text;
			}
	};
	
	const stripText = text =>  text.replace(state.regex, '');
	
	const findDifferenceIndex = (shorter, longer) => {
		let idx = 0;
	
		shorter.split('').some((char, i) => {
			idx = i;
	
			return (char !== longer[i]);
		});
	
		return idx;
	};

	const fade = (start, end) => () => {
		if (!state.fading) {
			state.fading = true;

			let opacity = start;
			const fadingIn = start < end;
			const multiplier = fadingIn ? 1 : -1;
	
			const interval = setInterval(() => {
				if (fadingIn && opacity < end || !fadingIn && opacity > end) {
					opacity += 0.04 * multiplier;
					state.indicator.style.opacity = opacity;
				} else {
					state.fading = false;
					clearInterval(interval)
				}
			}, 25);
		}
	};

	const fadeIn = fade(0, 1);
	const fadeOut = fade(1, 0);
	const fadeInAndOut = () => {
		fadeIn();
		setTimeout(() => {
			fadeOut();
		}, 1625);
	};

	const showIndicator = (match) => {
		const color = match ? '#00ff00' : '#ff0000';
		state.indicator.style.backgroundColor = color;
		fadeInAndOut();
	};
	
	const checkTextPair = () => {
		const { textPair } = state;
	
		const stripped = textPair.map(stripText);
	
		const rawResults = {
			'First Raw': textPair[0],
			'Second Raw': textPair[1],
			'First Adjusted': stripped[0],
			'Second Adjusted': stripped[1],
		};
		console.table(rawResults);
		
		const [shorter, longer] = stripped;
		const areEqual = (shorter === longer);
		const verdictText = '%c' + (areEqual ? '' : 'Not ') + 'Equal';
		const verdictColor = 'color: ' + (areEqual ? 'green' : 'red');
		console.log('Verdict: ' + verdictText, verdictColor);
	
		showIndicator(areEqual);

		if (!areEqual) {
			const idx = findDifferenceIndex(shorter, longer);
			console.log(`${shorter.slice(0, idx)}%c${shorter.slice(idx)}`, 'color: red');
			console.log(`${longer.slice(0, idx)}%c${longer.slice(idx)}`, 'color: red');
		}
	};
	
	const handleTextSelected = () => {
		const grabbedText = getSelectedText();
	
		if (grabbedText) {
			console.clear();
			const { textPair, regex } = state;
	
			if (textPair.length < 1) {
				textPair.push(grabbedText);
				console.log('[INFO]: Select another item to compare...');
			} else {
				if (textPair.length === 1) textPair.push(grabbedText);
				else state.textPair = [textPair[1], grabbedText];
	
				if (regex) checkTextPair();
				else console.log('[INFO]: Regex not ready...');
			}
		}
	};

	const setupIndicator = () => {
		const indicator = document.createElement('div');
		state.indicator = indicator;
		indicator.id = 'indicator';
		indicator.style.opacity = '0';
		indicator.style.position = 'fixed';
		indicator.style.top = '10px';
		indicator.style.right = '10px';
		indicator.style.width = '15px';
		indicator.style.height = '15px';
		indicator.style.zIndex = '100';
		indicator.style.borderRadius = '50%';
		indicator.style.border = '1px solid black';
		document.body.appendChild(indicator);
	};
	
	chrome.runtime.onMessage.addListener(({ update }) => {
		if (update) updatePattern();
	});

	window.onload = () => {
		setupIndicator();
		updatePattern()
			.then(() => {
				console.log('[INFO]: Listening for highlights...');
				window.addEventListener('mouseup', handleTextSelected);
			});
	};
})();
