"use strictt"
// Նախապես սահմանված մատրիցա (A-Z, առանց J)
const matrix = [
    ['A','B','C','D','E'],
    ['F','G','H','I','K'],
    ['L','M','N','O','P'],
    ['Q','R','S','T','U'],
    ['V','W','X','Y','Z']
];

// Գտնել տառի դիրքը մատրիցայում
function findPosition(char) {
    for (let i=0; i<5; i++){
        for (let j=0; j<5; j++){
            if(matrix[i][j]===char) return [i,j];
        }
    }
}

// Զույգերի պատրաստում՝ նույն տառերը X-ով լրացնելով
function preparePairs(text){
    text = text.toUpperCase().replace(/[^A-Z]/g,'').replace(/J/g,'I');
    let pairs = [];
    for(let i=0; i<text.length; i++){
        let a=text[i];
        let b=text[i+1]||'X';
        if(a===b){ b='X'; i--; }
        pairs.push(a+b);
        i++;
    }
    return pairs;
}

// Գաղտագրել կամ վերծանել՝ մանրամասն ցուցադրումով
function playfair(text, encrypt=true){
    let pairs = preparePairs(text);
    let result='';
    let details='';

    for(let pair of pairs){
        let [r1,c1]=findPosition(pair[0]);
        let [r2,c2]=findPosition(pair[1]);

        let resPair='';
        if(r1===r2){
            resPair = matrix[r1][encrypt?(c1+1)%5:(c1+4)%5] + matrix[r2][encrypt?(c2+1)%5:(c2+4)%5];
        } else if(c1===c2){
            resPair = matrix[encrypt?(r1+1)%5:(r1+4)%5][c1] + matrix[encrypt?(r2+1)%5:(r2+4)%5][c2];
        } else {
            resPair = matrix[r1][c2] + matrix[r2][c1];
        }
        result += resPair + ' ';
        details += `${pair[0]}${pair[1]} → ${resPair}\n`;
    }

    return {result: result.trim(), details};
}

function encrypt(){
    let text=document.getElementById('text').value;
    if(!text){ alert('Խնդրում եմ մուտքագրեք տեքստ։'); return; }
    let {result, details} = playfair(text,true);
    document.getElementById('result').textContent = result;
    document.getElementById('details').textContent = details;
}

function decrypt(){
    let text=document.getElementById('text').value.replace(/\s+/g,'');
    if(!text){ alert('Խնդրում եմ մուտքագրեք տեքստ։'); return; }
    let {result, details} = playfair(text,false);
    document.getElementById('result').textContent = result;
    document.getElementById('details').textContent = details;
}
