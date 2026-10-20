/**
 * CustomSelect - Component select kustom yang menampilkan avatar foto anggota keluarga,
 * nama, gelar, serta pencarian instan dan sinkronisasi dengan elemen <select> bawaan.
 */
export class CustomSelect {
  constructor({ selectElement, placeholder = '-- Pilih Anggota --', emptyLabel = '-- Tanpa Pilihan --' }) {
    this.selectElement = selectElement;
    this.placeholder = placeholder;
    this.emptyLabel = emptyLabel;
    this.options = [];
    this.selectedValue = '';
    this.isOpen = false;

    // Sembunyikan elemen <select> asli tapi biarkan di DOM untuk kompatibilitas form
    this.selectElement.style.display = 'none';
    this.selectElement.setAttribute('tabindex', '-1');
    this.selectElement.setAttribute('aria-hidden', 'true');

    this.initDOM();
    this.bindEvents();
  }

  getAvatar(member) {
    if (member && member.img && member.img.trim()) {
      return member.img.trim();
    }
    return member && member.gender === 'female'
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
  }

  initDOM() {
    this.container = document.createElement('div');
    this.container.className = 'custom-select-container';

    // Trigger Button
    this.trigger = document.createElement('button');
    this.trigger.type = 'button';
    this.trigger.className = 'custom-select-trigger';
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');

    this.selectionDisplay = document.createElement('div');
    this.selectionDisplay.className = 'custom-select-selection';

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

    // Dropdown Box
    this.dropdown = document.createElement('div');
    this.dropdown.className = 'custom-select-dropdown';
    this.dropdown.setAttribute('role', 'listbox');

    // Search bar di dalam dropdown
    this.searchWrap = document.createElement('div');
    this.searchWrap.className = 'custom-select-search-wrap';
    this.searchWrap.innerHTML = `
      <svg class="custom-select-search-icon" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
      <input type="text" class="custom-select-search-input" placeholder="Cari nama anggota..." autocomplete="off" />
    `;
    this.searchInput = this.searchWrap.querySelector('.custom-select-search-input');
    this.dropdown.appendChild(this.searchWrap);

    // Options List
    this.optionsList = document.createElement('div');
    this.optionsList.className = 'custom-select-options';
    this.dropdown.appendChild(this.optionsList);

    this.container.appendChild(this.dropdown);

    // Masukkan container tepat setelah selectElement asli
    this.selectElement.parentNode.insertBefore(this.container, this.selectElement.nextSibling);

    this.updateTriggerDisplay();
  }

