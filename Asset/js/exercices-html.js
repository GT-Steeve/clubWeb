const state = { q1: null, q2: null, q3: null, q4: null, q5: null, q6: null };
const ok_msgs = ["Parfait !", "Bravo !", "C'est ça !", "Excellent !"];
const ko_msgs = ["Pas tout à fait...", "Essaie encore !", "Presque !"];
function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }

function answer(btn, qId, isCorrect) {
    if (state[qId] !== null) return;
    state[qId] = isCorrect;
    btn.closest('.choices').querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    btn.classList.add(isCorrect ? 'correct' : 'wrong');
    const fb = document.getElementById('fb-' + qId);
    fb.className = 'feedback ' + (isCorrect ? 'ok' : 'ko');
    fb.textContent = isCorrect ? rnd(ok_msgs) + ' ✓' : rnd(ko_msgs);
    updateScore();
}

function updateScore() {
    const vals = Object.values(state);
    const done = vals.filter(v => v !== null).length;
    const good = vals.filter(v => v === true).length;
    document.getElementById('prog1').style.width = (done / 6 * 100) + '%';
    const row = document.getElementById('score1');
    row.innerHTML = '';
    if (done > 0) {
        const c = document.createElement('span');
        c.className = 'chip chip-ok';
        c.textContent = good + ' bonne' + (good > 1 ? 's' : '') + ' réponse' + (good > 1 ? 's' : '');
        row.appendChild(c);
        if (done - good > 0) {
            const e = document.createElement('span');
            e.className = 'chip chip-ko';
            e.textContent = (done - good) + ' erreur' + (done - good > 1 ? 's' : '');
            row.appendChild(e);
        }
    }
}

var originalLines = [
    '<body>',
    '<header>',
    '<h1>Mon site</h1>',
    '<nav>',
    '<a href="accueil.html">Accueil</a>',
    '</nav>',
    '</header>',
    '<main>',
    '<p>Bienvenue !</p>',
    '</main>',
    '<footer>',
    '<p>\u00a9 2024</p>',
    '</footer>',
    '</body>'
];

var solutionLines = [
    '<body>',
    '  <header>',
    '    <h1>Mon site</h1>',
    '    <nav>',
    '      <a href="accueil.html">Accueil</a>',
    '    </nav>',
    '  </header>',
    '  <main>',
    '    <p>Bienvenue !</p>',
    '  </main>',
    '  <footer>',
    '    <p>\u00a9 2024</p>',
    '  </footer>',
    '</body>'
];

function resetIndent() {
    document.getElementById('indent-input').value = originalLines.join('\n');
    var fb = document.getElementById('fb-indent');
    fb.textContent = '';
    fb.className = 'indent-feedback';
}

function showSolution() {
    document.getElementById('indent-input').value = solutionLines.join('\n');
    var fb = document.getElementById('fb-indent');
    fb.className = 'indent-feedback ok';
    fb.textContent = 'Voil\u00e0 la solution ! Observe comment chaque balise imbriqu\u00e9e est d\u00e9cal\u00e9e de 2 espaces vers la droite.';
}

function checkIndent() {
    var val = document.getElementById('indent-input').value;
    var fb = document.getElementById('fb-indent');
    var lines = val.split('\n');
    var expected = [0, 2, 4, 4, 6, 4, 2, 2, 4, 2, 2, 4, 2, 0];
    var score = 0;
    lines.forEach(function (line, i) {
        if (i >= expected.length) return;
        var spaces = line.length - line.trimStart().length;
        if (spaces === expected[i]) score++;
    });
    var pct = Math.round(score / expected.length * 100);
    if (pct === 100) {
        fb.className = 'indent-feedback ok';
        fb.textContent = 'Parfait ! Toutes les lignes sont bien indent\u00e9es. Tu peux voir d\'un coup d\'\u0153il quelles balises sont imbriqu\u00e9es dans quelles autres !';
    } else if (pct >= 60) {
        fb.className = 'indent-feedback mid';
        fb.textContent = 'Bien ! ' + pct + '% des lignes sont correctement indent\u00e9es. Regarde la solution pour voir les lignes \u00e0 corriger.';
    } else {
        fb.className = 'indent-feedback ko';
        fb.textContent = 'Encore un effort ! ' + pct + '% de bonnes indentations. Rappelle-toi : chaque balise enfant se d\u00e9cale de 2 espaces par rapport \u00e0 son parent.';
    }
}

document.getElementById('indent-input').addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const s = this.selectionStart;
        const end = this.selectionEnd;
        if (e.shiftKey) {
            const lineStart = this.value.lastIndexOf('\n', s - 1) + 1;
            if (this.value.substring(lineStart, lineStart + 2) === '  ') {
                this.value = this.value.substring(0, lineStart) + this.value.substring(lineStart + 2);
                this.selectionStart = this.selectionEnd = Math.max(s - 2, lineStart);
            }
        } else {
            this.value = this.value.substring(0, s) + '  ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = s + 2;
        }
    }
});