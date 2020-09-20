<!DOCTYPE html>
<html>
	<head>
		<title>Factorio build calculator</title>
	</head>
	<body>
		<h1>Factorio build calculator</h1>
		<form>
			<h2>Input</h2>
			<fieldset>
				<legend>Recipe</legend>
				<label for="duration">Duration (seconds)</label>
				<input type="number" value="1" id="duration" />
				<p>
				<label for="items">Items per recipe</label>
				<input type="number" value="1" id="items" />
			</fieldset>
			<fieldset>
				<legend>Assembler</legend>
				<label for="assembler">Assembler type</label>
				<select id="assembler">
					<option>Assembling machine 1</option>
					<option>Assembling machine 2</option>
					<option>Assembling machine 3</option>
					<option>Stone furnace</option>
					<option>Steel furnace</option>
					<option>Electric furnace</option>
				</select>
			</fieldset>
			<fieldset>
				<legend>Modules (beacon counts 50%)</legend>
				<label for="speed-1">Speed module 1</label>
				<input type="number" value="0" step="0.5" id="speed-1" />
				<p>
				<label for="speed-2">Speed module 2</label>
				<input type="number" value="0" step="0.5" id="speed-2" />
				<p>
				<label for="speed-3">Speed module 3</label>
				<input type="number" value="0" step="0.5" id="speed-3" />
			</fieldset>
			<fieldset>
				<legend>Belts (0.5 per lane)</legend>
				<label for="belt-1">Transport belt</label>
				<input type="number" value="0" step="0.5" id="belt-1" />
				<p>
				<label for="belt-2">Fast transport belt</label>
				<input type="number" value="0" step="0.5" id="belt-2" />
				<p>
				<label for="belt-3">Express transport belt</label>
				<input type="number" value="0" step="0.5" id="belt-3" />
			</fieldset>
		</form>
		<div>
			<h2>Output</h2>
			<p>Crafter speed: <span id="output-speed">n/a</span> items per second per crafter.</p>
			<p>Belt capacity: <span id="output-capacity">n/a</span> items per second.</p>
			<p>Optimal crafter count: <span id="output-optimal">n/a</span> crafters.</p>
		</div>
		<script src="factorio.js"></script>
	</body>
</html>