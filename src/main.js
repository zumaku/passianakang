import { StorageService } from './storageService.js';
import { FamilyTreeService } from './familyTreeService.js';
import { UIController } from './uiController.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('treeCanvas');
  if (!container) return;

  // Load saved data or preset sample data
  const initialData = StorageService.loadData();

  // Instantiate tree service
  const treeService = new FamilyTreeService(container, {
    onNodeSelected: (node) => {
      if (window.appUI) {
        window.appUI.showMemberDetail(node);
      }
    }
  });

  // Instantiate UI controller
  const ui = new UIController(treeService);
  window.appUI = ui;

  // Set data and render tree
  ui.setData(initialData);
  treeService.render(initialData);

  console.log('Passianakang FamilyTree App successfully initialized.');
});
