import { createIcons, icons } from 'lucide';
import { StorageService } from './storageService.js';
import { CustomSelect } from './customSelect.js';
import { DatePicker } from './datePicker.js';
import { GenderSelect } from './genderSelect.js';
import { MapPicker } from './mapPicker.js';

export class UIController {
  constructor(treeService) {
    this.treeService = treeService;
    this.currentData = [];
    this.activeMemberId = null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Sidebar detail elements
    this.detailPanel = document.getElementById('detailPanel');
    this.detailAvatar = document.getElementById('detailAvatar');
    this.detailName = document.getElementById('detailName');
    this.detailGenderBadge = document.getElementById('detailGenderBadge');
    this.detailBirthDate = document.getElementById('detailBirthDate');
    this.detailDeceasedGroup = document.getElementById('detailDeceasedGroup');
    this.detailDeathDate = document.getElementById('detailDeathDate');
    this.detailCemetery = document.getElementById('detailCemetery');
    this.detailCemeteryCoords = document.getElementById('detailCemeteryCoords');
    this.detailDeathNotes = document.getElementById('detailDeathNotes');
    this.detailJob = document.getElementById('detailJob');
    this.detailBio = document.getElementById('detailBio');
    this.detailParentsList = document.getElementById('detailParentsList');
    this.detailSpousesList = document.getElementById('detailSpousesList');
    this.detailChildrenList = document.getElementById('detailChildrenList');
    this.btnEditMember = document.getElementById('btnEditMember');
    this.btnDeleteMember = document.getElementById('btnDeleteMember');
    this.btnCloseDetail = document.getElementById('btnCloseDetail');

    // Modals & Tabs
    this.memberModal = document.getElementById('memberModal');
    this.memberModalTitle = document.getElementById('memberModalTitle');
    this.memberForm = document.getElementById('memberForm');
    this.btnCloseModal = document.getElementById('btnCloseModal');
    this.btnCancelForm = document.getElementById('btnCancelForm');
    this.modalTabBtns = document.querySelectorAll('.modal-tab-btn');
    this.modalTabPanes = document.querySelectorAll('.modal-tab-pane');

    // Form inputs
    this.inputId = document.getElementById('memberId');
    this.inputName = document.getElementById('memberName');
    this.inputGender = document.getElementById('memberGender');
    this.inputBirthDate = document.getElementById('memberBirthDate');
    this.inputDeathDate = document.getElementById('memberDeathDate');
    this.inputCemetery = document.getElementById('memberCemetery');
    this.inputCemeteryCoords = document.getElementById('memberCemeteryCoords');
    this.inputDeathNotes = document.getElementById('memberDeathNotes');
    this.btnPickMap = document.getElementById('btnPickMap');
    this.btnTestMaps = document.getElementById('btnTestMaps');

    // Radio button status keberadaan ("Telah Wafat")
    this.statusDeceased = document.getElementById('statusDeceased');
    this.labelStatusDeceased = document.getElementById('labelStatusDeceased');
    this.deceasedFieldsWrapper = document.getElementById('deceasedFieldsWrapper');

    // Map Picker instance untuk memilih koordinat makam langsung dari peta
    this.mapPicker = new MapPicker({
      onConfirm: ({ formatted }) => {
        if (this.inputCemeteryCoords) {
          this.inputCemeteryCoords.value = formatted;
          if (this.btnTestMaps) {
            this.btnTestMaps.style.display = 'inline-flex';
          }
          this.showToast(`Koordinat makam berhasil diterapkan: ${formatted}`, 'success');
        }
      }
    });

    this.inputJob = document.getElementById('memberJob');
    this.inputImg = document.getElementById('memberImg');
    this.inputFather = document.getElementById('memberFather');
    this.inputMother = document.getElementById('memberMother');
    this.inputSpouse = document.getElementById('memberSpouse');
    this.inputBio = document.getElementById('memberBio');

    // Avatar preview elements
    this.avatarPreviewWrap = document.getElementById('avatarPreviewWrap');
    this.avatarPreviewImg = document.getElementById('avatarPreviewImg');
    this.avatarPreviewFallback = document.getElementById('avatarPreviewFallback');

    // Custom Gender Select component
    this.customSelectGender = new GenderSelect({
      selectElement: this.inputGender
    });

    // Custom DatePicker components untuk navigasi tanggal lahir & wafat yang mudah
    this.datePickerBirth = new DatePicker({
      inputElement: this.inputBirthDate,
      placeholder: 'Pilih tanggal lahir...'
    });

    this.datePickerDeath = new DatePicker({
      inputElement: this.inputDeathDate,
      placeholder: 'Pilih tanggal wafat...'
    });

    // Custom Select components dengan visual avatar foto
    this.customSelectFather = new CustomSelect({
      selectElement: this.inputFather,
      placeholder: 'Tidak Diketahui',
      emptyLabel: 'Tidak Diketahui'
    });

    this.customSelectMother = new CustomSelect({
      selectElement: this.inputMother,
      placeholder: 'Tidak Diketahui',
      emptyLabel: 'Tidak Diketahui'
    });

    this.customSelectSpouse = new CustomSelect({
      selectElement: this.inputSpouse,
      placeholder: 'Belum Menikah',
      emptyLabel: 'Belum Menikah'
    });

    // Controls bar
    this.btnAddMember = document.getElementById('btnAddMember');
    this.btnResetData = document.getElementById('btnResetData');
    this.btnExportJSON = document.getElementById('btnExportJSON');
    this.btnImportJSON = document.getElementById('btnImportJSON');
    this.btnExportPNG = document.getElementById('btnExportPNG');
    this.btnExportPDF = document.getElementById('btnExportPDF');
    this.fileInputJSON = document.getElementById('fileInputJSON');
    this.searchInput = document.getElementById('searchInput');
    this.searchResults = document.getElementById('searchResults');

    // Stats counter
    this.statTotalMembers = document.getElementById('statTotalMembers');
    this.statGenerations = document.getElementById('statGenerations');

    // Hamburger menu & Theme Toggle
    this.btnThemeToggle = document.getElementById('btnThemeToggle');
    this.btnHamburger = document.getElementById('btnHamburger');
    this.btnCloseDrawer = document.getElementById('btnCloseDrawer');
    this.navActions = document.getElementById('navActions');
    this.navOverlay = document.getElementById('navOverlay');
  }

