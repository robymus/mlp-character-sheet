import './style.css';
import cutieMarksList from './cutiemarks.js';

document.addEventListener('DOMContentLoaded', () => {
  const skillGroups = document.querySelectorAll('.skill-group');

  const diceTypes = ['D2', 'D4', 'D6', 'D8', 'D10', 'D12'];

  skillGroups.forEach(group => {
    const skillName = group.dataset.skill.replace('_', ' ').toUpperCase();

    // Some skills have modifiers instead of dice (like conditioning, initiative)
    const isModifierSkill = group.dataset.skill === 'conditioning' || group.dataset.skill === 'initiative';
    const labels = isModifierSkill ? ['+1', '+2', '+3', '+4', '+5', '+6'] : diceTypes;

    let checkboxesHtml = '';
    labels.forEach(label => {
      checkboxesHtml += `
        <div class="dice-box">
          <label>${label}</label>
          <input type="checkbox" name="${group.dataset.skill}-${label}" />
        </div>
      `;
    });

    let specHtml = '';
    if (!isModifierSkill) {
      specHtml = `
             <div class="skill-specialization">
                <span class="spec-label">specialization</span>
                <div class="spec-rows">
                  <div class="spec-row"><input type="checkbox" class="spec-check"/><input type="text" class="spec-input"/></div>
                  <div class="spec-row"><input type="checkbox" class="spec-check"/><input type="text" class="spec-input"/></div>
                  <div class="spec-row"><input type="checkbox" class="spec-check"/><input type="text" class="spec-input"/></div>
                </div>
             </div>
           `;
    }

    group.innerHTML = `
      <div class="skill-header">
         <span class="skill-name">${skillName}</span>
         <div class="dice-track">
           ${checkboxesHtml}
         </div>
      </div>
      ${specHtml}
    `;
  });

  // --- Cutie Mark Logic ---
  const cutieMarkContainer = document.querySelector('.cutie-mark-container');
  const currentCutieMarkImg = document.getElementById('current-cutie-mark');
  const modal = document.getElementById('cutie-mark-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const grid = document.getElementById('cutie-mark-grid');

  // Randomize on load
  const randomInitIndex = Math.floor(Math.random() * (cutieMarksList.length - 1)) + 1; // Skip the first 'random' icon if we added it to list, but here it's just raw files
  currentCutieMarkImg.src = `cutiemarks/${cutieMarksList[Math.floor(Math.random() * cutieMarksList.length)]}`;

  // Populate grid
  // 1. Add the Random Choice special icon
  const randomChoiceDiv = document.createElement('div');
  randomChoiceDiv.className = 'cutie-mark-item';
  randomChoiceDiv.innerHTML = `<img src="cutiemarks/random_choice.svg" alt="Random Choice" title="Random Choice" />`;
  randomChoiceDiv.addEventListener('click', () => {
    const randomIndex = Math.floor(Math.random() * cutieMarksList.length);
    currentCutieMarkImg.src = `cutiemarks/${cutieMarksList[randomIndex]}`;
    modal.classList.add('hidden');
  });
  grid.appendChild(randomChoiceDiv);

  // 2. Add all other cutie marks
  cutieMarksList.forEach(filename => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cutie-mark-item';

    // Clean name for title
    let cleanTitle = filename.split('.')[0].replace(/_/g, ' ');
    if (cleanTitle.startsWith('AiP CM ')) cleanTitle = cleanTitle.substring(7);
    if (cleanTitle.startsWith('HappyStudio ')) cleanTitle = cleanTitle.substring(12);
    if (cleanTitle.startsWith('PonyMaker ')) cleanTitle = cleanTitle.substring(10);

    itemDiv.innerHTML = `<img src="cutiemarks/${filename}" alt="${cleanTitle}" title="${cleanTitle}" loading="lazy" />`;

    itemDiv.addEventListener('click', () => {
      currentCutieMarkImg.src = `cutiemarks/${filename}`;
      modal.classList.add('hidden');
    });

    grid.appendChild(itemDiv);
  });

  // Open modal
  cutieMarkContainer.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Close modal
  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Close when clicking outside modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

});
