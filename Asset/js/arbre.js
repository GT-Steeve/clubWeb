(function(){
  var STORAGE_KEY = 'v3-puzzle-pieces';

  var NODES = {
    web: [
      { id:'web-html', title:'HTML — les fondations', difficulty:'facile',
        video:"Découvre les balises HTML et la structure d'une page web.",
        explain:"Le HTML pose le squelette de toute page : titres, paragraphes, images, liens. C'est la première pièce de ton puzzle Web.",
        apply:"Astuce : commence toujours par la structure (header, main, footer) avant de remplir le contenu." },
      { id:'web-css', title:'CSS — l\'habillage', difficulty:'facile',
        video:"Apprends à colorer, espacer et mettre en page ton HTML avec le CSS.",
        explain:"Le CSS donne vie au HTML : couleurs, mise en page, responsive. Sans lui, ta page reste austère.",
        apply:"Astuce : utilise flexbox ou grid pour organiser tes éléments plutôt que des positions absolues." },
      { id:'web-js', title:'JavaScript — l\'interaction', difficulty:'moyen',
        video:"Rends ta page vivante : clics, animations, réactions à l'utilisateur.",
        explain:"Le JavaScript ajoute l'interactivité : boutons qui réagissent, contenu qui change, données qui se mettent à jour.",
        apply:"Astuce : commence petit — un bouton qui change de couleur au clic — avant de viser plus complexe." },
      { id:'web-backend', title:'Backend — où l\'animation', difficulty:'difficile',
        video:"Ce qui se passe côté serveur : traiter les données, répondre aux requêtes.",
        explain:"Le backend gère la logique cachée : recevoir une demande, la traiter, renvoyer une réponse. Il fait tourner l'application.",
        apply:"Astuce : teste toujours ton backend avec des cas simples avant d'ajouter de la complexité." },
      { id:'web-staticdyn', title:'Statique &lt; Dynamique', difficulty:'moyen',
        video:"La différence entre une page figée et une page qui s'adapte à l'utilisateur.",
        explain:"Une page statique affiche toujours le même contenu. Une page dynamique change selon les données, l'utilisateur ou ses actions.",
        apply:"Astuce : identifie ce qui doit changer sur ta page, c'est là que le dynamique devient utile." },
      { id:'web-bdd', title:'Base de données', difficulty:'difficile',
        video:"Stocke et retrouve l'information : utilisateurs, articles, scores...",
        explain:"La base de données conserve les informations de ton site sur le long terme, même après un redémarrage du serveur.",
        apply:"Astuce : dessine ton schéma de données sur papier avant d'écrire la moindre ligne de code." }
    ],
    jeu: [
      { id:'jeu-code', title:'Code — la logique du jeu', difficulty:'moyen',
        video:"Les bases pour programmer le comportement de ton jeu.",
        explain:"Le code définit les règles : que se passe-t-il quand le joueur appuie sur une touche, quand deux objets se rencontrent...",
        apply:"Astuce : découpe ton jeu en petites fonctions claires (déplacer, tirer, collision...)." },
      { id:'jeu-mecanisme', title:'Mécanisme — les règles', difficulty:'difficile',
        video:"Conçois des règles de jeu claires et amusantes.",
        explain:"Le mécanisme, c'est ce qui rend un jeu intéressant : la prise de risque, la progression, la difficulté qui s'ajuste.",
        apply:"Astuce : teste ton mécanisme avec du papier et des jetons avant même d'écrire du code." },
      { id:'jeu-asset', title:'Asset graphique / sonore', difficulty:'facile',
        video:"Ajoute des images, sprites et sons pour habiller ton jeu.",
        explain:"Les assets donnent une identité visuelle et sonore à ton jeu : personnages, décors, musiques, effets.",
        apply:"Astuce : reste cohérent sur le style graphique, même avec des assets simples." },
      { id:'jeu-polish', title:'Polish — la touche finale', difficulty:'moyen',
        video:"Les petits détails qui rendent un jeu agréable à jouer.",
        explain:"Le polish, ce sont les animations, les retours visuels et sonores qui font qu'un jeu \"répond\" bien au joueur.",
        apply:"Astuce : garde du temps à la fin de ton projet uniquement pour le polish, il change tout." }
    ]
  };

  var BRANCH_LABEL = { web:'Web', jeu:'Jeu vidéo' };
  var STAR_LABEL = { facile:'Facile', moyen:'Moyen', difficile:'Difficile' };

  function getAcquired(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }catch(e){ return []; }
  }
  function setAcquired(arr){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  function buildTree(){
    ['web','jeu'].forEach(function(branch){
      var col = document.querySelector('.branch-col[data-branch="'+branch+'"]');
      var header = document.createElement('div');
      header.className = 'branch-header ' + branch;
      header.innerHTML = (branch === 'web' ? '💻 Développement Web' : '🎮 Jeu vidéo');
      col.appendChild(header);

      NODES[branch].forEach(function(node, i){
        if(i > 0){
          var conn = document.createElement('div');
          conn.className = 'connector';
          conn.innerHTML = '<span class="dot"></span>';
          col.appendChild(conn);
        }
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'skill-node';
        btn.id = 'node-' + node.id;
        btn.dataset.nodeId = node.id;
        btn.dataset.branch = branch;
        btn.innerHTML =
          '<div class="n-title">' + node.title + '</div>' +
          '<div class="n-meta"><span class="star ' + node.difficulty + '">✦</span>' + STAR_LABEL[node.difficulty] + '</div>';
        btn.addEventListener('click', function(){ openModal(node.id, branch); });
        col.appendChild(btn);
      });
    });
  }

  function buildPuzzlePanels(){
    ['web','jeu'].forEach(function(branch){
      var tiles = document.getElementById('tiles-' + branch);
      var list = document.getElementById('list-' + branch);
      NODES[branch].forEach(function(node){
        var tile = document.createElement('div');
        tile.className = 'piece-tile';
        tile.id = 'tile-' + node.id;
        tile.textContent = '🧩';
        tiles.appendChild(tile);

        var li = document.createElement('li');
        li.id = 'li-' + node.id;
        li.innerHTML = '<span class="chk"></span><span>' + node.title + '</span>';
        list.appendChild(li);
      });
    });
  }

  function findNode(id){
    var found = null;
    ['web','jeu'].forEach(function(branch){
      NODES[branch].forEach(function(n){ if(n.id === id) found = n; });
    });
    return found;
  }

  var currentNodeId = null;
  var overlay = document.getElementById('modal-overlay');

  function openModal(id){
    var node = findNode(id);
    if(!node) return;
    currentNodeId = id;
    document.getElementById('modal-title').textContent = node.title.replace(/&lt;/g,'<');
    document.getElementById('modal-video').textContent = node.video;
    document.getElementById('modal-explain').textContent = node.explain;
    document.getElementById('modal-apply').textContent = node.apply;
    refreshPieceButton();
    overlay.classList.add('open');
  }
  function closeModal(){
    overlay.classList.remove('open');
    currentNodeId = null;
  }
  function refreshPieceButton(){
    var acquired = getAcquired();
    var btn = document.getElementById('modal-piece-btn');
    var label = document.getElementById('modal-piece-label');
    if(acquired.indexOf(currentNodeId) !== -1){
      btn.classList.add('done');
      label.textContent = 'Pièce obtenue ✓';
    } else {
      btn.classList.remove('done');
      label.textContent = 'Obtenir la pièce du puzzle';
    }
  }

  document.getElementById('modal-close').addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
  document.getElementById('modal-piece-btn').addEventListener('click', function(){
    if(!currentNodeId) return;
    var acquired = getAcquired();
    if(acquired.indexOf(currentNodeId) === -1){
      acquired.push(currentNodeId);
      setAcquired(acquired);
      refreshPieceButton();
      renderProgress();
    }
  });
  document.getElementById('planning-node').addEventListener('click', function(){
    document.getElementById('puzzle-section').scrollIntoView({ behavior:'smooth', block:'start' });
  });
  document.getElementById('reset-btn').addEventListener('click', function(){
    setAcquired([]);
    renderProgress();
    if(overlay.classList.contains('open')) refreshPieceButton();
  });

  function renderProgress(){
    var acquired = getAcquired();
    ['web','jeu'].forEach(function(branch){
      var total = NODES[branch].length;
      var done = 0;
      NODES[branch].forEach(function(node){
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

  buildTree();
  buildPuzzlePanels();
  renderProgress();
})();
