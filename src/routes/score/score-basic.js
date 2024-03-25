export default `
|:D2|"Em"EBBA B2 EB|\
    ~B2 AB dBAG|\
    "D"FDAD BDAD|\
    FDAD dAFD|
"Em"EBBA B2 EB|\
    B2 AB defg|\
    "D"afe^c dBAF|\
    "Em"DEFD E2:|
|:gf|"Em"eB B2 efge|\
    eB B2 gedB|\
    "D"A2 FA DAFA|\
    A2 FA defg|
"Em"eB B2 eBgB|\
    eB B2 defg|\
    "D"afe^c dBAF|\
    "Em"DEFD E2:|
`

// export default `
// T: Todas Referencias
// M: 1
// L: 1/2
// R: reel
// K: Emin
// / [|:C,|D,|E,|F,|G,|A,|B,|C|D|E|F|G|A|B|c|d|e|f|g|a|b
// // G,|A,|B,|C|D|E|F|G|A|B|c|d|e|f|g|a|b
// // D|E|F|^G
// // ^C,|^D,|^E,|^F,|^G,|^A,|^B,|^C|^D|^E|^F|
// // ^G|^A|B|^c|^d|^e|^f|^g|^a|^b
// // D^^b|Eb=DFBc2|]
// // (c d (e) f g a)
// DDDD|EEEE|FFFF|GGGG|AAAA|BBBB|cccc|dddd|eeee|ffff|gggg|aaaa|bbbb
// D|E|F|G|A|B|c|d|e|f|g|a|b
// `;


// export default `
// T: Todas Referencias
// M: 1
// L: 1
// R: reel
// K: Emin
// [|:C,|D,|E,|F,|G,|A,|B,|C|D|E|F|G|A|B|c|d|e|f|g|a|b
// G,|A,|B,|C|D|E|F|G|A|B|c|d|e|f|g|a|b
// D|E|F|^G
// ^C,|^D,|^E,|^F,|^G,|^A,|^B,|^C|^D|^E|^F|
// ^G|^A|B|^c|^d|^e|^f|^g|^a|^b
// D^^b|Eb=DFBc2|]
// (c d (e) f g a)
// `;





const test = `
"C",
"C#",
"D",
"D#",
"E",
"F",
"F#",
"G",
"G#",
"A",
"A#",
"B"


SOL / SOL  -> G,  -> G3
SOL / SOL# -> ^G, -> G3#
SOL / LA   -> A,  -> A3
SOL / LA#  -> ^A, -> A3#
SOL / SI   -> B,  -> B3
SOL / DO   -> C   -> C4
SOL / DO#  -> ^C  -> C4#

RE / RE    -> D   -> D4
RE / RE#   -> ^D  -> D4#
RE / MI    -> E   -> E4
RE / FA    -> F   -> F3
RE / FA#   -> ^F  -> F3#
RE / SOL   -> G   -> G3
RE / SOL#  -> ^G  -> G3#

LA / LA    -> A   -> A4
LA / LA#   -> ^A  -> A4#
LA / SI    -> B   -> B4
LA / DO    -> c   -> C5
LA / DO#   -> ^c  -> C5#
LA / RE    -> d   -> D5
LA / RE#   -> ^d  -> D5#

MI / MI    -> e   -> E5
MI / FA    -> f   -> F5
MI / FA#   -> ^f  -> F5#
MI / SOL   -> g   -> G5
MI / SOL#  -> ^g  -> G5#
MI / LA    -> a   -> A5
MI / LA#   -> ^a  -> A5#
MI / SI   -> b  -> B5
`;



