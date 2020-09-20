const speed_assemblers = {
	"Assembling machine 1": 0.5,
	"Assembling machine 2": 0.75,
	"Assembling machine 3": 1.25,
	"Stone furnace": 1,
	"Steel furnace": 2,
	"Electric furnace": 2
}

const speed_modules = {
	"Speed module 1": 0.2,
	"Speed module 2": 0.3,
	"Speed module 3": 0.5
};

const speed_belts = {
	"Transport belt": 15,
	"Fast transport belt": 30,
	"Express transport belt": 45
}

const calculator = {
	speed: (duration, items, assembler, modules) => {
		let bonus = 0;
		for (let i in modules) {
			bonus += modules[i] * speed_modules[i];
		}
		return speed_assemblers[assembler] * (1+bonus) * items / duration;
	},

	capacity: (belts) => {
		let cap = 0;
		for (let i in belts) {
			cap += belts[i] * speed_belts[i];
		}
		return cap;
	}
	
}

const ui = (($,$$) => {
	const ui = {
		read_form: () => {
			return {
				duration: $('#duration').value,
				items: $('#items').value,
				assembler: $('#assembler').value,
				modules: {
					"Speed module 1": $('#speed-1').value,
					"Speed module 2": $('#speed-2').value,
					"Speed module 3": $('#speed-3').value
				},
				belts: {
					"Transport belt": $('#belt-1').value,
					"Fast transport belt": $('#belt-2').value,
					"Express transport belt": $('#belt-3').value
				}
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
		
		update: () => {
			const request = ui.read_form();
			const speed = calculator.speed(request.duration, request.items, request.assembler, request.modules);
			const capacity = calculator.capacity(request.belts);
			ui.write_output(speed, capacity);
		}
	};
	$$('input, select').forEach(element => {
		element.oninput = ui.update;
	});
	ui.update();
	return ui;
})(document.querySelector.bind(document), document.querySelectorAll.bind(document));