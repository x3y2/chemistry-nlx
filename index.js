const ORBITALS = {
    "S": 2,
    "p": 6,
    "d": 10,
    "f": 14
};

const LEVELS_ORBITALS = [
    [ "S" ],
    [ "S", "p" ],
    [ "S", "p", "d" ],
    [ "S", "p", "d", "f" ]
];

const METAL_MAX = 3;

const GROUPS = [
    "I A",
    "II A",
    "III A",
    "IV A",
    "V A",
    "VI A",
    "VII A",
    "VIII A",
    "IX A",
    "X A"
];

const MAX_Z = 20;

const LEVELS = createLevels(LEVELS_ORBITALS);



function createLevels(levels_orbitals) {
    let levels = [];

    levels_orbitals.forEach((orbitals, level) => {
        orbitals.forEach(orbital => {
            levels.push({
                "lvl": level + 1,
                "orb": orbital,
                "orbv": ORBITALS[orbital]
            });
        });
    });

    return levels;
}

function Z2nlx(Z) {
    let nlx = [];

    LEVELS.forEach(orbital => {

        if (orbital["orbv"] <= Z) {
            nlx.push([ orbital["lvl"], orbital["orb"], orbital["orbv"] ]);
            Z -= orbital["orbv"];
        }else if(Z != 0) {
            nlx.push([ orbital["lvl"], orbital["orb"], Z ]);
            Z = 0;
        }

    });

    return nlx;
}

function nlx2Z(nlx) {
    let Z = 0;

    nlx.forEach(orbital => {
        Z += orbital[2];
    });

    return Z;
}

function nlx2text(nlx) {
    let text = "";

    nlx.forEach(orbital => {
        text += orbital[0] + orbital[1] + orbital[2] + " ";
    });

    return text.slice(0, text.length - 1);
}

function nlx2colors(nlx) {
    let colors = "";

    nlx.forEach(orbital => {
        colors += '<span class="nlx-value L' + orbital[0] + '">' + orbital[0] + orbital[1] + orbital[2] + ' </span>';
    });

    return colors;
}

function text2Z(text) {
    let Z = 0;
    let int = "0";
    let space = true;

    for (let i = 0; i < text.length; i++) {
        if (!space && "0123456789".indexOf(text[i]) != -1) {
            int += text[i];
        }else if (text[i] == " ") {
            space = true;
        }else {
            Z += parseInt(int);
            int = "0";
            space = false;
        }
    }

    Z += parseInt(int);

    return Z;
}

function nlx2g(nlx) {
    let g = 0;
    let p = nlx2p(nlx);

    nlx.forEach(orbital => {
        if (orbital[0] == p) {
            g += orbital[2];
        }
    });

    return g;
}

function nlx2p(nlx) {
    return nlx[nlx.length - 1][0];
}

function nlx2type(nlx) {
    let g = nlx2g(nlx);

    if (g <= METAL_MAX) {
        return "metal";
    }else {
        return "no metal";
    }
}

function nlx2ox(nlx) {
    let g = nlx2g(nlx);
    let type = nlx2type(nlx);

    if (type == "metal") {
        return g;
    }else {
        return 8 - g;
    }
}



const EL_INPUT = document.querySelector("#input");
const EL_INPUT_TYPE = document.querySelector("#input-type");

const EL_Z = document.querySelector("#Z-value");
const EL_NLX = document.querySelector("#nlx-value");
const EL_G = document.querySelector("#g-value");
const EL_P = document.querySelector("#p-value");
const EL_TYPE = document.querySelector("#type-value");
const EL_OX = document.querySelector("#ox-value");

function resetOutput() {
    EL_Z.innerHTML = "???";
    EL_NLX.innerHTML = "???";
    EL_G.innerHTML = "???";
    EL_P.innerHTML = "???";
    EL_TYPE.innerHTML = "???";
    EL_OX.innerHTML = "???";
}

EL_INPUT.addEventListener("keyup", () => {
    if (EL_INPUT_TYPE.value == "Z") {
        var Z = parseInt(EL_INPUT.value);

        if (isNaN(Z)) {
            resetOutput();
            return;
        }

        var nlx = Z2nlx(Z);
    }else if (EL_INPUT_TYPE.value == "nlx") {
        var Z = text2Z(EL_INPUT.value);

        if (Z <= 0) {
            resetOutput();
            return;
        }

        var nlx = Z2nlx(Z);
    }

    if (Z > 20) {
        Z = MAX_Z;
        nlx = Z2nlx(MAX_Z);
    }

    let colors_text = nlx2colors(nlx);
    let g = nlx2g(nlx);
    let p = nlx2p(nlx);
    let type = nlx2type(nlx);
    let ox = nlx2ox(nlx);

    if (ox < 0) {
        ox = "???";
    }

    EL_Z.innerHTML = Z;
    EL_NLX.innerHTML = colors_text;
    EL_G.innerHTML = GROUPS[g - 1];
    EL_P.innerHTML = p;
    EL_TYPE.innerHTML = type;
    EL_OX.innerHTML = ox;
});