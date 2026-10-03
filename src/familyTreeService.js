import FamilyTree from '@balkangraph/familytree.js';

export class FamilyTreeService {
  constructor(containerElement, options = {}) {
    this.container = containerElement;
    this.familyTree = null;
    this.onNodeSelectedCallback = options.onNodeSelected || null;
    this.onDataChangedCallback = options.onDataChanged || null;
    this.initCustomTemplates();
  }

  initCustomTemplates() {
    // Custom modern template based on 'tommy'
    FamilyTree.templates.modernGlass = Object.assign({}, FamilyTree.templates.tommy);
    FamilyTree.templates.modernGlass.size = [250, 110];

    // Three dots menu button (positioned top right)
    const customNodeMenuButton =
      '<g style="cursor:pointer;" transform="matrix(1,0,0,1,210,10)" data-ctrl-n-menu-id="{id}">' +
        '<rect x="0" y="0" width="28" height="28" rx="8" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" class="ft-menu-btn" data-ctrl-n-menu-id="{id}"></rect>' +
        '<circle cx="14" cy="7" r="2.2" fill="#cbd5e1" data-ctrl-n-menu-id="{id}" style="pointer-events:none;"></circle>' +
        '<circle cx="14" cy="14" r="2.2" fill="#cbd5e1" data-ctrl-n-menu-id="{id}" style="pointer-events:none;"></circle>' +
        '<circle cx="14" cy="21" r="2.2" fill="#cbd5e1" data-ctrl-n-menu-id="{id}" style="pointer-events:none;"></circle>' +
      '</g>';

    // Up / expand tree connection button (Treemap / Hierarchy Icon)
    const customUpButton =
      '<g style="cursor:pointer;" transform="matrix(1,0,0,1,111,-14)" data-btn-id="{id}">' +
        '<circle cx="14" cy="14" r="14" fill="#0f172a" stroke="#45A692" stroke-width="2" class="ft-up-btn"></circle>' +
        '<g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M14 10v4M9 14h10M9 14v4M19 14v4"/>' +
          '<circle cx="14" cy="8" r="2" fill="#45A692" stroke="#45A692"/>' +
          '<circle cx="9" cy="20" r="1.8" fill="#ffffff" stroke="#ffffff"/>' +
          '<circle cx="19" cy="20" r="1.8" fill="#ffffff" stroke="#ffffff"/>' +
        '</g>' +
      '</g>';

    FamilyTree.templates.modernGlass.up = customUpButton;
    FamilyTree.templates.modernGlass.nodeMenuButton = customNodeMenuButton;
    FamilyTree.templates.modernGlass.menuButton = customNodeMenuButton;

    // Image avatar configuration
    FamilyTree.templates.modernGlass.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="44" cy="55" r="26"></circle>' +
      '</clipPath>' +
      '<circle cx="44" cy="55" r="29" fill="none" stroke="#45A692" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="18" y="29" width="52" height="52"></image>';

    // Name text (clipped within card)
    FamilyTree.templates.modernGlass.field_0 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 13px; font-weight: 700; font-family: Inter, sans-serif;" fill="var(--node-text-name, #ffffff)" class="ft-node-name" x="80" y="34">{val}</text>';

    // Title / Relationship text (clipped)
    FamilyTree.templates.modernGlass.field_1 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 11px; font-weight: 500; font-family: Inter, sans-serif;" fill="var(--node-text-title, #94a3b8)" class="ft-node-title" x="80" y="72">{val}</text>';

    // Birth Date text (clipped)
    FamilyTree.templates.modernGlass.field_2 =
      '<text clip-path="url(#textClip_{id})" style="font-size: 10px; font-weight: 400; font-family: Inter, sans-serif;" fill="var(--node-text-sub, #64748b)" class="ft-node-birth" x="80" y="88">{val}</text>';

    // Custom male node accent & compact gender indicator badge below name
    FamilyTree.templates.modernGlass_male = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_male.up = customUpButton;
    FamilyTree.templates.modernGlass_male.nodeMenuButton = customNodeMenuButton;
    FamilyTree.templates.modernGlass_male.menuButton = customNodeMenuButton;
    FamilyTree.templates.modernGlass_male.node =
      '<rect x="0" y="0" height="110" width="250" fill="var(--bg-node, #0f172a)" rx="14" ry="14" stroke="#3A8D7B" stroke-width="1.5" class="ft-node-card"></rect>' +
      '<g transform="translate(80, 42)">' +
        '<rect x="0" y="0" width="40" height="15" rx="7.5" fill="rgba(69, 166, 146, 0.2)" stroke="rgba(69, 166, 146, 0.4)" stroke-width="1"/>' +
        '<text x="20" y="11" text-anchor="middle" font-size="9" font-weight="600" font-family="Inter, sans-serif" fill="#7AD4C0">♂ Pria</text>' +
      '</g>' +
      '<clipPath id="textClip_{id}"><rect x="80" y="18" width="124" height="85" /></clipPath>';

    // Custom female node accent & compact gender indicator badge below name
    FamilyTree.templates.modernGlass_female = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_female.up = customUpButton;
    FamilyTree.templates.modernGlass_female.nodeMenuButton = customNodeMenuButton;
    FamilyTree.templates.modernGlass_female.menuButton = customNodeMenuButton;
    FamilyTree.templates.modernGlass_female.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="44" cy="55" r="26"></circle>' +
      '</clipPath>' +
      '<circle cx="44" cy="55" r="29" fill="none" stroke="#ec4899" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="18" y="29" width="52" height="52"></image>';

    FamilyTree.templates.modernGlass_female.node =
      '<rect x="0" y="0" height="110" width="250" fill="var(--bg-node, #0f172a)" rx="14" ry="14" stroke="#db2777" stroke-width="1.5" class="ft-node-card"></rect>' +
      '<g transform="translate(80, 42)">' +
        '<rect x="0" y="0" width="48" height="15" rx="7.5" fill="rgba(236, 72, 153, 0.2)" stroke="rgba(236, 72, 153, 0.4)" stroke-width="1"/>' +
        '<text x="24" y="11" text-anchor="middle" font-size="9" font-weight="600" font-family="Inter, sans-serif" fill="#fbcfe8">♀ Wanita</text>' +
      '</g>' +
      '<clipPath id="textClip_{id}"><rect x="80" y="18" width="124" height="85" /></clipPath>';
  }

  render(nodesData) {
    if (this.familyTree) {
      this.familyTree.destroy();
      this.container.innerHTML = '';
    }

    // Default fallback image if missing
    const defaultAvatarMale = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    const defaultAvatarFemale = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

    const processedNodes = nodesData.map(node => {
      const copy = { ...node };
      if (!copy.img) {
        copy.img = copy.gender === 'female' ? defaultAvatarFemale : defaultAvatarMale;
      }
      if (!copy.tags || !Array.isArray(copy.tags)) {
        copy.tags = [copy.gender || 'male'];
      }
      return copy;
    });

    const nodeMenuConfig = {
      details: {
        text: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle; display:inline-block;"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>Lihat Detail',
        icon: '',
        onClick: (id) => this.triggerSelectNode(id)
      },
      edit: {
        text: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle; display:inline-block;"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>Edit Anggota',
        icon: '',
        onClick: (id) => this.triggerEditNode(id)
      },
      add: {
        text: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px; vertical-align:middle; display:inline-block;"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></svg>Tambah Kerabat',
        icon: '',
        onClick: (id) => this.triggerAddRelative(id)
      }
    };

    this.familyTree = new FamilyTree(this.container, {
      nodes: processedNodes,
      template: 'modernGlass',
      mouseScrool: FamilyTree.action.zoom,
      enableSearch: false,
      scaleInitial: FamilyTree.match.boundary,
      nodeBinding: {
        field_0: 'name',
        field_1: 'title',
        field_2: 'birthDate',
        img_0: 'img'
      },
      tags: {
        male: {
          template: 'modernGlass_male',
          nodeMenu: nodeMenuConfig
        },
        female: {
          template: 'modernGlass_female',
          nodeMenu: nodeMenuConfig
        }
      },
      nodeMenu: nodeMenuConfig,
      editForm: null // Disable built-in Balkan edit form to prevent overlapping sidebars
    });

    // Handle node click event - return false to cancel Balkan built-in sidebar popup
    this.familyTree.onNodeClick((args) => {
      if (this.onNodeSelectedCallback) {
        const node = this.getNodeById(args.node.id);
        this.onNodeSelectedCallback(node);
      }
      return false;
    });

    // Auto-fit tree scale after render
    setTimeout(() => {
      if (this.familyTree) {
        this.familyTree.fit();
      }
    }, 100);

    // Return current count
    return processedNodes.length;
  }

  getNodeById(id) {
    if (!this.familyTree) return null;
    return this.familyTree.get(id);
  }

  getAllNodes() {
    if (!this.familyTree) return [];
    // Extract array of node objects from familyTree instance
    const nodesMap = this.familyTree.nodes;
    const result = [];
    for (let id in nodesMap) {
      if (nodesMap.hasOwnProperty(id)) {
        const n = nodesMap[id];
        result.push({
          id: String(n.id),
          pids: n.pids ? n.pids.map(String) : [],
          mid: n.mid ? String(n.mid) : undefined,
          fid: n.fid ? String(n.fid) : undefined,
          name: n.name || '',
          gender: n.gender || 'male',
          title: n.title || '',
          birthDate: n.birthDate || '',
          deathDate: n.deathDate || '',
          job: n.job || '',
          bio: n.bio || '',
          img: n.img || ''
        });
      }
    }
    return result;
  }

  triggerSelectNode(id) {
    const node = this.getNodeById(id);
    if (node && this.onNodeSelectedCallback) {
      this.onNodeSelectedCallback(node);
    }
  }

  triggerEditNode(id) {
    if (window.appUI) {
      window.appUI.openEditMemberModal(id);
    }
  }

  triggerAddRelative(parentId) {
    if (window.appUI) {
      window.appUI.openAddRelativeModal(parentId);
    }
  }

  search(query) {
    if (this.familyTree && query) {
      try {
        const results = this.familyTree.search(query);
        if (results && results.length > 0) {
          this.centerNode(results[0]);
        }
        return results;
      } catch (err) {
        console.warn('Search error:', err);
      }
    }
    return [];
  }

  centerNode(id) {
    if (this.familyTree && id) {
      try {
        this.familyTree.center(id);

        // Clear existing highlights and mobile badges
        document.querySelectorAll('.ft-search-tag, .ft-search-pulse-ring').forEach(el => el.remove());
        document.querySelectorAll('.ft-node-highlight, .ft-node-active').forEach(el => {
          el.classList.remove('ft-node-highlight', 'ft-node-active');
        });

        let nodeEl = this.familyTree.getNodeElement(id);
        if (!nodeEl) {
          nodeEl = document.querySelector(`[data-n-id="${id}"]`);
        }

        if (nodeEl) {
          nodeEl.classList.add('ft-node-highlight', 'ft-node-active');

          // Append native SVG pulse ring and floating badge for mobile browser compatibility
          const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          pulseRing.setAttribute('class', 'ft-search-pulse-ring');
          pulseRing.setAttribute('x', '-6');
          pulseRing.setAttribute('y', '-6');
          pulseRing.setAttribute('width', '262');
          pulseRing.setAttribute('height', '122');
          pulseRing.setAttribute('rx', '18');

          const tagGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          tagGroup.setAttribute('class', 'ft-search-tag');
          tagGroup.setAttribute('transform', 'translate(65, -26)');
          tagGroup.innerHTML = `
            <rect x="0" y="0" width="120" height="22" rx="11" fill="#45A692" stroke="#ffffff" stroke-width="1.5"/>
            <text x="60" y="15" text-anchor="middle" font-size="11" font-weight="700" font-family="Inter, sans-serif" fill="#ffffff">🎯 HASIL CARI</text>
          `;

          nodeEl.appendChild(pulseRing);
          nodeEl.appendChild(tagGroup);

          setTimeout(() => {
            if (nodeEl) nodeEl.classList.remove('ft-node-highlight');
          }, 5000);
        }
      } catch (err) {
        console.warn('Could not center node:', err);
      }
    }
  }

  zoomIn() {
    if (this.familyTree) {
      this.familyTree.zoom(true);
    }
  }

  zoomOut() {
    if (this.familyTree) {
      this.familyTree.zoom(false);
    }
  }

  fitToScreen() {
    if (this.familyTree) {
      this.familyTree.fit();
    }
  }

  exportPDF() {
    if (this.familyTree) {
      this.familyTree.exportPDF({
        filename: 'silsilah_keluarga.pdf',
        format: 'A4',
        header: 'Silsilah Keluarga - Passianakang',
        footer: 'Dibuat dengan Passianakang FamilyTree.js'
      });
    }
  }

  exportPNG() {
    if (this.familyTree) {
      this.familyTree.exportPNG({
        filename: 'silsilah_keluarga.png'
      });
    }
  }

  exportSVG() {
    if (this.familyTree) {
      this.familyTree.exportSVG({
        filename: 'silsilah_keluarga.svg'
      });
    }
  }
}