  bindEvents() {
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    this.searchInput.addEventListener('input', () => {
      this.filterOptions(this.searchInput.value);
    });

    this.searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Menutup dropdown jika klik di luar
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });

    // Navigasi keyboard sederhana (Escape untuk tutup)
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
    // Tutup dropdown CustomSelect lain yang sedang terbuka
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
    this.searchInput.value = '';
    this.filterOptions('');

    // Cek ruang di bagian bawah untuk menentukan arah popup
    this.adjustPlacement();

    setTimeout(() => {
      this.searchInput.focus();
    }, 50);
  }

  adjustPlacement() {
    const rect = this.trigger.getBoundingClientRect();
    const dropdownHeight = 220;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      this.container.classList.add('drop-up');
    } else {
      this.container.classList.remove('drop-up');
    }
  }

  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.container.classList.remove('open');
    this.container.classList.remove('drop-up');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  setOptions(members, emptyLabel) {
    if (emptyLabel) this.emptyLabel = emptyLabel;
    this.options = Array.isArray(members) ? members : [];
    this.renderOptions();
    this.updateTriggerDisplay();
  }

  renderOptions() {
    this.optionsList.innerHTML = '';

    // 1. Opsi Kosong (misal: -- Tanpa Ayah --)
    const emptyOption = document.createElement('div');
    emptyOption.className = `custom-select-option ${this.selectedValue === '' ? 'selected' : ''}`;
    emptyOption.setAttribute('data-value', '');
    emptyOption.innerHTML = `
      <div class="custom-select-empty-badge">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
      </div>
      <div class="custom-select-info">
        <span class="custom-select-name text-muted">${this.emptyLabel}</span>
      </div>
      <svg class="custom-select-check" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;
    emptyOption.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectValue('');
    });
    this.optionsList.appendChild(emptyOption);

    // 2. Daftar Anggota dengan Foto/Avatar
    this.options.forEach(member => {
      const isSelected = String(member.id) === String(this.selectedValue);
      const opt = document.createElement('div');
      opt.className = `custom-select-option ${isSelected ? 'selected' : ''}`;
      opt.setAttribute('data-value', member.id);
      opt.setAttribute('data-search-text', `${member.name} ${member.job || ''}`.toLowerCase());

      const avatarSrc = this.getAvatar(member);
      const fallbackSrc = member.gender === 'female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      opt.innerHTML = `
        <div class="custom-select-avatar-wrap">
          <img src="${avatarSrc}" class="custom-select-avatar" alt="${member.name}" loading="lazy" />
        </div>
        <div class="custom-select-info">
          <span class="custom-select-name">${member.name}</span>
          <span class="custom-select-sub">${member.job || (member.gender === 'female' ? 'Wanita' : 'Pria')}</span>
        </div>
        <svg class="custom-select-check" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

      // Fallback jika URL foto rusak
      const imgEl = opt.querySelector('img');
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = fallbackSrc;
      };

      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectValue(member.id);
      });

      this.optionsList.appendChild(opt);
    });
  }

  filterOptions(query) {
    const q = (query || '').toLowerCase().trim();
    const items = this.optionsList.querySelectorAll('.custom-select-option');
    let hasVisible = false;

    items.forEach(item => {
      const val = item.getAttribute('data-value');
      if (val === '') {
        // Tampilkan opsi kosong jika search kosong atau cocok
        item.style.display = (!q || this.emptyLabel.toLowerCase().includes(q)) ? 'flex' : 'none';
        if (item.style.display === 'flex') hasVisible = true;
        return;
      }

      const searchText = item.getAttribute('data-search-text') || '';
      if (!q || searchText.includes(q)) {
        item.style.display = 'flex';
        hasVisible = true;
      } else {
        item.style.display = 'none';
      }
    });

    let emptyNotice = this.optionsList.querySelector('.custom-select-no-results');
    if (!hasVisible) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.className = 'custom-select-no-results';
        emptyNotice.textContent = 'Tidak ada anggota ditemukan.';
        this.optionsList.appendChild(emptyNotice);
      }
      emptyNotice.style.display = 'block';
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  }

  selectValue(val) {
    this.selectedValue = val ? String(val) : '';
    this.selectElement.value = this.selectedValue;

    // Trigger change event pada native select
    this.selectElement.dispatchEvent(new Event('change', { bubbles: true }));

    this.updateTriggerDisplay();
    this.updateSelectedOptionClass();
    this.close();
  }

  setValue(val) {
    this.selectedValue = val ? String(val) : '';
    this.selectElement.value = this.selectedValue;
    this.updateTriggerDisplay();
    this.updateSelectedOptionClass();
  }

  getValue() {
    return this.selectedValue;
  }

  updateSelectedOptionClass() {
    const items = this.optionsList.querySelectorAll('.custom-select-option');
    items.forEach(item => {
      const itemVal = item.getAttribute('data-value') || '';
      if (itemVal === String(this.selectedValue)) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  updateTriggerDisplay() {
    const selectedMember = this.options.find(m => String(m.id) === String(this.selectedValue));

    if (selectedMember) {
      const avatarSrc = this.getAvatar(selectedMember);
      const fallbackSrc = selectedMember.gender === 'female'
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      this.selectionDisplay.innerHTML = `
        <div class="custom-select-trigger-content">
          <img src="${avatarSrc}" class="custom-select-trigger-avatar" alt="${selectedMember.name}" />
          <div class="custom-select-trigger-text">
            <span class="custom-select-trigger-name">${selectedMember.name}</span>
            <span class="custom-select-trigger-role">${selectedMember.job || (selectedMember.gender === 'female' ? 'Wanita' : 'Pria')}</span>
          </div>
        </div>
      `;

      const imgEl = this.selectionDisplay.querySelector('img');
      imgEl.onerror = () => {
        imgEl.onerror = null;
        imgEl.src = fallbackSrc;
      };
    } else {
      this.selectionDisplay.innerHTML = `
        <div class="custom-select-trigger-content">
          <div class="custom-select-trigger-empty-badge">
            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"></circle>
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
            </svg>
          </div>
          <span class="custom-select-trigger-placeholder">${this.emptyLabel}</span>
        </div>
      `;
    }
  }
}
