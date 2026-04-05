/**
 * Restoran Slon — menu.js
 * Sidebar navigacija, aktivni tab, smooth scroll po kategorijama
 */

(function () {
  'use strict';

  const sidebarLinks = document.querySelectorAll('.menu-sidebar__link');
  const mobileTabs = document.querySelectorAll('.menu-tab');
  const categories = document.querySelectorAll('.menu-category');
  const nav = document.getElementById('nav');

  // Nav visina za offset
  function getNavHeight() {
    return nav ? nav.offsetHeight : 72;
  }

  // Smooth scroll do kategorije
  function scrollToCategory(id) {
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - getNavHeight() - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Aktiviraj sidebar link
  function setActiveLink(id) {
    sidebarLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.target === id);
    });
    mobileTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.target === id);
    });
  }

  // Klik na sidebar link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.dataset.target;
      scrollToCategory(target);
      setActiveLink(target);
    });
  });

  // Klik na mobile tab
  mobileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      scrollToCategory(target);
      setActiveLink(target);
      // Scroll tab u vidno polje
      tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  });

  // Intersection Observer za auto-highlight na skrolu
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    {
      rootMargin: `-${getNavHeight() + 80}px 0px -60% 0px`,
      threshold: 0
    }
  );

  categories.forEach(cat => observer.observe(cat));

})();
