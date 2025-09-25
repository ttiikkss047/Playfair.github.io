function getAlphabet(text) {
    if (/[ա-ֆ]/i.test(text)) {
        // Հայերեն այբուբեն (39 տառ)
        return "աբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքևօֆ";
    } else if (/[а-яё]/i.test(text)) {
        // Ռուսերեն այբուբեն (33 տառ)
        return "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    } else {
        // Լատիներեն այբուբեն (I/J նույնացվում են)
        return "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    }
}

function createMatrix(key, alphabet) {
    key = key.toLowerCase().replace(/[^" + alphabet + "]/g, "");
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
    text = text.toLowerCase().replace(/[^" + alphabet + "]/g, "");
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
    let matrix = createMatrix("գաղտնիք", alphabet); // բանալի բառ

    let prepared = prepareText(text, alphabet);
    let output = "";

    for (let i = 0; i < prepared.length; i += 2) {
        let a = prepared[i], b = prepared[i + 1];
        let [r1, c1] = findPosition(matrix, a);
        let [r2, c2] = findPosition(matrix, b);

        if (r1 === r2) {
            output += matrix[r1][(c1 + 1) % matrix.length];
            output += matrix[r2][(c2 + 1) % matrix.length];
        } else if (c1 === c2) {
            output += matrix[(r1 + 1) % matrix.length][c1];
            output += matrix[(r2 + 1) % matrix.length][c2];
        } else {
            output += matrix[r1][c2];
            output += matrix[r2][c1];
        }
    }

    document.getElementById("result").textContent = output;
    document.getElementById("details").textContent = matrix.map(r => r.join(" ")).join("\n");
}

function decrypt() {
    let text = document.getElementById("text").value;
    let alphabet = getAlphabet(text);
    let matrix = createMatrix("գաղտնիք", alphabet); // բանալի բառ

    let prepared = text.toLowerCase().replace(/[^" + alphabet + "]/g, "");
    let output = "";

    for (let i = 0; i < prepared.length; i += 2) {
        let a = prepared[i], b = prepared[i + 1];
        let [r1, c1] = findPosition(matrix, a);
        let [r2, c2] = findPosition(matrix, b);

        if (r1 === r2) {
            output += matrix[r1][(c1 - 1 + matrix.length) % matrix.length];
            output += matrix[r2][(c2 - 1 + matrix.length) % matrix.length];
        } else if (c1 === c2) {
            output += matrix[(r1 - 1 + matrix.length) % matrix.length][c1];
            output += matrix[(r2 - 1 + matrix.length) % matrix.length][c2];
        } else {
            output += matrix[r1][c2];
            output += matrix[r2][c1];
        }
    }

    document.getElementById("result").textContent = output;
    document.getElementById("details").textContent = matrix.map(r => r.join(" ")).join("\n");
}
