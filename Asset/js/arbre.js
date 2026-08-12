(function(){
  var PIECES_KEY = 'v3-puzzle-pieces';
  var UNLOCKED_KEY = 'v3-unlocked-nodes';
  var WATCHED_KEY = 'v3-watched-events';

  // youtubeId : identifiant de la vidéo YouTube (ex: "dQw4w9WgXcQ"), à renseigner
  // manuellement une fois la vidéo tournée. Vide par défaut -> affiche un placeholder.
  // ready : passe à false si le contenu du cours (vidéo + explication + astuce)
  // n'est pas encore finalisé. Affiche un badge "en préparation" sur le nœud et
  // dans la pop-up, et empêche d'obtenir la pièce de puzzle correspondante.
  var ROOT_NODES = [
    { id:'root-welcome', title:"Bienvenue dans l'aventure", meta:'Vidéo · Résumé écrit', noPiece:true,
      youtubeId:'', ready:true,
      video:"Une courte vidéo de bienvenue qui présente le club et la suite du parcours.",
      explain:"Ici commence ton parcours : chaque nœud est une petite étape à débloquer dans l'ordre, comme dans un arbre de compétences.",
      apply:"Astuce : regarde bien la vidéo de transition qui suit chaque nœud, c'est elle qui débloque la suite." },
    { id:'root-choose', title:"Choisis ta voie", meta:'Vidéo · Résumé écrit', noPiece:true,
      youtubeId:'', ready:true,
      video:"Un aperçu rapide des deux parcours possibles : Développement Web ou Jeu vidéo.",
      explain:"À partir d'ici, deux chemins s'ouvrent à toi. Tu peux avancer sur les deux à ton rythme.",
      apply:"Astuce : rien n'est perdu, tu peux revenir explorer l'autre voie plus tard." }
  ];

  var NODES = {
    web: [
      { id:'web-html', title:'HTML — les fondations', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Découvre les balises HTML et la structure d'une page web.",
        explain:"Le HTML pose le squelette de toute page : titres, paragraphes, images, liens. C'est la première pièce de ton puzzle Web.",
        apply:"Astuce : commence toujours par la structure (header, main, footer) avant de remplir le contenu." },
      { id:'web-css', title:'CSS — l\'habillage', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Apprends à colorer, espacer et mettre en page ton HTML avec le CSS.",
        explain:"Le CSS donne vie au HTML : couleurs, mise en page, responsive. Sans lui, ta page reste austère.",
        apply:"Astuce : utilise flexbox ou grid pour organiser tes éléments plutôt que des positions absolues." },
      { id:'web-js', title:'JavaScript — l\'interaction', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Rends ta page vivante : clics, animations, réactions à l'utilisateur.",
        explain:"Le JavaScript ajoute l'interactivité : boutons qui réagissent, contenu qui change, données qui se mettent à jour.",
        apply:"Astuce : commence petit — un bouton qui change de couleur au clic — avant de viser plus complexe." }
    ],
    frontend: [
      { id:'web-frontend-intro', title:'Introduction', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Découvre ce que recouvre le Front-End : tout ce que l'utilisateur voit et manipule directement.",
        explain:"Le Front-End, c'est la partie visible d'un site : HTML, CSS et JavaScript combinés pour créer une interface claire et agréable.",
        apply:"Astuce : inspecte des sites que tu aimes avec les outils développeur pour comprendre comment ils sont construits." },
      { id:'web-frontend-app', title:'Application', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Mets en pratique le Front-End en construisant une interface complète à partir d'une maquette.",
        explain:"Passer de la théorie à la pratique : assembler HTML, CSS et JavaScript pour livrer une vraie page fonctionnelle.",
        apply:"Astuce : commence par une maquette simple avant de viser un design plus ambitieux." }
    ],
    backend: [
      { id:'web-backend-intro', title:'Introduction', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Découvre ce que recouvre le Back-End : tout ce qui se passe côté serveur, invisible pour l'utilisateur.",
        explain:"Le Back-End gère la logique cachée : recevoir une requête, traiter des données, interroger une base de données, renvoyer une réponse.",
        apply:"Astuce : commence par comprendre le trajet d'une requête, du navigateur jusqu'au serveur et retour." },
      { id:'web-backend-app', title:'Application', difficulty:'difficile',
        youtubeId:'', ready:true,
        video:"Mets en pratique le Back-End en construisant une petite API qui répond à de vraies requêtes.",
        explain:"Passer de la théorie à la pratique : créer des routes, traiter des données et les stocker durablement.",
        apply:"Astuce : teste chaque route une par une avec des cas simples avant d'enchaîner la logique complète." }
    ],
    jeu: [
      { id:'jeu-code', title:'Code — la logique du jeu', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Les bases pour programmer le comportement de ton jeu.",
        explain:"Le code définit les règles : que se passe-t-il quand le joueur appuie sur une touche, quand deux objets se rencontrent...",
        apply:"Astuce : découpe ton jeu en petites fonctions claires (déplacer, tirer, collision...)." },
      { id:'jeu-mecanisme', title:'Mécanisme — les règles', difficulty:'difficile',
        youtubeId:'', ready:true,
        video:"Conçois des règles de jeu claires et amusantes.",
        explain:"Le mécanisme, c'est ce qui rend un jeu intéressant : la prise de risque, la progression, la difficulté qui s'ajuste.",
        apply:"Astuce : teste ton mécanisme avec du papier et des jetons avant même d'écrire du code." },
      { id:'jeu-asset', title:'Asset graphique / sonore', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Ajoute des images, sprites et sons pour habiller ton jeu.",
        explain:"Les assets donnent une identité visuelle et sonore à ton jeu : personnages, décors, musiques, effets.",
        apply:"Astuce : reste cohérent sur le style graphique, même avec des assets simples." },
      { id:'jeu-projet', title:'Projet', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Il est temps de choisir le type de jeu que tu vas construire pour ton projet.",
        explain:"Un projet concret te fait progresser bien plus vite que des exercices isolés. Choisis un genre qui te motive vraiment.",
        apply:"Astuce : pars sur un genre simple à prototyper si c'est ton premier vrai projet." }
    ],
    plateforme: [
      { id:'jeu-plateforme-intro', title:'Introduction', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Découvre les bases du jeu de plateforme : sauts, gravité, collisions avec le décor.",
        explain:"Un jeu de plateforme repose sur un déplacement précis du personnage et une gestion soignée des sauts et des collisions.",
        apply:"Astuce : peaufine d'abord le saut de ton personnage, c'est le cœur de la sensation de jeu." },
      { id:'jeu-plateforme-app', title:'Application', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Construis un petit niveau de plateforme jouable, avec obstacles et objectif final.",
        explain:"Passer de la théorie à la pratique : un personnage qui court, saute et évite des obstacles jusqu'à la fin du niveau.",
        apply:"Astuce : teste ton niveau souvent, un plateformer se règle surtout en le rejouant." }
    ],
    shoot: [
      { id:'jeu-shoot-intro', title:'Introduction', difficulty:'facile',
        youtubeId:'', ready:true,
        video:"Découvre les bases du shoot them up : tirs, ennemis, patterns et esquive.",
        explain:"Un shoot repose sur des réflexes et des patterns d'ennemis lisibles, avec une difficulté qui monte progressivement.",
        apply:"Astuce : commence avec un seul type d'ennemi et un seul pattern avant d'en ajouter d'autres." },
      { id:'jeu-shoot-app', title:'Application', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Construis une petite vague d'ennemis avec tirs, score et game over.",
        explain:"Passer de la théorie à la pratique : un vaisseau qui tire, des ennemis qui arrivent en vague, et un score qui grimpe.",
        apply:"Astuce : équilibre la cadence de tir et la vitesse des ennemis pour garder le jeu juste assez difficile." }
    ],
    rpg: [
      { id:'jeu-rpg-intro', title:'Introduction', difficulty:'moyen',
        youtubeId:'', ready:true,
        video:"Découvre les bases du RPG : statistiques, combats au tour par tour, progression du personnage.",
        explain:"Un RPG repose sur des systèmes qui s'articulent entre eux : statistiques, combat, inventaire et progression du joueur.",
        apply:"Astuce : commence par un seul système (le combat, par exemple) avant d'ajouter l'inventaire ou les quêtes." },
      { id:'jeu-rpg-app', title:'Application', difficulty:'difficile',
        youtubeId:'', ready:true,
        video:"Construis un combat au tour par tour jouable, avec points de vie et victoire/défaite.",
        explain:"Passer de la théorie à la pratique : un combat où le joueur et l'ennemi s'affrontent tour par tour jusqu'à la victoire.",
        apply:"Astuce : affiche toujours clairement les points de vie, c'est ce qui rend un combat RPG lisible." }
    ],
    polish: [
      { id:'jeu-polish', title:'Polish — la touche finale', difficulty:'moyen',
        youtubeId:'', ready:false,
        video:"Les petits détails qui rendent un jeu agréable à jouer.",
        explain:"Le polish, ce sont les animations, les retours visuels et sonores qui font qu'un jeu \"répond\" bien au joueur.",
        apply:"Astuce : garde du temps à la fin de ton projet uniquement pour le polish, il change tout." }
    ]
  };

  // Regroupements utilisés pour la section "Puzzle du projet" : toutes les
  // compétences Web (tronc commun + Front-End + Back-End) comptent pour la
  // colonne Web, comme toutes les compétences Jeu vidéo (tronc commun +
  // Plateforme/Shoot/RPG + Polish) comptent pour la colonne Jeu vidéo.
  var PUZZLE_GROUPS = {
    web: NODES.web.concat(NODES.frontend, NODES.backend),
    jeu: NODES.jeu.concat(NODES.plateforme, NODES.shoot, NODES.rpg, NODES.polish)
  };

  // Vidéo de transition affichée dans le rond situé juste avant le nœud débloqué.
  // youtubeId : identifiant de la vidéo YouTube (ex: "dQw4w9WgXcQ"), à renseigner
  // manuellement une fois la vidéo tournée — vide par défaut -> affiche un placeholder.
  var EVENT_VIDEOS = {
    'root-choose':        { youtubeId:'', video:"Petit résumé pour faire le pont entre l'intro et le choix de ta voie." },
    'web-css':             { youtubeId:'', video:"Résumé vidéo : pourquoi styliser sa page juste après l'avoir structurée." },
    'web-js':              { youtubeId:'', video:"Résumé vidéo : comment rendre une page vivante grâce à l'interaction." },
    'web-frontend-app':    { youtubeId:'', video:"Résumé vidéo : passer de la théorie Front-End à la pratique." },
    'web-backend-app':     { youtubeId:'', video:"Résumé vidéo : passer de la théorie Back-End à la pratique." },
    'jeu-mecanisme':       { youtubeId:'', video:"Résumé vidéo : transformer du code en règles de jeu amusantes." },
    'jeu-asset':           { youtubeId:'', video:"Résumé vidéo : habiller ton jeu avec des visuels et des sons." },
    'jeu-projet':          { youtubeId:'', video:"Résumé vidéo : place au projet, il est temps de construire un vrai jeu." },
    'jeu-plateforme-app':  { youtubeId:'', video:"Résumé vidéo : passer de la théorie plateforme à la pratique." },
    'jeu-shoot-app':       { youtubeId:'', video:"Résumé vidéo : passer de la théorie shoot them up à la pratique." },
    'jeu-rpg-app':         { youtubeId:'', video:"Résumé vidéo : passer de la théorie RPG à la pratique." }
  };

  // Quand une branche se sépare en plusieurs, un unique rond (avant la fourche)
  // débloque tous les nœuds visés une fois sa vidéo de transition regardée.
  var FORK_EVENTS = [
    { id:'fork-web-jeu', prev:'root-choose', targets:['web-html', 'jeu-code'], youtubeId:'',
      video:"Dernier résumé avant de choisir : Développement Web ou Jeu vidéo ?" },
    { id:'fork-frontend-backend', prev:'web-js', targets:['web-frontend-intro', 'web-backend-intro'], youtubeId:'',
      video:"Résumé vidéo : approfondir le Front-End ou démarrer le Back-End ?" },
    { id:'fork-plateforme-shoot-rpg', prev:'jeu-projet', targets:['jeu-plateforme-intro', 'jeu-shoot-intro', 'jeu-rpg-intro'], youtubeId:'',
      video:"Résumé vidéo : quel genre de jeu veux-tu construire pour ton projet ?" }
  ];

  // À l'inverse d'une fourche, un rond "jonction" attend qu'AU MOINS UNE des
  // branches sources soit terminée pour débloquer le nœud commun qui suit.
  var JOIN_EVENTS = [
    { id:'join-polish', prevs:['jeu-plateforme-app', 'jeu-shoot-app', 'jeu-rpg-app'], target:'jeu-polish', youtubeId:'',
      video:"Résumé vidéo : peu importe le type de jeu choisi, place maintenant à la touche finale." }
  ];

  var DEFAULT_UNLOCKED = ['root-welcome'];

  var STAR_LABEL = { facile:'Facile', moyen:'Moyen', difficile:'Difficile' };

  function getAcquired(){
    try{ return JSON.parse(localStorage.getItem(PIECES_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function setAcquired(arr){ localStorage.setItem(PIECES_KEY, JSON.stringify(arr)); }

  function getUnlocked(){
    try{
      var raw = JSON.parse(localStorage.getItem(UNLOCKED_KEY) || 'null');
      return raw || DEFAULT_UNLOCKED.slice();
    }catch(e){ return DEFAULT_UNLOCKED.slice(); }
  }
  function setUnlocked(arr){ localStorage.setItem(UNLOCKED_KEY, JSON.stringify(arr)); }

  function getWatched(){
    try{ return JSON.parse(localStorage.getItem(WATCHED_KEY) || '[]'); }
    catch(e){ return []; }
  }
  function setWatched(arr){ localStorage.setItem(WATCHED_KEY, JSON.stringify(arr)); }

  function isUnlocked(nodeId){ return getUnlocked().indexOf(nodeId) !== -1; }

  function unlockNode(nodeId){
    var arr = getUnlocked();
    if(arr.indexOf(nodeId) === -1){
      arr.push(nodeId);
      setUnlocked(arr);
    }
  }

  function watchEvent(nextNodeId){
    var arr = getWatched();
    if(arr.indexOf(nextNodeId) === -1){
      arr.push(nextNodeId);
      setWatched(arr);
    }
    unlockNode(nextNodeId);
  }

  function findForkEvent(id){
    var found = null;
    FORK_EVENTS.forEach(function(f){ if(f.id === id) found = f; });
    return found;
  }

  function watchForkEvent(forkId){
    var fork = findForkEvent(forkId);
    if(!fork) return;
    var arr = getWatched();
    if(arr.indexOf(forkId) === -1){
      arr.push(forkId);
      setWatched(arr);
    }
    fork.targets.forEach(unlockNode);
  }

  function findJoinEvent(id){
    var found = null;
    JOIN_EVENTS.forEach(function(j){ if(j.id === id) found = j; });
    return found;
  }

  function watchJoinEvent(joinId){
    var join = findJoinEvent(joinId);
    if(!join) return;
    var arr = getWatched();
    if(arr.indexOf(joinId) === -1){
      arr.push(joinId);
      setWatched(arr);
    }
    unlockNode(join.target);
  }

  function buildChain(container, nodes){
    nodes.forEach(function(node, i){
      if(i > 0){
        var prev = nodes[i - 1];
        var conn = document.createElement('div');
        conn.className = 'connector';
        conn.id = 'evt-' + node.id;
        conn.dataset.prevNode = prev.id;
        conn.dataset.nextNode = node.id;
        conn.innerHTML = '<span class="dot"></span>';
        conn.addEventListener('click', function(){ onConnectorClick(conn); });
        container.appendChild(conn);
      }
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'skill-node' + (node.ready === false ? ' not-ready' : '');
      btn.id = 'node-' + node.id;
      btn.dataset.nodeId = node.id;
      var metaHtml = node.difficulty
        ? '<span class="star ' + node.difficulty + '">✦</span>' + STAR_LABEL[node.difficulty]
        : node.meta;
      btn.innerHTML =
        '<div class="n-title">' + node.title + '</div>' +
        '<div class="n-meta">' + metaHtml + '</div>';
      if(node.ready === false){
        var todo = document.createElement('span');
        todo.className = 'n-todo';
        todo.title = 'Contenu en préparation';
        todo.textContent = '🚧';
        btn.appendChild(todo);
      }
      btn.addEventListener('click', function(){ onNodeClick(node.id); });
      container.appendChild(btn);
    });
  }

  function buildBranchColumn(container, headerHtml, headerClass, nodes){
    var header = document.createElement('div');
    header.className = 'branch-header ' + headerClass;
    header.innerHTML = headerHtml;
    container.appendChild(header);
    buildChain(container, nodes);
  }

  // Construit une fourche à N branches (2 ou plus) à l'intérieur de `container`,
  // avec son rond de transition posé au croisement des lignes. Retourne les
  // colonnes créées, dans le même ordre que `branches`.
  function buildFork(container, branches){
    var forkWrap = document.createElement('div');
    forkWrap.className = 'fork-wrap';
    var fork = document.createElement('ul');
    fork.className = 'sub-fork';
    var cols = branches.map(function(){
      var li = document.createElement('li');
      var col = document.createElement('div');
      col.className = 'branch-col';
      li.appendChild(col);
      fork.appendChild(li);
      return col;
    });
    forkWrap.appendChild(fork);
    container.appendChild(forkWrap);
    branches.forEach(function(b, i){
      buildBranchColumn(cols[i], b.headerHtml, b.headerClass, b.nodes);
    });
    return forkWrap;
  }

  // Ajoute, sous chaque colonne d'une fourche déjà construite (buildFork),
  // les lignes qui convergent vers un point unique en dessous (miroir de la
  // fourche du dessus) — utilisé quand plusieurs branches rejoignent un même
  // nœud (ex: Plateforme/Shoot/RPG qui rejoignent Polish).
  function addMergeLines(forkWrap){
    forkWrap.classList.add('merges');
    var lis = forkWrap.querySelectorAll('ul.sub-fork > li');
    lis.forEach(function(li){
      li.classList.add('merge-col');
      var segA = document.createElement('span');
      segA.className = 'merge-seg merge-a';
      var segB = document.createElement('span');
      segB.className = 'merge-seg merge-b';
      li.appendChild(segA);
      li.appendChild(segB);
    });
  }

  // forkWrap : conteneur position:relative englobant le <ul> de la fourche.
  // Le rond est un frère du <ul> (jamais un enfant) pour ne pas fausser les
  // sélecteurs CSS li:first-child/:last-child qui dessinent les lignes de fourche.
  function buildForkConnector(forkWrap, forkEvent){
    var conn = document.createElement('div');
    conn.className = 'connector fork-dot';
    conn.id = 'evt-' + forkEvent.id;
    conn.dataset.prevNode = forkEvent.prev;
    conn.dataset.forkId = forkEvent.id;
    conn.innerHTML = '<span class="dot"></span>';
    conn.addEventListener('click', function(){ onForkConnectorClick(conn, forkEvent); });
    forkWrap.appendChild(conn);
  }

  // Rond "jonction" : plusieurs branches sources convergent vers un seul nœud.
  // Posé pile au point où les traits de convergence se rejoignent (comme le
  // rond de fourche, mais en bas du forkWrap au lieu du haut). Accessible dès
  // qu'au moins une des branches sources est débloquée.
  function buildJoinConnector(forkWrap, joinEvent){
    var conn = document.createElement('div');
    conn.className = 'connector merge-dot';
    conn.id = 'evt-' + joinEvent.id;
    conn.dataset.joinId = joinEvent.id;
    conn.dataset.joinPrevs = joinEvent.prevs.join(',');
    conn.innerHTML = '<span class="dot"></span>';
    conn.addEventListener('click', function(){ onJoinConnectorClick(conn, joinEvent); });
    forkWrap.appendChild(conn);
  }

  function buildTree(){
    buildChain(document.getElementById('root-chain'), ROOT_NODES);
    buildForkConnector(document.getElementById('root-fork-wrap'), FORK_EVENTS[0]);

    var webCol = document.querySelector('.branch-col[data-branch="web"]');
    buildBranchColumn(webCol, '💻 Web', 'web', NODES.web);

    // Fourche Front-End / Back-End juste après le nœud JavaScript
    var webForkWrap = buildFork(webCol, [
      { headerHtml:'🎨 Front-End', headerClass:'frontend', nodes:NODES.frontend },
      { headerHtml:'🛠️ Back-End', headerClass:'backend', nodes:NODES.backend }
    ]);
    buildForkConnector(webForkWrap, FORK_EVENTS[1]);

    var jeuCol = document.querySelector('.branch-col[data-branch="jeu"]');
    buildBranchColumn(jeuCol, '🎮 Jeu vidéo', 'jeu', NODES.jeu);

    // Fourche Plateforme / Shoot / RPG juste après le nœud Projet
    var jeuForkWrap = buildFork(jeuCol, [
      { headerHtml:'🕹️ Plateforme', headerClass:'plateforme', nodes:NODES.plateforme },
      { headerHtml:'🎯 Shoot', headerClass:'shoot', nodes:NODES.shoot },
      { headerHtml:'⚔️ RPG', headerClass:'rpg', nodes:NODES.rpg }
    ]);
    buildForkConnector(jeuForkWrap, FORK_EVENTS[2]);
    addMergeLines(jeuForkWrap);

    // Jonction : n'importe laquelle des 3 branches suffit à débloquer Polish
    buildJoinConnector(jeuForkWrap, JOIN_EVENTS[0]);
    buildChain(jeuCol, NODES.polish);
  }

  function buildPuzzlePanels(){
    ['web','jeu'].forEach(function(branch){
      var tiles = document.getElementById('tiles-' + branch);
      var list = document.getElementById('list-' + branch);
      PUZZLE_GROUPS[branch].forEach(function(node){
        var tile = document.createElement('div');
        tile.className = 'piece-tile' + (node.ready === false ? ' not-ready' : '');
        tile.id = 'tile-' + node.id;
        tile.textContent = node.ready === false ? '🚧' : '🧩';
        tiles.appendChild(tile);

        var li = document.createElement('li');
        li.id = 'li-' + node.id;
        li.className = node.ready === false ? 'not-ready' : '';
        li.innerHTML = '<span class="chk"></span><span>' + node.title + (node.ready === false ? ' 🚧' : '') + '</span>';
        list.appendChild(li);
      });
    });
  }

  function findNode(id){
    var found = null;
    ROOT_NODES.forEach(function(n){ if(n.id === id) found = n; });
    Object.keys(NODES).forEach(function(branch){
      NODES[branch].forEach(function(n){ if(n.id === id) found = n; });
    });
    return found;
  }

  var currentMode = null; // 'summary' | 'course' | 'event' | 'fork-event' | 'join-event'
  var currentId = null;   // node id (summary/course) or event/fork/join id
  var overlay = document.getElementById('modal-overlay');
  var explainBlock = document.getElementById('modal-explain-block');
  var explainLabel = document.getElementById('modal-explain-label');
  var applyBlock = document.getElementById('modal-apply-block');
  var notReadyBanner = document.getElementById('modal-not-ready-banner');
  var videoEmbed = document.getElementById('modal-video-embed');
  var videoFrame = document.getElementById('modal-video-frame');
  var readyBtn = document.getElementById('modal-ready-btn');
  var pieceBtn = document.getElementById('modal-piece-btn');
  var pieceIcon = document.getElementById('modal-piece-icon');
  var pieceLabel = document.getElementById('modal-piece-label');
  var piecePrompt = document.getElementById('modal-piece-prompt');

  // Fonction à appeler pour "regarder" chaque type de rond de transition.
  var WATCH_TRANSITION = { event:watchEvent, 'fork-event':watchForkEvent, 'join-event':watchJoinEvent };

  function onNodeClick(nodeId){
    openSummaryModal(nodeId);
  }

  function onConnectorClick(conn){
    var prevId = conn.dataset.prevNode;
    var nextId = conn.dataset.nextNode;
    if(!isUnlocked(prevId)) return;
    openEventModal(nextId);
  }

  function onForkConnectorClick(conn, forkEvent){
    if(!isUnlocked(forkEvent.prev)) return;
    openForkEventModal(forkEvent);
  }

  function onJoinConnectorClick(conn, joinEvent){
    var accessible = joinEvent.prevs.some(function(id){ return isUnlocked(id); });
    if(!accessible) return;
    openJoinEventModal(joinEvent);
  }

  function populateVideo(node){
    videoEmbed.classList.add('shown');
    videoEmbed.classList.toggle('has-video', !!node.youtubeId);
    videoFrame.src = node.youtubeId ? ('https://www.youtube.com/embed/' + node.youtubeId) : '';
    document.getElementById('modal-video').textContent = node.video;
  }

  function openSummaryModal(id){
    var node = findNode(id);
    if(!node) return;
    currentMode = 'summary';
    currentId = id;
    document.getElementById('modal-title').textContent = node.title.replace(/&lt;/g,'<');
    populateVideo(node);

    explainLabel.textContent = '📝 Résumé écrit';
    document.getElementById('modal-explain').textContent = node.explain;
    explainBlock.style.display = '';
    applyBlock.style.display = 'none';
    notReadyBanner.classList.toggle('show', node.ready === false);

    pieceBtn.style.display = 'none';
    piecePrompt.style.display = 'none';

    var unlocked = isUnlocked(id);
    readyBtn.classList.add('show');
    readyBtn.classList.toggle('locked', !unlocked);
    readyBtn.disabled = !unlocked;
    overlay.classList.add('open');
  }

  function openCourseModal(id){
    var node = findNode(id);
    if(!node) return;
    currentMode = 'course';
    currentId = id;
    document.getElementById('modal-title').textContent = node.title.replace(/&lt;/g,'<');
    populateVideo(node);

    explainLabel.textContent = '📖 Cours — explication';
    document.getElementById('modal-explain').textContent = node.explain;
    document.getElementById('modal-apply').textContent = node.apply;
    explainBlock.style.display = '';
    applyBlock.style.display = '';

    notReadyBanner.classList.toggle('show', node.ready === false);
    readyBtn.classList.remove('show');
    pieceBtn.style.display = node.noPiece ? 'none' : 'flex';
    pieceBtn.classList.add('icon-only');
    pieceLabel.classList.add('sr-only');
    piecePrompt.style.display = node.noPiece ? 'none' : '';
    refreshModalFooter();
    overlay.classList.add('open');
  }

  // Coquille commune aux trois types de pop-up "vidéo de transition"
  // (rond simple, rond de fourche, rond de jonction). videoNode : objet
  // { youtubeId, video } — réutilise populateVideo(), comme pour les cours.
  function openTransitionModal(mode, id, videoNode){
    currentMode = mode;
    currentId = id;
    document.getElementById('modal-title').textContent = '🎬 Vidéo de transition';
    populateVideo(videoNode);
    explainBlock.style.display = 'none';
    applyBlock.style.display = 'none';
    notReadyBanner.classList.remove('show');
    readyBtn.classList.remove('show');
    pieceBtn.style.display = 'flex';
    pieceBtn.classList.remove('icon-only');
    pieceLabel.classList.remove('sr-only');
    piecePrompt.style.display = 'none';
    refreshModalFooter();
    overlay.classList.add('open');
  }

  function openEventModal(nextId){
    openTransitionModal('event', nextId, EVENT_VIDEOS[nextId] || { youtubeId:'', video:'' });
  }

  function openForkEventModal(forkEvent){
    openTransitionModal('fork-event', forkEvent.id, forkEvent);
  }

  function openJoinEventModal(joinEvent){
    openTransitionModal('join-event', joinEvent.id, joinEvent);
  }

  function closeModal(){
    overlay.classList.remove('open');
    videoFrame.src = '';
    currentMode = null;
    currentId = null;
  }

  readyBtn.addEventListener('click', function(){
    if(readyBtn.disabled || !currentId) return;
    openCourseModal(currentId);
  });

  function refreshModalFooter(){
    if(WATCH_TRANSITION[currentMode]){
      pieceBtn.disabled = false;
      pieceBtn.classList.remove('notready');
      pieceIcon.textContent = '▶️';
      if(getWatched().indexOf(currentId) !== -1){
        pieceBtn.classList.add('done');
        pieceLabel.textContent = 'Suite débloquée ✓';
      } else {
        pieceBtn.classList.remove('done');
        pieceLabel.textContent = "J'ai regardé, débloquer la suite";
      }
      return;
    }

    var node = findNode(currentId);
    if(node && node.ready === false){
      pieceBtn.classList.remove('done');
      pieceBtn.classList.add('notready');
      pieceBtn.disabled = true;
      pieceIcon.textContent = '🚧';
      pieceLabel.textContent = 'Bientôt disponible';
      piecePrompt.style.display = 'none';
      return;
    }

    pieceBtn.disabled = false;
    pieceBtn.classList.remove('notready');
    var got = getAcquired().indexOf(currentId) !== -1;
    if(got){
      pieceBtn.classList.add('done');
      pieceIcon.textContent = '✅';
      pieceLabel.textContent = 'Pièce obtenue ✓';
      if(!node || !node.noPiece) piecePrompt.style.display = 'none';
    } else {
      pieceBtn.classList.remove('done');
      pieceIcon.textContent = '🧩';
      pieceLabel.textContent = 'Obtenir la pièce du puzzle';
      if(!node || !node.noPiece) piecePrompt.style.display = '';
    }
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });

  pieceBtn.addEventListener('click', function(){
    if(!currentId || pieceBtn.disabled) return;
    if(WATCH_TRANSITION[currentMode]){
      WATCH_TRANSITION[currentMode](currentId);
      refreshModalFooter();
      renderLockState();
      return;
    }
    var acquired = getAcquired();
    if(acquired.indexOf(currentId) === -1){
      acquired.push(currentId);
      setAcquired(acquired);
      refreshModalFooter();
      renderProgress();
    }
  });

  document.getElementById('reset-btn').addEventListener('click', function(){
    setAcquired([]);
    setUnlocked(DEFAULT_UNLOCKED.slice());
    setWatched([]);
    renderProgress();
    renderLockState();
    if(overlay.classList.contains('open')) refreshModalFooter();
  });

  function renderProgress(){
    var acquired = getAcquired();
    ['web','jeu'].forEach(function(branch){
      var total = PUZZLE_GROUPS[branch].length;
      var done = 0;
      PUZZLE_GROUPS[branch].forEach(function(node){
        var got = acquired.indexOf(node.id) !== -1;
        if(got) done++;

        var nodeBtn = document.getElementById('node-' + node.id);
        var check = nodeBtn.querySelector('.n-check');
        if(got){
          nodeBtn.classList.add('acquired');
          if(!check){
            check = document.createElement('span');
            check.className = 'n-check';
            check.textContent = '✓';
            nodeBtn.appendChild(check);
          }
        } else {
          nodeBtn.classList.remove('acquired');
          if(check) check.remove();
        }

        var tile = document.getElementById('tile-' + node.id);
        tile.classList.toggle('filled', got);

        var li = document.getElementById('li-' + node.id);
        li.classList.toggle('done', got);
      });
      document.getElementById('progress-' + branch).style.width = (total ? (done / total * 100) : 0) + '%';
    });
  }

  function renderLockState(){
    var unlocked = getUnlocked();
    var watched = getWatched();

    document.querySelectorAll('.skill-node[data-node-id]').forEach(function(btn){
      var id = btn.dataset.nodeId;
      btn.classList.toggle('locked', unlocked.indexOf(id) === -1);
    });

    document.querySelectorAll('.connector[data-next-node]').forEach(function(conn){
      var nextId = conn.dataset.nextNode;
      var prevId = conn.dataset.prevNode;
      var isLocked = unlocked.indexOf(prevId) === -1;
      conn.classList.toggle('watched', watched.indexOf(nextId) !== -1);
      conn.classList.toggle('locked', isLocked);
      var dot = conn.querySelector('.dot');
      dot.textContent = isLocked ? '🔒' : '';
    });

    document.querySelectorAll('.connector[data-fork-id]').forEach(function(conn){
      var forkId = conn.dataset.forkId;
      var prevId = conn.dataset.prevNode;
      var isLocked = unlocked.indexOf(prevId) === -1;
      conn.classList.toggle('watched', watched.indexOf(forkId) !== -1);
      conn.classList.toggle('locked', isLocked);
      var dot = conn.querySelector('.dot');
      dot.textContent = isLocked ? '🔒' : '';
    });

    document.querySelectorAll('.connector[data-join-id]').forEach(function(conn){
      var joinId = conn.dataset.joinId;
      var prevIds = conn.dataset.joinPrevs.split(',');
      var isLocked = !prevIds.some(function(id){ return unlocked.indexOf(id) !== -1; });
      conn.classList.toggle('watched', watched.indexOf(joinId) !== -1);
      conn.classList.toggle('locked', isLocked);
      var dot = conn.querySelector('.dot');
      dot.textContent = isLocked ? '🔒' : '';
    });
  }

  // Si l'arbre est plus large que l'écran, on centre le défilement horizontal
  // au chargement pour éviter qu'une branche (ex: RPG) parte hors champ.
  function centerTreeScroll(){
    var scroller = document.querySelector('.tree-scroll');
    if(!scroller) return;
    scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
  }

  buildTree();
  buildPuzzlePanels();
  renderProgress();
  renderLockState();
  centerTreeScroll();
})();
