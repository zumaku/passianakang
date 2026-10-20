/**
 * GenderSelect - Komponen custom select khusus pemilihan jenis kelamin (Pria / Wanita)
 * dengan ikon gender visual berwarna (Teal untuk Pria, Pink untuk Wanita).
 */
export class GenderSelect {
  constructor({ selectElement }) {
    this.selectElement = selectElement;
    this.selectedValue = this.selectElement.value || 'male';
    this.isOpen = false;

    // Sembunyikan elemen asli tapi biarkan di DOM
    this.selectElement.style.display = 'none';
    this.selectElement.setAttribute('tabindex', '-1');
    this.selectElement.setAttribute('aria-hidden', 'true');

    this.initDOM();
    this.bindEvents();
    this.updateDisplay();
  }

  getGenderHTML(gender) {
    if (gender === 'female') {
      return `
        <div class="custom-gender-badge badge-pink">
          <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="5"></circle>
            <line x1="12" y1="13" x2="12" y2="21"></line>
            <line x1="8" y1="17" x2="16" y2="17"></line>
          </svg>
        </div>
        <span class="custom-gender-label">Wanita</span>
      `;
    }
    return `
      <div class="custom-gender-badge badge-blue">
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="14" r="5"></circle>
          <line x1="19" y1="5" x2="13.6" y2="10.4"></line>
          <polyline points="15 5 19 5 19 9"></polyline>
        </svg>
      </div>
      <span class="custom-gender-label">Pria</span>
    `;
  }

  initDOM() {
    this.container = document.createElement('div');
    this.container.className = 'custom-select-container custom-gender-select';

    // Trigger Button
    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'custom-select-trigger custom-gender-trigger';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');

    this.selectionDisplay = document.createElement('div');
    this.selectionDisplay.className = 'custom-gender-selection';

    this.arrowIcon = document.createElement('span');
    this.arrowIcon.className = 'custom-select-arrow';
    this.arrowIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;

    this.trigger.appendChild(this.selectionDisplay);
    this.trigger.appendChild(this.arrowIcon);
    this.container.appendChild(this.trigger);

    // Dropdown Panel
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'custom-select-dropdown custom-gender-dropdown';
    this.dropdown.setAttribute('role', 'listbox');

    this.dropdown.innerHTML = `
      <div class="custom-gender-option" data-value="male" role="option">
        <div class="custom-gender-option-content">
          ${this.getGenderHTML('male')}
        </div>
        <svg class="custom-select-check" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="custom-gender-option" data-value="female" role="option">
        <div class="custom-gender-option-content">
          ${this.getGenderHTML('female')}
        </div>
        <svg class="custom-select-check" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
    `;

    this.container.appendChild(this.dropdown);

    // Sisipkan container setelah selectElement asli
    this.selectElement.parentNode.insertBefore(this.container, this.selectElement.nextSibling);
  }

  bindEvents() {
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    this.dropdown.querySelectorAll('.custom-gender-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value');
        this.setValue(val);
        this.close();
      });
    });

    // Menutup jika klik di luar
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });

    // Escape untuk tutup
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    // Tutup dropdown lain yang terbuka
    document.querySelectorAll('.custom-select-container.open').forEach(el => {
      if (el !== this.container) {
        el.classList.remove('open');
        const trigger = el.querySelector('.custom-select-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });

    this.isOpen = true;
    this.container.classList.add('open');
    this.trigger.setAttribute('aria-expanded', 'true');
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.classList.remove('open');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  setValue(val) {
    this.selectedValue = (val === 'female') ? 'female' : 'male';
    this.selectElement.value = this.selectedValue;
    this.selectElement.dispatchEvent(new Event('change', { bubbles: true }));
    this.updateDisplay();
  }

  getValue() {
    return this.selectedValue;
  }

  updateDisplay() {
    this.selectionDisplay.innerHTML = this.getGenderHTML(this.selectedValue);

    this.dropdown.querySelectorAll('.custom-gender-option').forEach(opt => {
      if (opt.getAttribute('data-value') === this.selectedValue) {
        opt.classList.add('selected');
      } else {
        opt.classList.remove('selected');
      }
    });
  }
}
