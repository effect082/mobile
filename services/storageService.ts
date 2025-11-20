import { Project } from '../types';

const STORAGE_KEY = 'welfareone_projects';

export const getProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load projects from storage:", error);
    return [];
  }
};

export const saveProject = (project: Project): void => {
  try {
    const projects = getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Failed to save project:", error);
    alert("저장 공간이 부족하거나 오류가 발생하여 저장하지 못했습니다.");
  }
};

export const deleteProject = (id: string): void => {
  try {
    const projects = getProjects().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Failed to delete project:", error);
  }
};

export const getProjectById = (id: string): Project | undefined => {
  return getProjects().find(p => p.id === id);
};