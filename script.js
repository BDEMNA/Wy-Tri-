// ===== MENU HAMBURGER =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('show');
});

// ===== MODE SOMBRE / CLAIR =====
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// ===== ANIMATION AU SCROLL =====
const scrollElements = document.querySelectorAll('.scroll-anim');

window.addEventListener('scroll', () => {
  scrollElements.forEach(el => {
    const position = el.getBoundingClientRect().top;
    if (position < window.innerHeight - 100) {
      el.classList.add('visible');
    }
  });
});

// ===== FILTRE COMBINÉ =====
const categorySelect = document.getElementById('categorySelect');
const marqueSelect = document.getElementById('marqueSelect');
const prixSelect = document.getElementById('prixSelect');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetFilters');
const productGrid = document.getElementById('productGrid');
const allProducts = productGrid.querySelectorAll('.card');
const productCount = document.getElementById('productCount');
const noResults = document.getElementById('noResults');

function applyFilters() {
  const cat = categorySelect.value;
  const marque = marqueSelect.value;
  const prix = prixSelect.value;

  let visibleCount = 0;

  allProducts.forEach(product => {
    const pCat = product.dataset.category;
    const pMarque = product.dataset.marque;
    const pPrix = parseInt(product.dataset.prix);

    let visible = true;

    if (cat !== 'all' && pCat !== cat) visible = false;
    if (marque !== 'all' && pMarque !== marque) visible = false;
    if (prix === 'low' && pPrix >= 10000) visible = false;
    if (prix === 'mid' && (pPrix < 10000 || pPrix > 20000)) visible = false;
    if (prix === 'high' && pPrix <= 20000) visible = false;

    product.style.display = visible ? 'block' : 'none';
    if (visible) visibleCount++;
  });

  // Mise à jour du compteur
  productCount.textContent = `Nombre de produits : ${visibleCount}`;

  // Message si aucun produit
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

function applySort() {
  const sortValue = sortSelect.value;
  const productsArray = Array.from(allProducts);

  productsArray.sort((a, b) => {
    const priceA = parseInt(a.dataset.prix);
    const priceB = parseInt(b.dataset.prix);
    const dateA = new Date(a.dataset.date || '2025-01-01');
    const dateB = new Date(b.dataset.date || '2025-01-01');
    const popA = parseInt(a.dataset.popularite || 0);
    const popB = parseInt(b.dataset.popularite || 0);

    switch (sortValue) {
      case 'priceAsc': return priceA - priceB;
      case 'priceDesc': return priceB - priceA;
      case 'new': return dateB - dateA;
      case 'popular': return popB - popA;
      default: return 0;
    }
  });

  productsArray.forEach(p => productGrid.appendChild(p));

  // Réapplique les filtres après tri
  applyFilters();
}

function resetFilters() {
  categorySelect.value = 'all';
  marqueSelect.value = 'all';
  prixSelect.value = 'all';
  sortSelect.value = 'default';
  allProducts.forEach(p => p.style.display = 'block');

  productCount.textContent = `Nombre de produits : ${allProducts.length}`;
  noResults.style.display = 'none';
}

// Écouteurs
categorySelect.addEventListener('change', () => { applyFilters(); });
marqueSelect.addEventListener('change', () => { applyFilters(); });
prixSelect.addEventListener('change', () => { applyFilters(); });
sortSelect.addEventListener('change', () => { applySort(); });
resetBtn.addEventListener('click', () => { resetFilters(); });

// ===== BARRE DE RECHERCHE =====
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  let visibleCount = 0;

  allProducts.forEach(product => {
    const title = product.querySelector('h3').textContent.toLowerCase();
    const category = product.dataset.category.toLowerCase();

    if (title.includes(searchTerm) || category.includes(searchTerm)) {
      product.style.display = 'block';
      visibleCount++;
    } else {
      product.style.display = 'none';
    }
  });

  productCount.textContent = `Nombre de produits : ${visibleCount}`;
  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
});

// ===== FIL D'ARIANE DYNAMIQUE =====
const breadcrumb = document.querySelector('.breadcrumb');

if (breadcrumb) {
  const path = window.location.pathname.split('/').pop();

  const hierarchy = {
    'index.html': [{ name: 'Accueil', url: 'index.html' }],
    'produits.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'Produits', url: 'produits.html' }
    ],
    'produit-sac.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'Fournitures scolaires', url: 'categories.html#fourniture' },
      { name: 'Sac scolaire', url: 'produit-sac.html' }
    ],
    'produit-Carte SSD Lexar.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'Accessoires informatiques', url: 'categories.html#accessoire' },
      { name: 'Stockage', url: 'categories.html#stockage' },
      { name: 'SSD Lexar', url: 'produit-Carte SSD Lexar.html' }
    ],
    'produit-ecouteurs.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'Appareils électroniques', url: 'categories.html#electronique' },
      { name: 'Écouteurs Bluetooth', url: 'produit-ecouteurs.html' }
    ],
    'contact.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'Contact', url: 'contact.html' }
    ],
    'a-propos.html': [
      { name: 'Accueil', url: 'index.html' },
      { name: 'À propos', url: 'a-propos.html' }
    ]
  };

  const levels = hierarchy[path] || [
    { name: 'Accueil', url: 'index.html' },
    { name: path.replace('.html', '').replace(/-/g, ' '), url: '#' }
  ];

  breadcrumb.innerHTML = levels.map((level, index) => {
    if (index === levels.length - 1) {
      return `<span>${level.name}</span>`;
    } else {
      return `<a href="${level.url}">${level.name}</a> &gt; `;
    }
  }).join('');
}
