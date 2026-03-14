import type { Project } from './types';

export function createProjectCard(project: Project, index: number): HTMLLIElement {
  const li = document.createElement('li');
  li.className = 'project-item-wrapper';
  li.style.animationDelay = `${index * 0.08}s`;
  li.innerHTML = `
    <span class="dot"></span>
    <div class="project-item">
      <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
        ${project.name}
        <span class="project-arrow">→</span>
      </a>
      <span class="project-desc">${project.description}</span>
      ${project.tags?.length ? `<div class="project-tags">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
    </div>
  `;
  return li;
}

export function renderProjects(container: HTMLElement, projects: Project[]): void {
  const fragment = document.createDocumentFragment();
  projects.forEach((project, i) => {
    fragment.appendChild(createProjectCard(project, i));
  });
  container.replaceChildren(fragment);
}