  bindEvents() {
    // Lucide icons render
    createIcons({ icons });

    // Theme toggle init and bind
    this.initTheme();
    if (this.btnThemeToggle) {
      this.btnThemeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Hamburger menu toggle
    if (this.btnHamburger) {
      this.btnHamburger.addEventListener('click', () => this.toggleMobileMenu());
    }
    if (this.btnCloseDrawer) {
      this.btnCloseDrawer.addEventListener('click', () => this.closeMobileMenu());
    }
    if (this.navOverlay) {
      this.navOverlay.addEventListener('click', () => this.closeMobileMenu());
    }
    // Auto-close mobile menu when any nav button is clicked
    if (this.navActions) {
      this.navActions.addEventListener('click', (e) => {
        if (e.target.closest('.btn')) {
          this.closeMobileMenu();
        }
      });
    }

    // Close detail panel
    if (this.btnCloseDetail) {
      this.btnCloseDetail.addEventListener('click', () => this.closeDetailPanel());
    }

    // Member Modal Segmented Tabs
    if (this.modalTabBtns) {
      this.modalTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          this.switchMemberTab(btn.dataset.tab);
        });
      });
    }

    // Modal controls
    if (this.btnAddMember) {
      this.btnAddMember.addEventListener('click', () => this.openAddMemberModal());
    }
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', () => this.closeMemberModal());
    }
    if (this.btnCancelForm) {
      this.btnCancelForm.addEventListener('click', () => this.closeMemberModal());
    }

    // Form submit
    if (this.memberForm) {
      this.memberForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Avatar URL preview live listener
    if (this.inputImg) {
      this.inputImg.addEventListener('input', (e) => this.updateAvatarPreview(e.target.value));
      this.inputImg.addEventListener('change', (e) => this.updateAvatarPreview(e.target.value));
    }

    if (this.avatarPreviewWrap) {
      this.avatarPreviewWrap.addEventListener('click', () => {
        const val = this.inputImg ? this.inputImg.value.trim() : '';
        if (val && this.avatarPreviewImg && this.avatarPreviewImg.classList.contains('loaded')) {
          window.open(val, '_blank', 'noopener,noreferrer');
        }
      });
    }

    if (this.inputGender) {
      this.inputGender.addEventListener('change', () => {
        if (this.inputImg) this.updateAvatarPreview(this.inputImg.value);
      });
    }

    // Radio toggle status keberadaan ("Telah Wafat")
    if (this.statusDeceased) {
      this.statusDeceased.addEventListener('change', () => {
        this.setDeceasedState(this.statusDeceased.checked);
      });
    }

    // Maps test button & Map Picker trigger
    if (this.btnPickMap) {
      this.btnPickMap.addEventListener('click', () => {
        const coords = this.inputCemeteryCoords ? this.inputCemeteryCoords.value : '';
        if (this.mapPicker) {
          this.mapPicker.open(coords);
        }
      });
    }

    if (this.inputCemeteryCoords && this.btnTestMaps) {
      const updateMapsBtn = () => {
        const val = this.inputCemeteryCoords.value.trim();
        this.btnTestMaps.style.display = val ? 'inline-flex' : 'none';
      };
      this.inputCemeteryCoords.addEventListener('input', updateMapsBtn);
      this.inputCemeteryCoords.addEventListener('change', updateMapsBtn);
      this.btnTestMaps.addEventListener('click', () => {
        const val = this.inputCemeteryCoords.value.trim();
        if (val) {
          const query = val.startsWith('http') ? val : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}`;
          window.open(query, '_blank', 'noopener,noreferrer');
        }
      });
    }

    // Detail actions
    if (this.btnEditMember) {
      this.btnEditMember.addEventListener('click', () => {
        if (this.activeMemberId) {
          this.openEditMemberModal(this.activeMemberId);
        }
      });
    }

    if (this.btnDeleteMember) {
      this.btnDeleteMember.addEventListener('click', () => {
        if (this.activeMemberId) {
          this.deleteMember(this.activeMemberId);
        }
      });
    }

    // Search bar & dropdown
    if (this.searchInput && this.searchResults) {
      this.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        this.handleSearchInput(query);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = this.searchInput.value.trim();
          if (query && this.currentData.length > 0) {
            const match = this.currentData.find(m => 
              m.name.toLowerCase().includes(query.toLowerCase())
            );
            if (match) {
              this.selectSearchResult(match);
            }
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-box')) {
          this.closeSearchResults();
        }
      });
    }

    // Zoom controls
    document.getElementById('btnZoomIn')?.addEventListener('click', () => this.treeService.zoomIn());
    document.getElementById('btnZoomOut')?.addEventListener('click', () => this.treeService.zoomOut());
    document.getElementById('btnFitScreen')?.addEventListener('click', () => this.treeService.fitToScreen());

    // Export / Import
    if (this.btnExportJSON) {
      this.btnExportJSON.addEventListener('click', () => {
        StorageService.exportJSON(this.currentData);
        this.showToast('File data JSON berhasil diunduh.', 'success');
      });
    }

    if (this.btnExportPNG) {
      this.btnExportPNG.addEventListener('click', () => {
        this.treeService.exportPNG();
        this.showToast('Mengekspor gambar PNG...', 'info');
      });
    }

    if (this.btnExportPDF) {
      this.btnExportPDF.addEventListener('click', () => {
        this.treeService.exportPDF();
        this.showToast('Mengekspor dokumen PDF...', 'info');
      });
    }

    if (this.btnImportJSON && this.fileInputJSON) {
      this.btnImportJSON.addEventListener('click', () => this.fileInputJSON.click());
      this.fileInputJSON.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
          const imported = await StorageService.importJSON(file);
          this.updateDataAndRender(imported);
          this.showToast(`Berhasil mengimpor ${imported.length} data anggota.`, 'success');
        } catch (err) {
          this.showToast(`Gagal mengimpor JSON: ${err.message}`, 'error');
        }
        this.fileInputJSON.value = '';
      });
    }

    if (this.btnResetData) {
      this.btnResetData.addEventListener('click', async () => {
        if (confirm('Apakah Anda yakin ingin mengembalikan data ke template default silsilah?')) {
          const resetData = await StorageService.resetToDefault();
          await this.updateDataAndRender(resetData);
          this.showToast('Data silsilah telah dikembalikan ke template bawaan.', 'info');
        }
      });
    }
  }

  setData(data) {
    this.currentData = (data || []).map(m => {
      const copy = { ...m };
      delete copy.title;
      return copy;
    });
    this.updateStats();
  }

  updateStats() {
    if (this.statTotalMembers) {
      this.statTotalMembers.textContent = this.currentData.length;
    }
  }

  async updateDataAndRender(newData) {
    const cleanData = (newData || []).map(m => {
      const copy = { ...m };
      delete copy.title;
      return copy;
    });
    this.currentData = cleanData;
    await StorageService.saveData(cleanData);
    this.treeService.render(cleanData);
    this.updateStats();
    this.closeDetailPanel();
  }

  showMemberDetail(member) {
    if (!member) return;
    this.activeMemberId = member.id;

    // Fill detail fields
    this.detailAvatar.src = member.img || (member.gender === 'female' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' 
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80');

    this.detailName.textContent = member.name || 'Tanpa Nama';
    
    // Gender badge dengan ikon proporsional
    if (member.gender === 'female') {
      this.detailGenderBadge.className = 'badge badge-pink';
      this.detailGenderBadge.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="5"></circle>
          <line x1="12" y1="13" x2="12" y2="21"></line>
          <line x1="8" y1="17" x2="16" y2="17"></line>
        </svg>
        <span>Wanita</span>
      `;
    } else {
      this.detailGenderBadge.className = 'badge badge-blue';
      this.detailGenderBadge.innerHTML = `
        <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="10" cy="14" r="5"></circle>
          <line x1="19" y1="5" x2="13.6" y2="10.4"></line>
          <polyline points="15 5 19 5 19 9"></polyline>
        </svg>
        <span>Pria</span>
      `;
    }

    this.detailBirthDate.textContent = member.birthDate ? `Tanggal Lahir: ${member.birthDate}` : 'Tanggal Lahir: -';
    
    // Deceased & Cemetery Info
    const isDeceased = Boolean(member.isDeceased || member.deathDate);
    if (this.detailDeceasedGroup) {
      if (isDeceased) {
        this.detailDeceasedGroup.style.display = 'block';
        if (this.detailDeathDate) {
          this.detailDeathDate.textContent = member.deathDate ? `Tanggal Wafat: ${member.deathDate}` : 'Telah Wafat';
        }
        if (this.detailCemetery) {
          this.detailCemetery.textContent = member.cemetery ? `Lokasi Makam: ${member.cemetery}` : '';
        }
        if (this.detailCemeteryCoords) {
          const coords = (member.cemeteryCoords || '').trim();
          if (coords) {
            const mapUrl = coords.startsWith('http') ? coords : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`;
            this.detailCemeteryCoords.innerHTML = `
              <a href="${mapUrl}" target="_blank" rel="noopener noreferrer" class="maps-link" title="Buka navigasi Google Maps">
                <i data-lucide="map-pin"></i> <span>Buka Lokasi di Google Maps ↗</span>
              </a>
            `;
          } else {
            this.detailCemeteryCoords.innerHTML = '';
          }
        }
        if (this.detailDeathNotes) {
          if (member.deathNotes) {
            this.detailDeathNotes.textContent = `Catatan: ${member.deathNotes}`;
            this.detailDeathNotes.style.display = 'block';
          } else {
            this.detailDeathNotes.style.display = 'none';
          }
        }
      } else {
        this.detailDeceasedGroup.style.display = 'none';
      }
    }

    this.detailJob.textContent = member.job ? `Pekerjaan: ${member.job}` : 'Pekerjaan: -';
    this.detailBio.textContent = member.bio || 'Belum ada catatan biografi.';

    // Populate relations lists
    this.renderRelationsList(member);

    // Refresh lucide icons in detail panel
    createIcons({ icons });

    // Open panel slider
    this.detailPanel.classList.add('open');
  }

  renderRelationsList(member) {
    // Clear old lists
    this.detailParentsList.innerHTML = '';
    this.detailSpousesList.innerHTML = '';
    this.detailChildrenList.innerHTML = '';

    // Parents
    const father = this.currentData.find(m => m.id === member.fid);
    const mother = this.currentData.find(m => m.id === member.mid);
    
    if (father) this.appendRelationItem(this.detailParentsList, father, 'Ayah');
    if (mother) this.appendRelationItem(this.detailParentsList, mother, 'Ibu');
    if (!father && !mother) {
      this.detailParentsList.innerHTML = '<li class="text-subtle">Tidak terdaftar</li>';
    }

    // Spouses
    const pids = member.pids || [];
    const spouses = this.currentData.filter(m => pids.includes(m.id));
    if (spouses.length > 0) {
      spouses.forEach(s => this.appendRelationItem(this.detailSpousesList, s, 'Pasangan'));
    } else {
      this.detailSpousesList.innerHTML = '<li class="text-subtle">Tidak terdaftar</li>';
    }

    // Children (members where fid == member.id OR mid == member.id)
    const children = this.currentData.filter(m => m.fid === member.id || m.mid === member.id);
    if (children.length > 0) {
      children.forEach(c => this.appendRelationItem(this.detailChildrenList, c, 'Anak'));
    } else {
      this.detailChildrenList.innerHTML = '<li class="text-subtle">Belum ada anak</li>';
    }
  }

  appendRelationItem(container, member, roleLabel) {
    const li = document.createElement('li');
    li.className = 'relation-item';
    li.innerHTML = `
      <img src="${member.img}" class="relation-avatar" alt="${member.name}" />
      <div class="relation-info">
        <span class="relation-name">${member.name}</span>
        <span class="relation-role">${roleLabel}</span>
      </div>
    `;
    li.addEventListener('click', () => {
      this.showMemberDetail(member);
      this.treeService.search(member.name);
    });
    container.appendChild(li);
  }

  closeDetailPanel() {
    this.detailPanel.classList.remove('open');
    this.activeMemberId = null;
  }

  toggleMobileMenu() {
    const isOpen = this.navActions.classList.toggle('open');
    this.btnHamburger.classList.toggle('active', isOpen);
    this.navOverlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    this.navActions.classList.remove('open');
    this.btnHamburger.classList.remove('active');
    this.navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  populateParentOptions(excludeId = null) {
    // Clear father, mother, spouse options
    this.inputFather.innerHTML = '<option value="">Tidak Diketahui</option>';
    this.inputMother.innerHTML = '<option value="">Tidak Diketahui</option>';
    this.inputSpouse.innerHTML = '<option value="">Belum Menikah</option>';

    const maleMembers = [];
    const femaleMembers = [];
    const spouseMembers = [];

    this.currentData.forEach(m => {
      if (m.id === excludeId) return;

      const optionF = document.createElement('option');
      optionF.value = m.id;
      optionF.textContent = m.name;
      if (m.gender === 'male') {
        this.inputFather.appendChild(optionF);
        maleMembers.push(m);
      }

      const optionM = document.createElement('option');
      optionM.value = m.id;
      optionM.textContent = m.name;
      if (m.gender === 'female') {
        this.inputMother.appendChild(optionM);
        femaleMembers.push(m);
      }

      const optionS = document.createElement('option');
      optionS.value = m.id;
      optionS.textContent = `${m.name} (${m.gender === 'male' ? 'Pria' : 'Wanita'})`;
      this.inputSpouse.appendChild(optionS);
      spouseMembers.push(m);
    });

    // Perbarui opsi CustomSelect komponen dengan data foto avatar
    if (this.customSelectFather) this.customSelectFather.setOptions(maleMembers, 'Tidak Diketahui');
    if (this.customSelectMother) this.customSelectMother.setOptions(femaleMembers, 'Tidak Diketahui');
    if (this.customSelectSpouse) this.customSelectSpouse.setOptions(spouseMembers, 'Belum Menikah');
  }

  switchMemberTab(tabId) {
    if (!this.modalTabBtns || !this.modalTabPanes) return;
    this.modalTabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabId;
      btn.classList.toggle('active', isActive);
    });
    this.modalTabPanes.forEach(pane => {
      const isActive = pane.id === tabId;
      pane.classList.toggle('active', isActive);
    });
    createIcons({ icons });
  }

  openAddMemberModal() {
    this.memberModalTitle.textContent = 'Tambah Anggota Keluarga Baru';
    this.memberForm.reset();
    this.switchMemberTab('tabProfile');
    this.inputId.value = '';
    this.populateParentOptions();
    if (this.customSelectGender) this.customSelectGender.setValue('male');
    if (this.customSelectFather) this.customSelectFather.setValue('');
    if (this.customSelectMother) this.customSelectMother.setValue('');
    if (this.customSelectSpouse) this.customSelectSpouse.setValue('');
    if (this.datePickerBirth) this.datePickerBirth.setValue('');
    if (this.datePickerDeath) this.datePickerDeath.setValue('');
    this.setDeceasedState(false);
    if (this.inputCemetery) this.inputCemetery.value = '';
    if (this.inputCemeteryCoords) this.inputCemeteryCoords.value = '';
    if (this.inputDeathNotes) this.inputDeathNotes.value = '';
    if (this.btnTestMaps) this.btnTestMaps.style.display = 'none';
    this.updateAvatarPreview('');
    createIcons({ icons });
    this.memberModal.classList.add('open');
  }

  openAddRelativeModal(relatedMemberId) {
    this.openAddMemberModal();
    const related = this.currentData.find(m => m.id === String(relatedMemberId));
    if (related) {
      if (related.gender === 'male') {
        this.inputFather.value = related.id;
        if (this.customSelectFather) this.customSelectFather.setValue(related.id);
      } else {
        this.inputMother.value = related.id;
        if (this.customSelectMother) this.customSelectMother.setValue(related.id);
      }
    }
  }

  openEditMemberModal(id) {
    const member = this.currentData.find(m => m.id === String(id));
    if (!member) return;

    this.memberModalTitle.textContent = `Edit Data ${member.name}`;
    this.populateParentOptions(member.id);
    this.switchMemberTab('tabProfile');

    this.inputId.value = member.id;
    this.inputName.value = member.name || '';
    this.inputGender.value = member.gender || 'male';
    if (this.customSelectGender) this.customSelectGender.setValue(member.gender || 'male');
    this.inputBirthDate.value = member.birthDate || '';
    this.inputDeathDate.value = member.deathDate || '';
    this.inputJob.value = member.job || '';
    this.inputImg.value = member.img || '';
    this.inputBio.value = member.bio || '';

    this.inputFather.value = member.fid || '';
    this.inputMother.value = member.mid || '';
    this.inputSpouse.value = (member.pids && member.pids.length > 0) ? member.pids[0] : '';

    if (this.customSelectFather) this.customSelectFather.setValue(member.fid || '');
    if (this.customSelectMother) this.customSelectMother.setValue(member.mid || '');
    if (this.customSelectSpouse) this.customSelectSpouse.setValue((member.pids && member.pids.length > 0) ? member.pids[0] : '');

    if (this.datePickerBirth) this.datePickerBirth.setValue(member.birthDate || '');
    if (this.datePickerDeath) this.datePickerDeath.setValue(member.deathDate || '');

    const isDeceased = Boolean(member.isDeceased || member.deathDate);
    this.setDeceasedState(isDeceased);
    if (this.inputCemetery) this.inputCemetery.value = member.cemetery || '';
    if (this.inputCemeteryCoords) {
      this.inputCemeteryCoords.value = member.cemeteryCoords || '';
      if (this.btnTestMaps) {
        this.btnTestMaps.style.display = member.cemeteryCoords ? 'inline-flex' : 'none';
      }
    }
    if (this.inputDeathNotes) {
      this.inputDeathNotes.value = member.deathNotes || '';
    }

    this.updateAvatarPreview(member.img || '');
    createIcons({ icons });
    this.memberModal.classList.add('open');
  }

  setDeceasedState(isDeceased) {
    if (this.statusDeceased) {
      this.statusDeceased.checked = Boolean(isDeceased);
    }
    if (this.labelStatusDeceased) {
      if (isDeceased) {
        this.labelStatusDeceased.classList.add('active');
      } else {
        this.labelStatusDeceased.classList.remove('active');
      }
    }
    if (this.deceasedFieldsWrapper) {
      this.deceasedFieldsWrapper.style.display = isDeceased ? 'block' : 'none';
    }
  }

  updateAvatarPreview(url) {
    if (!this.avatarPreviewImg || !this.avatarPreviewFallback) return;
    const trimmed = (url || '').trim();

    if (!trimmed) {
      this.avatarPreviewImg.src = '';
      this.avatarPreviewImg.classList.remove('loaded');
      this.avatarPreviewFallback.style.display = 'flex';
      if (this.avatarPreviewWrap) {
        this.avatarPreviewWrap.style.borderColor = 'var(--border-color)';
        this.avatarPreviewWrap.title = 'Pratinjau Foto';
      }
      return;
    }

    const testImg = new Image();
    testImg.onload = () => {
      if (this.inputImg && this.inputImg.value.trim() === trimmed) {
        this.avatarPreviewImg.src = trimmed;
        this.avatarPreviewImg.classList.add('loaded');
        this.avatarPreviewFallback.style.display = 'none';
        if (this.avatarPreviewWrap) {
          const isFemale = this.inputGender && this.inputGender.value === 'female';
          this.avatarPreviewWrap.style.borderColor = isFemale ? 'var(--secondary)' : 'var(--primary)';
          this.avatarPreviewWrap.title = 'Klik untuk membuka foto di tab baru';
        }
      }
    };
    testImg.onerror = () => {
      if (this.inputImg && this.inputImg.value.trim() === trimmed) {
        this.avatarPreviewImg.src = '';
        this.avatarPreviewImg.classList.remove('loaded');
        this.avatarPreviewFallback.style.display = 'flex';
        if (this.avatarPreviewWrap) {
          this.avatarPreviewWrap.style.borderColor = '#ef4444';
          this.avatarPreviewWrap.title = 'URL foto tidak valid atau gagal dimuat';
        }
      }
    };
    testImg.src = trimmed;
  }

  closeMemberModal() {
    this.memberModal.classList.remove('open');
    if (this.customSelectGender) this.customSelectGender.close();
    if (this.customSelectFather) this.customSelectFather.close();
    if (this.customSelectMother) this.customSelectMother.close();
    if (this.customSelectSpouse) this.customSelectSpouse.close();
    if (this.datePickerBirth) this.datePickerBirth.close();
    if (this.datePickerDeath) this.datePickerDeath.close();
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const id = this.inputId.value ? this.inputId.value : String(Date.now());
    const name = this.inputName.value.trim();
    if (!name) {
      this.switchMemberTab('tabProfile');
      if (this.inputName) this.inputName.focus();
      this.showToast('Nama anggota tidak boleh kosong!', 'error');
      return;
    }

    const gender = this.inputGender.value;
    const birthDate = this.inputBirthDate.value;

    const isDeceased = this.statusDeceased ? this.statusDeceased.checked : false;
    const deathDate = isDeceased ? this.inputDeathDate.value : '';
    const cemetery = isDeceased && this.inputCemetery ? this.inputCemetery.value.trim() : '';
    const cemeteryCoords = isDeceased && this.inputCemeteryCoords ? this.inputCemeteryCoords.value.trim() : '';
    const deathNotes = isDeceased && this.inputDeathNotes ? this.inputDeathNotes.value.trim() : '';

    const job = this.inputJob.value.trim();
    const img = this.inputImg.value.trim();
    const bio = this.inputBio.value.trim();
    const fid = this.inputFather.value || undefined;
    const mid = this.inputMother.value || undefined;
    const spouseId = this.inputSpouse.value;

    const pids = spouseId ? [spouseId] : [];

    const memberObject = {
      id,
      name,
      gender,
      birthDate,
      isDeceased,
      deathDate,
      cemetery,
      cemeteryCoords,
      deathNotes,
      job,
      img,
      bio,
      fid,
      mid,
      pids
    };

    let updatedData = [...this.currentData];
    const existingIndex = updatedData.findIndex(m => m.id === id);

    if (existingIndex >= 0) {
      // Edit existing
      updatedData[existingIndex] = memberObject;
    } else {
      // Add new
      updatedData.push(memberObject);
    }

    // Bidirectional spouse linking check
    if (spouseId) {
      const spouseIndex = updatedData.findIndex(m => m.id === spouseId);
      if (spouseIndex >= 0) {
        const spouseObj = { ...updatedData[spouseIndex] };
        if (!spouseObj.pids) spouseObj.pids = [];
        if (!spouseObj.pids.includes(id)) {
          spouseObj.pids.push(id);
          updatedData[spouseIndex] = spouseObj;
        }
      }
    }

    this.updateDataAndRender(updatedData);
    this.closeMemberModal();
    this.showToast(`Anggota "${name}" berhasil disimpan.`, 'success');
  }

  deleteMember(id) {
    const member = this.currentData.find(m => m.id === String(id));
    if (!member) return;

    if (confirm(`Apakah Anda yakin ingin menghapus "${member.name}" dari silsilah keluarga?`)) {
      let updatedData = this.currentData.filter(m => m.id !== String(id));

      // Remove references in other members
      updatedData = updatedData.map(m => {
        const copy = { ...m };
        if (copy.fid === String(id)) delete copy.fid;
        if (copy.mid === String(id)) delete copy.mid;
        if (copy.pids) {
          copy.pids = copy.pids.filter(p => p !== String(id));
        }
        return copy;
      });

      this.updateDataAndRender(updatedData);
      this.showToast(`Anggota "${member.name}" telah dihapus.`, 'info');
    }
  }

  showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconName = 'info';
    if (type === 'success') iconName = 'check-circle';
    if (type === 'error') iconName = 'alert-circle';

    toast.innerHTML = `
      <div class="toast-content">
        <i data-lucide="${iconName}" class="toast-type-icon"></i>
        <span class="toast-message">${message}</span>
      </div>
      <button class="toast-close" aria-label="Tutup notifikasi" title="Tutup">
        <i data-lucide="x"></i>
      </button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    toastContainer.appendChild(toast);
    
    // Render Lucide SVG icons inside the new toast
    createIcons({ icons });

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 4500);
  }

  handleSearchInput(query) {
    if (!query) {
      this.closeSearchResults();
      return;
    }

    const q = query.toLowerCase();
    const matches = this.currentData.filter(m => 
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.job && m.job.toLowerCase().includes(q))
    );

    this.renderSearchResults(matches);
  }

  renderSearchResults(matches) {
    if (!this.searchResults) return;
    this.searchResults.innerHTML = '';

    if (matches.length === 0) {
      this.searchResults.innerHTML = '<div class="search-no-results">Tidak ada anggota yang cocok</div>';
      this.searchResults.classList.add('active');
      return;
    }

    matches.slice(0, 8).forEach(member => {
      const defaultAvatar = member.gender === 'female' 
        ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

      const item = document.createElement('div');
      item.className = 'search-item';
      item.innerHTML = `
        <img src="${member.img || defaultAvatar}" class="search-item-avatar" alt="${member.name}" />
        <div class="search-item-info">
          <span class="search-item-name">${member.name}</span>
          <span class="search-item-title">${member.job || (member.gender === 'female' ? 'Wanita' : 'Pria')}</span>
        </div>
      `;

      item.addEventListener('click', () => this.selectSearchResult(member));
      this.searchResults.appendChild(item);
    });

    this.searchResults.classList.add('active');
  }

  selectSearchResult(member) {
    if (!member) return;
    this.closeSearchResults();
    if (this.searchInput) this.searchInput.value = member.name;
    
    // Center tree & highlight node
    this.treeService.centerNode(member.id);
    
    // On mobile view (screen width <= 900px), do not open detail panel automatically
    // so the highlighted node card & pulsing ring remain 100% visible on canvas
    const isMobile = window.innerWidth <= 900;
    if (!isMobile) {
      this.showMemberDetail(member);
    }

    // Close mobile menu if open
    this.closeMobileMenu();
  }

  closeSearchResults() {
    if (this.searchResults) {
      this.searchResults.classList.remove('active');
    }
  }

  initTheme() {
    const savedTheme = localStorage.getItem('passianakang_theme') || 'dark';
    this.applyTheme(savedTheme);
  }

  toggleTheme() {
    const currentIsLight = document.body.classList.contains('theme-light');
    const newTheme = currentIsLight ? 'dark' : 'light';
    this.applyTheme(newTheme);
    localStorage.setItem('passianakang_theme', newTheme);
  }

  applyTheme(theme) {
    const isLight = theme === 'light';
    if (isLight) {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }

    // Toggle theme icons
    const sunIcon = document.getElementById('themeIconSun');
    const moonIcon = document.getElementById('themeIconMoon');
    
    if (sunIcon) sunIcon.style.display = isLight ? 'none' : 'block';
    if (moonIcon) moonIcon.style.display = isLight ? 'block' : 'none';
  }
}
