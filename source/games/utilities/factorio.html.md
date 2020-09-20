---
title: Factorio build calculator
scripts: ['factorio.js']
styles: ['factorio.css']
---
Balances input/output requirements of crafters with belt throughput.
<h2>Input</h2>
<div class="box grid">
    <fieldset>
        <legend>Recipe</legend>
        <label for="duration">Duration (seconds)</label>
        <input type="number" value="1" id="duration" /><br />
        <label for="items">Items per recipe</label>
        <input type="number" value="1" id="items" />
    </fieldset>
</div>
<div class="box grid">
    <fieldset>
        <legend>Crafter</legend>
        <label for="crafter-preset">Crafter type</label>
        <select id="crafter-preset">
            <option value="0.5">Assembling machine 1</option>
            <option value="0.75">Assembling machine 2</option>
            <option value="1.25">Assembling machine 3</option>
            <option value="1">Stone furnace</option>
            <option value="2">Steel / electric furnace</option>
            <option value="">Custom</option>
        </select><br />
        <label for="crafter-custom">Speed</label>
        <input type="number" id="crafter-custom" />    
    </fieldset>
</div>
<div class="box grid">
    <fieldset>
        <legend>Modules</legend>
        <label for="modules-preset">Module presets</label>
        <select id="modules-preset">
            <option value="0">None</option>
            <option value="20">+20% (speed 1)</option>
            <option value="30">+30% (speed 2)</option>
            <option value="40">+40% (2 * speed 2)</option>
            <option value="50">+50% (speed 3)</option>
            <option value="60">+60% (2 * speed 2)</option>
            <option value="80">+80% (4 * speed 1)</option>
            <option value="100">+100% (2 * speed 3)</option>
            <option value="120">+120% (4 * speed 2)</option>
            <option value="200">+200% (4 * speed 3)</option>
            <option value="">Custom</option>
        </select><br />
        <label for="modules-custom">Bonus</label>
        <input type="number" id="modules-custom" value="0" />  
    </fieldset>
</div>
<div class="box grid">
    <fieldset>
        <legend>Belt</legend>
        <label for="belt-preset">Belt type</label>
        <select id="belt-preset">
            <option value="15">Transport belt</option>
            <option value="30">Fast transport belt</option>
            <option value="45">Express transport belt</option>
            <option value="">Custom</option>
        </select><br />
        <label for="belt-custom">Belt speed</label>
        <input type="number" value="0" id="belt-custom" /><br />
        <label for="belt-count">Number of belts</label>
        <input type="number" value="1" step="0.5" id="belt-count" />
    </fieldset>
</div>

<h2>Output</h2>
<div class="box">
    <p>Crafter speed: <span id="output-speed">n/a</span> items per second per crafter.</p>
    <p>Belt capacity: <span id="output-capacity">n/a</span> items per second.</p>
    <p>Optimal crafter count: <span id="output-optimal">n/a</span> crafters.</p>
</div>
