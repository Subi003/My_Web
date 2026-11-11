(() => {
  'use strict';

  const projectsGrid = document.querySelector('.projects-grid');
  if (!projectsGrid) return;

  const cards = [...projectsGrid.querySelectorAll('.project-card')];
  const sectionHeading = document.querySelector('.section-head');
  if (!cards.length || !sectionHeading) return;

  const filters = [
    { label: 'All projects', category: 'all' },
    { label: 'AI product', category: 'ai product' },
    { label: 'Portfolio', category: 'portfolio' },
    { label: 'Frontend', category: 'frontend' },
    { label: 'UX', category: 'ux' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    .project-filter-tools { display: grid; gap: 14px; margin: 0 0 18px; }
    .project-filter-list { display: flex; flex-wrap: wrap; gap: 9px; }
    .project-filter-button {
      min-height: 40px; padding: 8px 14px; border: 1px solid var(--line);
      border-radius: 999px; color: var(--muted); background: var(--panel-soft);
      font: inherit; font-size: .84rem; font-weight: 700; cursor: pointer;
      transition: color .18s ease, border-color .18s ease, background .18s ease, transform .18s ease;
    }
    .project-filter-button:hover { transform: translateY(-1px); color: var(--text); border-color: var(--primary); }
    .project-filter-button[aria-pressed="true"] {
      color: #07111f; border-color: transparent;
      background: linear-gradient(120deg, var(--primary), #4ec8ff 50%, #8b5cf6);
    }
    .project-filter-search {
      width: min(100%, 380px); min-height: 44px; padding: 10px 14px;
      border: 1px solid var(--line); border-radius: 12px; color: var(--text);
      background: var(--panel); font: inherit;
    }
    .project-filter-search::placeholder { color: var(--muted); }
    .project-filter-search:focus-visible, .project-filter-button:focus-visible {
      outline: 3px solid color-mix(in srgb, var(--primary) 40%, transparent); outline-offset: 2px;
    }
    .project-filter-count { margin: 0; min-height: 1.4em; color: var(--muted); font-size: .84rem; }
    .project-filter-empty {
      grid-column: 1 / -1; margin: 0; padding: 22px; border: 1px dashed var(--line);
      border-radius: 18px; color: var(--muted); text-align: center; background: var(--panel-soft);
    }
    .project-card[hidden] { display: none; }
    @media (prefers-reduced-motion: reduce) {
      .project-filter-button { transition: none; }
      .project-filter-button:hover { transform: none; }
    }
  `;
  document.head.appendChild(style);

  const tools = document.createElement('div');
  tools.className = 'project-filter-tools';

  const buttonList = document.createElement('div');
  buttonList.className = 'project-filter-list';
  buttonList.setAttribute('role', 'group');
  buttonList.setAttribute('aria-label', 'Filter projects by category');

  const search = document.createElement('input');
  search.className = 'project-filter-search';
  search.type = 'search';
  search.placeholder = 'Search projects';
  search.setAttribute('aria-label', 'Search project names, descriptions, and skills');
  search.autocomplete = 'off';

  const count = document.createElement('p');
  count.className = 'project-filter-count';
  count.setAttribute('aria-live', 'polite');
  count.setAttribute('aria-atomic', 'true');

  const empty = document.createElement('p');
  empty.className = 'project-filter-empty';
  empty.textContent = 'No projects match your filters. Try another category or search term.';
  empty.hidden = true;

  tools.append(buttonList, search, count);
  sectionHeading.insertAdjacentElement('afterend', tools);
  projectsGrid.insertAdjacentElement('beforeend', empty);

  const projectData = cards.map((card) => {
    const badge = card.querySelector('.project-badge')?.textContent.trim() || '';
    const tags = [...card.querySelectorAll('.project-tags span')].map((tag) => tag.textContent.trim());
    const searchableText = card.textContent.toLocaleLowerCase();
    const categories = new Set([badge, ...tags].map((value) => value.toLocaleLowerCase()));
    return { card, categories, searchableText };
  });

  let selectedCategory = 'all';

  function updateProjects() {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    projectData.forEach(({ card, categories, searchableText }) => {
      const matchesCategory = selectedCategory === 'all' || categories.has(selectedCategory);
      const matchesSearch = !query || searchableText.includes(query);
      const visible = matchesCategory && matchesSearch;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    empty.hidden = visibleCount > 0;
    count.textContent = `Showing ${visibleCount} of ${cards.length} project${cards.length === 1 ? '' : 's'}.`;
  }

  filters.forEach(({ label, category }, index) => {
    const button = document.createElement('button');
    button.className = 'project-filter-button';
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-pressed', String(index === 0));
    button.addEventListener('click', () => {
      selectedCategory = category;
      buttonList.querySelectorAll('button').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      updateProjects();
    });
    buttonList.appendChild(button);
  });

  search.addEventListener('input', updateProjects);
  updateProjects();
})();
