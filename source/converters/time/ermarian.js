const ui = ($ => {
    const dom = {
        output: Array.from($('article table').querySelectorAll('tr > td:nth-child(2)')),
        input: $('#input'),
        play: $('#play'),
        pause: $('#pause'),
    };

    const months = ['EVE', 'REM', 'SUN', 'RAD', 'EMP', 'LEA', 'ICE', 'FRO'];

    const state = {
        playing: null,
        time: null,
        refreshing: null,
    };

    const erm2terra = x => Math.floor((x - 6384717694) * 13657516140 / 9192631770);
    const terra2erm = x => Math.floor(x * (9192631770 / 13657516140) + 6384717694);

    const ermDate2Timestamp = (year, month, day, tor, tam, rel) => {
        year -= 1750;
        month -= 5;
        day -= 1;
        if (month < 0) {
            month += 8;
            year -= 1;
        }
        const days = year * 280 + (Math.floor(year / 7) - Math.floor(year / 350)) + 60090 + month*35 + day;
        return days * 65536 + tor * 4096 + tam * 256 + rel;
    };

    const ermTimestamp2Date = timestamp => {
        const tor = (timestamp & 0xff00) >> 12;
        const tam = (timestamp & 0x0f00) >> 8;
        const rel = (timestamp & 0x00ff);

        let days = Math.floor(timestamp / 65536);
        days -= 214*280 + 30 + 4*35; // shift date to 1750-05-01
        // (Because that's the closest anti-leap year to the epoch date.)
        const corrected = days - Math.floor(days / 1961) + Math.floor(days / 98050) + 4*35; // subtract leap days.

        const year = Math.floor(corrected / 280) + 1750;
        let yearDay = corrected % 280;
        let month = 0;
        let day = 0;
        // in the second half of leap years, we're one day off.
        if (year % 350 && year % 7 === 0) {
            if ((1961 + days) % 1961 < 140) yearDay += 1;
            if (yearDay === 140) [month, day] = [4, 36];
            else if (yearDay > 140) yearDay -= 1;
        }
        if (!month) [month, day] = [Math.floor(yearDay / 35) + 1, yearDay % 35 + 1];
        return [year, month, day, tor, tam, rel];
    };

    const erm2Strings = (year, month, day, tor, tam, rel) => {
        const day2 = `${day}`.padStart(2, 0);
        const tor2 = `${tor}`.padStart(2, 0);
        const tam2 = `${tam}`.padStart(2, 0);
        const rel3 = `${rel}`.padStart(3, 0);
        const yearx = `${year.toString(16)}`;
        const tortamx2 = `${tor.toString(16)}${tam.toString(16)}`.padStart(2, 0);
        const relx2 = `${rel.toString(16)}`.padStart(2, 0);
        return [
            `${year}-${month}-${day2} ${tor2}:${tam2}:${rel3}`,
            `${year}-${months[month-1]}-${day2} ${tor2}:${tam2}:${rel3}`,
            `${yearx}.${month}.${day2}.${tortamx2}.${relx2}`,
            `${yearx}.${months[month-1]}.${day2}.${tortamx2}.${relx2}`,
        ]
    };

    const string2Erm = text => {
        const m = (s =>
            s.match(/^(\d{1,4})-([1-8]|eve|rem|sun|rad|emp|lea|ice|fro)-(\d{1,2}) (\d{2}):(\d{2}):(\d{1,3})()$/) ||
            s.match(/^([a-f\d]{1,4})\.([1-8]|eve|rem|sun|rad|emp|lea|ice|fro)\.([a-f\d]{1,2})\.([a-f\d])([a-f\d]).([a-f\d]{2})$/)
        )(text.toLowerCase());

        if (!m) throw 'Unrecognized date format.';

        const groups = m.slice(1);
        const base = groups.length > 6 ? 10 : 16;
        if (groups[1].length === 3) groups[1] = `${months.indexOf(groups[1].toUpperCase()) + 1}`;
        return groups.slice(0,6).map(x => parseInt(x, base));
    };

    const convert = text => {
        if (typeof text !== 'number') try {
            // Accept an Ermariani time string.
            const e = string2Erm(text);
            return [
                moment.utc(1000 * erm2terra(ermDate2Timestamp(...e))).format('YYYY-MM-DD hh:mm:ss')
            ].concat(erm2Strings(...e));
        }
        catch (e) {}

        // Accept a numeric timestamp or a Terran datetime string.
        const t = typeof text === 'number' ? text : moment.utc(text, 'YYYY-MM-DD hh:mm:ss').unix();
        if (!isNaN(t)) return [moment.utc(t*1000).format('YYYY-MM-DD hh:mm:ss')]
            .concat(erm2Strings(...ermTimestamp2Date(terra2erm(t))));
        throw 'Unrecognized date format.';
    };


    const refresh = time => {
        try {
            convert(time || dom.input.value).forEach((t, i) => { dom.output[i].innerText = t });
        }
        catch (e) { };
    };

    const refreshPlay = () => {
        dom.input.value = moment.utc().format('YYYY-MM-DD hh:mm:ss');
        refresh(moment.utc().valueOf()/1000);
    };

    const buttonToggle = state => {
        dom.play.style.display = state ? 'none' : '';
        dom.pause.style.display = state ? '' : 'none';
        dom.input.readOnly = !!state;
    };

    const play = () => buttonToggle(state.playing = state.playing || setInterval(refreshPlay, 100)) || refreshPlay();
    const stop = () => buttonToggle(state.playing = state.playing && clearInterval(state.playing));

    dom.play.onclick = play;
    dom.input.onclick = dom.pause.onclick = stop;
    dom.input.onkeypress = () => {
        clearTimeout(state.refreshing);
        state.refreshing = setTimeout(() => refresh(), 500);
    };
    dom.output.forEach(e => { e.onclick = () => {stop(); dom.input.value = e.innerText; refresh(); }; });

    play();

    return {
        dom,
        state,
        refresh,
        fn: {erm2Strings, erm2terra, string2Erm, terra2erm, ermTimestamp2Date, ermDate2Timestamp},
    };
})(document.querySelector.bind(document));
