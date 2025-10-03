function getAlphabet(text) {
    if (/[ա-ֆ]/i.test(text)) {
        return "աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքևօֆ";
    } else if (/[а-яё]/i.test(text)) {
        return "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    } else {
        return "abcdefghiklmnopqrstuvwxyz"; // I/J նույնն են
    }
}

function createMatrix(key, alphabet) {
    key = key.toLowerCase().replace(new RegExp(`[^${alphabet}]`, "g"), "");
    let seen = new Set();
    let filtered = "";

    for (let ch of key) {
        if (!seen.has(ch)) {
            seen.add(ch);
            filtered += ch;
        }
    }

    for (let ch of alphabet) {
        if (!seen.has(ch)) {
            seen.add(ch);
            filtered += ch;
        }
    }

    let size = Math.ceil(Math.sqrt(filtered.length));
    let matrix = [];
    for (let i = 0; i < size; i++) {
        matrix.push(filtered.slice(i * size, (i + 1) * size).split(""));
    }
    return matrix;
}

function findPosition(matrix, letter) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === letter) return [i, j];
        }
    }
    return null;
}

function prepareText(text, alphabet) {
    text = text.toLowerCase().replace(new RegExp(`[^${alphabet}]`, "g"), "");
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let a = text[i];
        let b = text[i + 1] || "";
        if (a === b) {
            result += a + "x";
        } else {
            result += a;
            if (b) {
                result += b;
                i++;
            }
        }
    }
    if (result.length % 2 !== 0) result += "x";
    return result;
}

function encrypt() {
    let text = document.getElementById("text").value;
    let alphabet = getAlphabet(text);
    let matrix = createMatrix("գաղտնիք", alphabet);
    let prepared = prepareText(text, alphabet);
    let output = "";
    let steps = [];

    for (let i = 0; i < prepared.length; i += 2) {
        let a = prepared[i], b = prepared[i + 1];
        let [r1, c1] = findPosition(matrix, a);
        let [r2, c2] = findPosition(matrix, b);

        if (r1 === r2) {
            output += matrix[r1][(c1 + 1) % matrix[r1].length];
            output += matrix[r2][(c2 + 1) % matrix[r2].length];
            steps.push(`${a}${b} → նույն տող → ${output.slice(-2)}`);
        } else if (c1 === c2) {
            output += matrix[(r1 + 1) % matrix.length][c1];
            output += matrix[(r2 + 1) % matrix.length][c2];
            steps.push(`${a}${b} → նույն սյուն → ${output.slice(-2)}`);
        } else {
            output += matrix[r1][c2];
            output += matrix[r2][c1];
            steps.push(`${a}${b} → ուղղանկյուն → ${output.slice(-2)}`);
        }
    }

    document.getElementById("result").textContent = "Գաղտնագրված տեքստ: " + output;
    document.getElementById("details").textContent = matrix.map(r => r.join(" ")).join("\n");
    document.getElementById("steps").textContent = steps.join("\n");
}

function decrypt() {
    let text = document.getElementById("text").value;
    let alphabet = getAlphabet(text);
    let matrix = createMatrix("գաղտնիք", alphabet);
    let prepared = text.toLowerCase().replace(new RegExp(`[^${alphabet}]`, "g"), "");
    let output = "";
    let steps = [];

    for (let i = 0; i < prepared.length; i += 2) {
        let a = prepared[i], b = prepared[i + 1];
        let [r1, c1] = findPosition(matrix, a);
        let [r2, c2] = findPosition(matrix, b);

        if (r1 === r2) {
            output += matrix[r1][(c1 - 1 + matrix[r1].length) % matrix[r1].length];
            output += matrix[r2][(c2 - 1 + matrix[r2].length) % matrix[r2].length];
            steps.push(`${a}${b} → նույն տող → ${output.slice(-2)}`);
        } else if (c1 === c2) {
            output += matrix[(r1 - 1 + matrix.length) % matrix.length][c1];
            output += matrix[(r2 - 1 + matrix.length) % matrix.length][c2];
            steps.push(`${a}${b} → նույն սյուն → ${output.slice(-2)}`);
        } else {
            output += matrix[r1][c2];
            output += matrix[r2][c1];
            steps.push(`${a}${b} → ուղղանկյուն → ${output.slice(-2)}`);
        }
    }

    document.getElementById("result").textContent = "Վերծանված տեքստ: " + output;
    document.getElementById("details").textContent = matrix.map(r => r.join(" ")).join("\n");
    document.getElementById("steps").textContent = steps.join("\n");
}
