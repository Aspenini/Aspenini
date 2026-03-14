import '../style.css';
import { ParticleSystem } from './particles';
import { projects } from './data/projects';
import { renderProjects } from './dom';
import {
  initCardGlow,
  initScrollReveal,
  initConsoleEasterEgg,
} from './interactions';

function main(): void {
  const canvas = document.getElementById('particles') as HTMLCanvasElement;
  if (canvas) new ParticleSystem(canvas).animate();

  const projectList = document.querySelector<HTMLUListElement>('.project-list');
  if (projectList) renderProjects(projectList, projects);

  initCardGlow();
  initScrollReveal();
  initConsoleEasterEgg();
}

document.addEventListener('DOMContentLoaded', main);
