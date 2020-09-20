const calculator = {
	speed: (duration, items, crafter, bonus) => {
		return crafter * (1+bonus/100) * items / duration;
	},

	capacity: (belt, belt_count) => {
		return belt * belt_count;
	}
	
}

const ui = (($,$$) => {
	const ui = {
		read_form: () => {
			return {
				duration: $('#duration').value,
				items: $('#items').value,
				crafter: $('#crafter-preset').value || $('#crafter-custom').value,
				modules: $('#modules-preset').value || $('#modules-custom').value,
				belt: $('#belt-preset').value || $('#belt-custom').value,
				belt_count: $('#belt-count').value,
			};
		},
		
		format_number: number => number > Math.floor(number) ? number.toPrecision(3) : number,

		format_optimal: (speed, capacity) => {
			const ratio = capacity / speed;
			const min = Math.floor(ratio);
			const max = Math.ceil(ratio);
			return (min < max) ? `${min} - ${max} (${ratio.toFixed(3)})` : min
		},

		write_output: (speed, capacity) => {
			$('#output-speed').innerText = ui.format_number(speed);
			$('#output-capacity').innerText = ui.format_number(capacity);
			$('#output-optimal').innerText = ui.format_optimal(speed, capacity);
		},

		update_presets: (crafter, modules, belt) => {
			$('#crafter-custom').value = crafter;
			$('#modules-custom').value = modules;
			$('#belt-custom').value = belt;
			$('#crafter-custom').disabled = $('#crafter-preset').value !== '';
			$('#modules-custom').disabled = $('#modules-preset').value !== '';
			$('#belt-custom').disabled = $('#belt-preset').value !== '';
		},
		
		update: () => {
			const request = ui.read_form();
			const speed = calculator.speed(request.duration, request.items, request.crafter, request.modules);
			const capacity = calculator.capacity(request.belt, request.belt_count);
			ui.update_presets(request.crafter, request.modules, request.belt);
			ui.write_output(speed, capacity);
		}
	};
	$$('input, select').forEach(element => {
		element.oninput = ui.update;
	});
	ui.update();
	return ui;
})(document.querySelector.bind(document), document.querySelectorAll.bind(document));