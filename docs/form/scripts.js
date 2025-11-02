(function () {
  const analytics = (name, detail = {}) => {
    if (!name) return;
    console.log(`[analytics] ${name}`, detail);
  };

  const initSearch = () => {
    const searchInput = document.querySelector('[data-help-search]');
    const questions = document.querySelectorAll('[data-question]');
    if (!searchInput || !questions.length) return;

    const normalize = (value) => value.toLowerCase().trim();

    const filterQuestions = () => {
      const query = normalize(searchInput.value);
      analytics('help_search', { query });
      questions.forEach((question) => {
        const text = normalize(question.dataset.question || '');
        const match = !query || text.includes(query);
        question.parentElement.style.display = match ? '' : 'none';
      });
    };

    searchInput.addEventListener('input', filterQuestions);
  };

  const initAccordions = () => {
    const accordions = document.querySelectorAll('[data-accordion]');

    accordions.forEach((accordion) => {
      accordion.querySelectorAll('button[data-accordion-button]').forEach((button) => {
        const content = document.getElementById(button.getAttribute('aria-controls'));
        if (!content) return;

        const setExpanded = (expanded) => {
          button.setAttribute('aria-expanded', expanded);
          if (expanded) {
            content.style.maxHeight = `${content.scrollHeight}px`;
            analytics(button.dataset.analyticsOpen || 'faq_open', {
              label: button.dataset.analyticsLabel,
            });
          } else {
            content.style.maxHeight = '0px';
          }
        };

        // initialize collapsed
        setExpanded(button.getAttribute('aria-expanded') === 'true');

        button.addEventListener('click', () => {
          const isExpanded = button.getAttribute('aria-expanded') === 'true';
          setExpanded(!isExpanded);
        });

        button.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            button.click();
          }
        });
      });
    });
  };

  const initChips = () => {
    const chips = document.querySelectorAll('[data-chip-target]');
    chips.forEach((chip) => {
      const targetId = chip.dataset.chipTarget;
      if (!targetId) return;
      chip.addEventListener('click', () => {
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  const initCtas = () => {
    document.querySelectorAll('[data-analytics]').forEach((el) => {
      const eventName = el.dataset.analytics;
      el.addEventListener('click', () => analytics(eventName, {
        label: el.dataset.analyticsLabel,
      }));
    });
  };

  const initTimeline = () => {
    const timeline = document.querySelector('[data-timeline]');
    if (!timeline) return;
    const btn = timeline.querySelector('[data-timeline-cta]');
    if (btn) {
      btn.addEventListener('click', () => analytics('return_timeline_cta'));
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initAccordions();
    initChips();
    initCtas();
    initTimeline();
  });
})();
