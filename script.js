"use strict";

// Այբուբենների սահմանում
const alphabets = {
    en: "ABCDEFGHIKLMNOPQRSTUVWXYZ", // I/J նույնացվում են
    hy: "ԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔևՕՖ", // 39 տառ
    ru: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ" // 33 տառ
};

// Որ այբուբենն է պետք
function detectAlphabet(text) {
    if (/[ա-ֆ]/i.test(text)) return "hy";
    if (/[а-яё]/i.test(text)) return "ru";
    return "en";
}

// Մատրիցա կառուցել
function buildMatrix(alphabet) {
    const size = Math.ceil(Math.sqrt(alphabet.length));
    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(alphabet.slice(i * size, (i + 1) * size).split(""));
    }
    return matrix;
}

// Տառի դիրք
function findPosition(matrix, char) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === char) return [i, j];
        }
    }
    return null;
}

// Զույգեր պատրաստել
function preparePairs(text, alphabetKey) {
    let alphabet = alphabets[alphabetKey];
    let regex;
    if (alphabetKey === "en") {
        text = text.toUpperCase().replace(/J/g, "I");
        regex = /[^A-Z]/g;
    } else if (alphabetKey === "hy") {
        text = text.toUpperCase();
        regex = /[^Ա-ՖևՕ]/g;
    } else {
        text = text.toUpperCase();
        regex = /[^А-ЯЁ]/g;
    }
    text = text.replace(regex, "");

    let pairs = [];
    for (let i = 0; i < text.length; i++) {
        let a = text[i];
        let b = text[i + 1] || "X";
        if (a === b) {
            b = "X";
            i--;
        }
        pairs.push(a + b);
        i++;
    }
    if (pairs[pairs.length - 1].length === 1) pairs[pairs.length - 1] += "X";
    return pairs;
}

// Playfair հիմնական ֆունկցիա
function playfair(text, encrypt = true) {
    const alphabetKey = detectAlphabet(text);
    const matrix = buildMatrix(alphabets[alphabetKey]);
    const pairs = preparePairs(text, alphabetKey);

    let result = "";
    let details = "";

    const size = matrix.length;

    for (let pair of pairs) {
        let [r1, c1] = findPosition(matrix, pair[0]);
        let [r2, c2] = findPosition(matrix, pair[1]);

        let resPair = "";
        if (r1 === r2) {
            resPair =
                matrix[r1][encrypt ? (c1 + 1) % size : (c1 - 1 + size) % size] +
                matrix[r2][encrypt ? (c2 + 1) % size : (c2 - 1 + size) % size];
        } else if (c1 === c2) {
            resPair =
                matrix[encrypt ? (r1 + 1) % size : (r1 - 1 + size) % size][c1] +
                matrix[encrypt ? (r2 + 1) % size : (r2 - 1 + size) % size][c2];
        } else {
            resPair = matrix[r1][c2] + matrix[r2][c1];
        }

        result += resPair + " ";
        details += `${pair} → ${resPair}\n`;
    }

    return { result: result.trim(), details, matrix };
}

// UI կոճակներ
function encrypt() {
    let text = document.getElementById("text").value;
    if (!text) {
        alert("Խնդրում եմ մուտքագրեք տեքստ։");
        return;
    }
    let { result, details, matrix } = playfair(text, true);
    document.getElementById("result").textContent = result;
    document.getElementById("details").textContent =
        details + "\nՄատրիցա:\n" + matrix.map(r => r.join(" ")).join("\n");
}

function decrypt() {
    let text = document.getElementById("text").value.replace(/\s+/g, "");
    if (!text) {
        alert("Խնդրում եմ մուտքագրեք տեքստ։");
        return;
    }
    let { result, details, matrix } = playfair(text, false);
    document.getElementById("result").textContent = result;
    document.getElementById("details").textContent =
        details + "\nՄատրիցա:\n" + matrix.map(r => r.join(" ")).join("\n");
}
