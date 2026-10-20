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
    FamilyTree.templates.modernGlass.size = [210, 72];

    // Up / expand tree connection button (Treemap / Hierarchy Icon)
    const customUpButton =
      '<g style="cursor:pointer;" transform="matrix(1,0,0,1,91,-14)" data-btn-id="{id}">' +
        '<circle cx="14" cy="14" r="14" fill="#0f172a" stroke="#45A692" stroke-width="2" class="ft-up-btn"></circle>' +
        '<g fill="none" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M14 10v4M9 14h10M9 14v4M19 14v4"/>' +
          '<circle cx="14" cy="8" r="2" fill="#45A692" stroke="#45A692"/>' +
          '<circle cx="9" cy="20" r="1.8" fill="#ffffff" stroke="#ffffff"/>' +
          '<circle cx="19" cy="20" r="1.8" fill="#ffffff" stroke="#ffffff"/>' +
        '</g>' +
      '</g>';

    FamilyTree.templates.modernGlass.up = customUpButton;
    FamilyTree.templates.modernGlass.nodeMenuButton = '';
    FamilyTree.templates.modernGlass.menuButton = '';

    // Image avatar configuration (centered vertically at y=36)
    FamilyTree.templates.modernGlass.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="36" cy="36" r="22"></circle>' +
      '</clipPath>' +
      '<circle cx="36" cy="36" r="25" fill="none" stroke="#45A692" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="14" y="14" width="44" height="44"></image>';

    // Name text (with automatic ellipsis truncation on overflow)
    FamilyTree.templates.modernGlass.field_0 =
      '<text data-width="130" data-text-overflow="ellipsis" style="font-size: 13px; font-weight: 700; font-family: Inter, sans-serif;" fill="var(--node-text-name, #ffffff)" class="ft-node-name" x="70" y="31">{val}</text>';

    // Remove job and birth date fields for minimalist layout
    FamilyTree.templates.modernGlass.field_1 = '';
    FamilyTree.templates.modernGlass.field_2 = '';

    // Flower badge SVG generator for deceased members
    const flowerBadgeSvg = (xPos) =>
      `<g transform="translate(${xPos}, 40)" class="ft-flower-badge">` +
        '<title>Telah Wafat</title>' +
        '<rect x="0" y="0" width="22" height="18" rx="9" fill="rgba(244, 63, 94, 0.2)" stroke="rgba(244, 63, 94, 0.45)" stroke-width="1"/>' +
        '<g transform="translate(4, 2) scale(0.58)" stroke="#f43f5e" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/>' +
          '<circle cx="12" cy="8" r="2"/>' +
          '<path d="m8 14 4 6 4-6"/>' +
          '<path d="M12 20v2"/>' +
        '</g>' +
      '</g>';

    // Custom male node accent & compact gender indicator badge below name
    FamilyTree.templates.modernGlass_male = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_male.node =
      '<rect x="0" y="0" height="72" width="210" fill="var(--bg-node, #0f172a)" rx="12" ry="12" stroke="#3A8D7B" stroke-width="1.5" class="ft-node-card ft-node-male"></rect>' +
      '<g transform="translate(70, 40)">' +
        '<rect x="0" y="0" width="46" height="18" rx="9" fill="rgba(69, 166, 146, 0.2)" stroke="rgba(69, 166, 146, 0.4)" stroke-width="1"/>' +
        '<g class="ft-gender-icon-male" stroke="#7AD4C0" stroke-width="1.3" fill="none">' +
          '<circle cx="9.5" cy="9.5" r="2.8"/>' +
          '<line x1="11.5" y1="7.5" x2="15" y2="4"/>' +
          '<polyline points="12.8,4 15,4 15,6.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<text x="19" y="12.5" font-size="9" font-weight="600" font-family="Inter, sans-serif" fill="#7AD4C0">Pria</text>' +
      '</g>';

    // Male deceased node with flower badge beside gender badge (70 + 46 + 5 = 121)
    FamilyTree.templates.modernGlass_male_deceased = Object.assign({}, FamilyTree.templates.modernGlass_male);
    FamilyTree.templates.modernGlass_male_deceased.node = FamilyTree.templates.modernGlass_male.node + flowerBadgeSvg(121);

    // Custom female node accent & compact gender indicator badge below name
    FamilyTree.templates.modernGlass_female = Object.assign({}, FamilyTree.templates.modernGlass);
    FamilyTree.templates.modernGlass_female.img_0 =
      '<clipPath id="avatarClip_{id}">' +
        '<circle cx="36" cy="36" r="22"></circle>' +
      '</clipPath>' +
      '<circle cx="36" cy="36" r="25" fill="none" stroke="#ec4899" stroke-width="2" opacity="0.6" class="avatar-ring"></circle>' +
      '<image preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_{id})" href="{val}" xlink:href="{val}" x="14" y="14" width="44" height="44"></image>';

    FamilyTree.templates.modernGlass_female.node =
      '<rect x="0" y="0" height="72" width="210" fill="var(--bg-node, #0f172a)" rx="12" ry="12" stroke="#db2777" stroke-width="1.5" class="ft-node-card ft-node-female"></rect>' +
      '<g transform="translate(70, 40)">' +
        '<rect x="0" y="0" width="56" height="18" rx="9" fill="rgba(236, 72, 153, 0.2)" stroke="rgba(236, 72, 153, 0.4)" stroke-width="1"/>' +
        '<g class="ft-gender-icon-female" stroke="#fbcfe8" stroke-width="1.3" fill="none">' +
          '<circle cx="10" cy="7" r="2.8"/>' +
          '<line x1="10" y1="9.8" x2="10" y2="14.5"/>' +
          '<line x1="7.8" y1="12" x2="12.2" y2="12"/>' +
        '</g>' +
        '<text x="18" y="12.5" font-size="9" font-weight="600" font-family="Inter, sans-serif" fill="#fbcfe8">Wanita</text>' +
      '</g>';

    // Female deceased node with flower badge beside gender badge (70 + 56 + 5 = 131)
    FamilyTree.templates.modernGlass_female_deceased = Object.assign({}, FamilyTree.templates.modernGlass_female);
    FamilyTree.templates.modernGlass_female_deceased.node = FamilyTree.templates.modernGlass_female.node + flowerBadgeSvg(131);
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
      const isDeceased = Boolean(copy.isDeceased === true || copy.isDeceased === 'true' || copy.deathDate);
      const gender = copy.gender === 'female' ? 'female' : 'male';
      copy.tags = [isDeceased ? `${gender}_deceased` : gender];
      return copy;
    });

    this.familyTree = new FamilyTree(this.container, {
      nodes: processedNodes,
      template: 'modernGlass',
      mouseScrool: FamilyTree.action.zoom,
      enableSearch: false,
      scaleInitial: FamilyTree.match.boundary,
      nodeBinding: {
        field_0: 'name',
        img_0: 'img'
      },
      tags: {
        male: {
          template: 'modernGlass_male'
        },
        female: {
          template: 'modernGlass_female'
        },
        male_deceased: {
          template: 'modernGlass_male_deceased'
        },
        female_deceased: {
          template: 'modernGlass_female_deceased'
        }
      },
      nodeMenu: null,
      editForm: null // Disable built-in Balkan edit form to prevent overlapping sidebars
    });

    // Handle node click event - return false to cancel Balkan built-in sidebar popup
    this.familyTree.onNodeClick((args) => {
      // Ignore click if expand button was clicked
      if (args.event && args.event.target) {
        const target = args.event.target;
        if (
          target.closest('[data-btn-id]') ||
          target.closest('.ft-up-btn')
        ) {
          return false;
        }
      }

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
          birthDate: n.birthDate || '',
          isDeceased: Boolean(n.isDeceased || n.deathDate),
          deathDate: n.deathDate || '',
          cemetery: n.cemetery || '',
          cemeteryCoords: n.cemeteryCoords || '',
          deathNotes: n.deathNotes || '',
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
          pulseRing.setAttribute('width', '222');
          pulseRing.setAttribute('height', '84');
          pulseRing.setAttribute('rx', '18');

          const tagGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          tagGroup.setAttribute('class', 'ft-search-tag');
          tagGroup.setAttribute('transform', 'translate(45, -26)');
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
