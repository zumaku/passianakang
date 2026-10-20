/**
 * DatePicker - Komponen pemilih tanggal visual modern untuk tanggal lahir dan wafat.
 * Mendukung navigasi cepat tahun (decade jump), bulan, hari ini, dan penghapusan tanggal.
 */

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export class DatePicker {
  constructor({ inputElement, placeholder = 'Pilih tanggal...' }) {
    this.inputElement = inputElement;
    this.placeholder = placeholder;
    this.isOpen = false;
    this.currentView = 'days'; // 'days' | 'months' | 'years'
    
    // Inisialisasi tanggal tampilan
    this.selectedDateStr = this.inputElement.value || '';
    this.viewDate = this.selectedDateStr ? new Date(this.selectedDateStr + 'T00:00:00') : new Date();
    if (isNaN(this.viewDate.getTime())) this.viewDate = new Date();

    // Sembunyikan elemen asli tapi pertahankan di DOM
    this.inputElement.style.display = 'none';
    this.inputElement.setAttribute('tabindex', '-1');
    this.inputElement.setAttribute('aria-hidden', 'true');

    this.initDOM();
    this.bindEvents();
    this.updateDisplay();
  }

  formatDateISO(year, month, day) {
    const y = String(year).padStart(4, '0');
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  formatDateDisplay(isoStr) {
    if (!isoStr) return '';
    const parts = isoStr.split('-');
    if (parts.length !== 3) return isoStr;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (isNaN(year) || isNaN(month) || isNaN(day)) return isoStr;
    return `${day} ${MONTH_SHORT[month] || ''} ${year}`;
  }

  initDOM() {
    this.container = document.createElement('div');
    this.container.className = 'custom-datepicker-container';

    // Trigger Box
    this.trigger = document.createElement('div');
    this.trigger.className = 'custom-datepicker-trigger';
    this.trigger.setAttribute('tabindex', '0');
    this.trigger.setAttribute('role', 'button');
    this.trigger.setAttribute('aria-haspopup', 'dialog');
    this.trigger.setAttribute('aria-expanded', 'false');

    this.trigger.innerHTML = `
      <svg class="custom-datepicker-icon" viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      <span class="custom-datepicker-value placeholder">${this.placeholder}</span>
      <button type="button" class="custom-datepicker-clear-btn" title="Hapus tanggal" style="display: none;">&times;</button>
    `;

    this.valEl = this.trigger.querySelector('.custom-datepicker-value');
    this.clearBtn = this.trigger.querySelector('.custom-datepicker-clear-btn');
    this.container.appendChild(this.trigger);

    // Popup Dialog
    this.popup = document.createElement('div');
    this.popup.className = 'custom-datepicker-popup';
    this.popup.setAttribute('role', 'dialog');
    this.popup.innerHTML = `
      <div class="custom-datepicker-header">
        <button type="button" class="cdp-nav-btn cdp-prev" title="Sebelumnya">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div class="cdp-title-group">
          <button type="button" class="cdp-title-btn cdp-month-btn">Januari</button>
          <button type="button" class="cdp-title-btn cdp-year-btn">2026</button>
        </div>
        <button type="button" class="cdp-nav-btn cdp-next" title="Berikutnya">
          <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="custom-datepicker-body">
        <div class="cdp-days-view">
          <div class="cdp-weekdays">
            ${DAY_NAMES.map(d => `<span>${d}</span>`).join('')}
          </div>
          <div class="cdp-days-grid"></div>
        </div>

        <div class="cdp-months-view" style="display: none;">
          <div class="cdp-months-grid">
            ${MONTH_SHORT.map((m, idx) => `<button type="button" class="cdp-month-cell" data-month="${idx}">${m}</button>`).join('')}
          </div>
        </div>

        <div class="cdp-years-view" style="display: none;">
          <div class="cdp-years-grid"></div>
        </div>
      </div>

      <div class="custom-datepicker-footer">
        <button type="button" class="cdp-btn cdp-btn-today">Hari Ini</button>
        <button type="button" class="cdp-btn cdp-btn-clear">Kosongkan</button>
        <button type="button" class="cdp-btn cdp-btn-close">Tutup</button>
      </div>
    `;

    this.btnPrev = this.popup.querySelector('.cdp-prev');
    this.btnNext = this.popup.querySelector('.cdp-next');
    this.btnMonth = this.popup.querySelector('.cdp-month-btn');
    this.btnYear = this.popup.querySelector('.cdp-year-btn');
    this.daysView = this.popup.querySelector('.cdp-days-view');
    this.monthsView = this.popup.querySelector('.cdp-months-view');
    this.yearsView = this.popup.querySelector('.cdp-years-view');
    this.daysGrid = this.popup.querySelector('.cdp-days-grid');
    this.yearsGrid = this.popup.querySelector('.cdp-years-grid');

    this.btnToday = this.popup.querySelector('.cdp-btn-today');
    this.btnClear = this.popup.querySelector('.cdp-btn-clear');
    this.btnClose = this.popup.querySelector('.cdp-btn-close');

    this.container.appendChild(this.popup);

    // Sisipkan container setelah input asli
    this.inputElement.parentNode.insertBefore(this.container, this.inputElement.nextSibling);
  }

  bindEvents() {
    this.trigger.addEventListener('click', (e) => {
      if (e.target === this.clearBtn || this.clearBtn.contains(e.target)) return;
      this.toggle();
    });

    this.clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setValue('');
    });

    this.btnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigatePrev();
    });

    this.btnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateNext();
    });

    this.btnMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      this.switchView(this.currentView === 'months' ? 'days' : 'months');
    });

    this.btnYear.addEventListener('click', (e) => {
      e.stopPropagation();
      this.switchView(this.currentView === 'years' ? 'days' : 'years');
    });

    // Pilihan Bulan
    this.monthsView.querySelectorAll('.cdp-month-cell').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const m = parseInt(btn.getAttribute('data-month'), 10);
        this.viewDate.setMonth(m);
        this.switchView('days');
      });
    });

    // Tombol Footer
    this.btnToday.addEventListener('click', (e) => {
      e.stopPropagation();
      const today = new Date();
      const iso = this.formatDateISO(today.getFullYear(), today.getMonth(), today.getDate());
      this.setValue(iso);
      this.close();
    });

    this.btnClear.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setValue('');
      this.close();
    });

    this.btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Tutup saat klik di luar
    document.addEventListener('click', (e) => {
      if (!this.container.contains(e.target)) {
        this.close();
      }
    });

    // Navigasi keyboard Escape
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });
  }

  switchView(view) {
    this.currentView = view;
    this.daysView.style.display = view === 'days' ? 'block' : 'none';
    this.monthsView.style.display = view === 'months' ? 'block' : 'none';
    this.yearsView.style.display = view === 'years' ? 'block' : 'none';
    this.render();
  }

  navigatePrev() {
    if (this.currentView === 'days') {
      this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    } else if (this.currentView === 'months') {
      this.viewDate.setFullYear(this.viewDate.getFullYear() - 1);
    } else if (this.currentView === 'years') {
      this.viewDate.setFullYear(this.viewDate.getFullYear() - 12);
    }
    this.render();
  }

  navigateNext() {
    if (this.currentView === 'days') {
      this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    } else if (this.currentView === 'months') {
      this.viewDate.setFullYear(this.viewDate.getFullYear() + 1);
    } else if (this.currentView === 'years') {
      this.viewDate.setFullYear(this.viewDate.getFullYear() + 12);
    }
    this.render();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    // Tutup datepicker lain yang sedang terbuka
    document.querySelectorAll('.custom-datepicker-container.open').forEach(el => {
      if (el !== this.container) el.classList.remove('open');
    });

    this.isOpen = true;
    this.container.classList.add('open');
    this.trigger.setAttribute('aria-expanded', 'true');

    if (this.selectedDateStr) {
      this.viewDate = new Date(this.selectedDateStr + 'T00:00:00');
      if (isNaN(this.viewDate.getTime())) this.viewDate = new Date();
    }

    this.switchView('days');
    this.adjustPlacement();
  }

  adjustPlacement() {
    const rect = this.trigger.getBoundingClientRect();
    const popupHeight = 310;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow < popupHeight && spaceAbove > spaceBelow) {
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

  setValue(isoStr) {
    this.selectedDateStr = isoStr ? String(isoStr).trim() : '';
    this.inputElement.value = this.selectedDateStr;

    if (this.selectedDateStr) {
      const parsed = new Date(this.selectedDateStr + 'T00:00:00');
      if (!isNaN(parsed.getTime())) this.viewDate = parsed;
    }

    this.inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    this.updateDisplay();
    this.render();
  }

  getValue() {
    return this.selectedDateStr;
  }

  updateDisplay() {
    if (this.selectedDateStr) {
      this.valEl.textContent = this.formatDateDisplay(this.selectedDateStr);
      this.valEl.classList.remove('placeholder');
      this.clearBtn.style.display = 'flex';
    } else {
      this.valEl.textContent = this.placeholder;
      this.valEl.classList.add('placeholder');
      this.clearBtn.style.display = 'none';
    }
  }

  render() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    this.btnMonth.textContent = MONTH_NAMES[month];

    if (this.currentView === 'years') {
      const startYear = Math.floor(year / 12) * 12;
      const endYear = startYear + 11;
      this.btnYear.textContent = `${startYear} - ${endYear}`;
      this.renderYearsGrid(startYear, endYear);
    } else {
      this.btnYear.textContent = String(year);
    }

    if (this.currentView === 'months') {
      this.renderMonthsGrid(month);
    }

    if (this.currentView === 'days') {
      this.renderDaysGrid(year, month);
    }
  }

  renderDaysGrid(year, month) {
    this.daysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();
    const todayStr = this.formatDateISO(today.getFullYear(), today.getMonth(), today.getDate());

    // 1. Hari dari bulan sebelumnya
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cdp-day-cell cdp-other-month';
      cell.textContent = String(dayNum);
      const prevDate = new Date(year, month - 1, dayNum);
      const iso = this.formatDateISO(prevDate.getFullYear(), prevDate.getMonth(), prevDate.getDate());
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setValue(iso);
        this.close();
      });
      this.daysGrid.appendChild(cell);
    }

    // 2. Hari bulan ini
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cdp-day-cell';
      cell.textContent = String(dayNum);

      const cellIso = this.formatDateISO(year, month, dayNum);
      if (cellIso === this.selectedDateStr) {
        cell.classList.add('selected');
      }
      if (cellIso === todayStr) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setValue(cellIso);
        this.close();
      });
      this.daysGrid.appendChild(cell);
    }

    // 3. Hari bulan berikutnya untuk melengkapi baris
    const totalCells = firstDayIndex + daysInCurrentMonth;
    const nextDaysCount = (7 - (totalCells % 7)) % 7;
    for (let dayNum = 1; dayNum <= nextDaysCount; dayNum++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cdp-day-cell cdp-other-month';
      cell.textContent = String(dayNum);
      const nextDate = new Date(year, month + 1, dayNum);
      const iso = this.formatDateISO(nextDate.getFullYear(), nextDate.getMonth(), nextDate.getDate());
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setValue(iso);
        this.close();
      });
      this.daysGrid.appendChild(cell);
    }
  }

  renderMonthsGrid(currentMonth) {
    const cells = this.monthsView.querySelectorAll('.cdp-month-cell');
    cells.forEach((cell, idx) => {
      if (idx === currentMonth) {
        cell.classList.add('selected');
      } else {
        cell.classList.remove('selected');
      }
    });
  }

  renderYearsGrid(startYear, endYear) {
    this.yearsGrid.innerHTML = '';
    const selectedYear = this.selectedDateStr ? parseInt(this.selectedDateStr.split('-')[0], 10) : null;

    for (let y = startYear; y <= endYear; y++) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cdp-year-cell';
      cell.textContent = String(y);

      if (y === selectedYear) {
        cell.classList.add('selected');
      }
      if (y === new Date().getFullYear()) {
        cell.classList.add('today');
      }

      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        this.viewDate.setFullYear(y);
        this.switchView('months'); // Setelah pilih tahun, buka bulan
      });

      this.yearsGrid.appendChild(cell);
    }
  }
}
