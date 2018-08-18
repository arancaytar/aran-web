---
title: Ermarian time
scripts: ['ermarian.js']
styles: ['ermarian.css']
---
The [Endless Empire of Ermarian](https://www.nationstates.net/ermarian) is a fictional world described
on the NationStates website, including its [time system](https://www.nationstates.net/nation=ermarian/detail=factbook/id=387274)
and a [synchronization](https://www.nationstates.net/nation=ermarian/detail=factbook/id=387274) with a fictional version
of 22nd century Earth.

<input type="text" id="input" />
<button type="button" id="play"><i class="fas fa-play"></i></button>
<button type="button" id="pause"><i class="fas fa-pause"></i></button>


| Format                     | Value |
|:--------------------------:|-------|
| Earth                      |       |
| Ermarian, decimal, numeric |       |
| Ermarian, decimal, named   |       |
| Ermarian, hex, numeric     |       |
| Ermarian, hex, named       |       |

The Ermariani date format consists of a year, month, and day, and its time format consists of a
*tor*, *tam*, and *rel*, which are divisions of 1/16, 1/256 and 1/65536 of a day, respectively.

In standard notation, all numbers are given in hexadecimal format, separated by `.` (except between *tor* and *tam*).

An alternate decimal form is also used, in which year, month, and day are separated by `-`, *tor*, *tam* and *rel* by
`:`, with a space between date and time.

In both notations, the month may also be identified by the first three letters of its name (Evermoon, Remembrance,
Suncome, Radiane, Empire, Leafloss, Icefall, Frost), capitalized.
