/**
 * Data Service Module
 * Centralized data access for all fishbone categories
 * @version 2.2.0
 * @license MIT
 */

// Import all category modules
import humanData from './man.js';
import methodData from './method.js';
import machineData from './machine.js';
import measurementData from './measurement.js';
import materialData from './material.js';
import environmentData from './mothernature.js';

function defaultCategories() {
  return {
    'man': { name: 'Manusia', color: 'primary', icon: 'fas fa-users', data: [] },
    'method': { name: 'Metode', color: 'info', icon: 'fas fa-project-diagram', data: [] },
    'machine': { name: 'Mesin', color: 'warning', icon: 'fas fa-cogs', data: [] },
    'measurement': { name: 'Pengukuran', color: 'success', icon: 'fas fa-ruler-combined', data: [] },
    'material': { name: 'Material', color: 'danger', icon: 'fas fa-boxes', data: [] },
    'mothernature': { name: 'Lingkungan', color: 'secondary', icon: 'fas fa-leaf', data: [] }
  };
}

function normalizeCauseData(cause, categoryId) {
  return {
    id: cause.id || '',
    cause: cause.cause || 'Penyebab tidak diketahui',
    description: cause.description || 'Tidak ada deskripsi tersedia',
    priority: cause.priority || 'Medium',
    solutions: Array.isArray(cause.solutions) ? cause.solutions : [],
    category: categoryId,
    ...cause
  };
}

/**
 * Get all categories with their data
 * @returns {Object} Categories data structure
 */
export function getCategories() {
  try {
    const categories = {
      'man': {
        name: 'Manusia',
        color: 'primary',
        icon: 'fas fa-users',
        data: Array.isArray(humanData.items) ? humanData.items.map(item => normalizeCauseData(item, 'man')) : []
      },
      'method': {
        name: 'Metode',
        color: 'info',
        icon: 'fas fa-project-diagram',
        data: Array.isArray(methodData.items) ? methodData.items.map(item => normalizeCauseData(item, 'method')) : []
      },
      'machine': {
        name: 'Mesin',
        color: 'warning',
        icon: 'fas fa-cogs',
        data: Array.isArray(machineData.items) ? machineData.items.map(item => normalizeCauseData(item, 'machine')) : []
      },
      'measurement': {
        name: 'Pengukuran',
        color: 'success',
        icon: 'fas fa-ruler-combined',
        data: Array.isArray(measurementData.items) ? measurementData.items.map(item => normalizeCauseData(item, 'measurement')) : []
      },
      'material': {
        name: 'Material',
        color: 'danger',
        icon: 'fas fa-boxes',
        data: Array.isArray(materialData.items) ? materialData.items.map(item => normalizeCauseData(item, 'material')) : []
      },
      'mothernature': {
        name: 'Lingkungan',
        color: 'secondary',
        icon: 'fas fa-leaf',
        data: Array.isArray(environmentData.items) ? environmentData.items.map(item => normalizeCauseData(item, 'mothernature')) : []
      }
    };

    return categories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories();
  }
}

/**
 * Get specific category data
 * @param {string} categoryId - Category identifier
 * @returns {Object|null} Category data or null if not found
 */
export function getCategory(categoryId) {
  const categories = getCategories();
  return categories[categoryId] || null;
}

/**
 * Get all causes across all categories
 * @returns {Array} All causes with category information
 */
export function getAllCauses() {
  const categories = getCategories();
  return Object.entries(categories).flatMap(([categoryId, category]) => {
    return category.data.map(cause => ({
      ...cause,
      categoryId,
      categoryName: category.name,
      categoryColor: category.color,
      categoryIcon: category.icon
    }));
  });
}

/**
 * Find cause by ID across all categories
 * @param {string} causeId - Cause ID to find
 * @returns {Object|null} Found cause or null
 */
export function findCauseById(causeId) {
  if (!causeId) return null;
  
  const categories = getCategories();
  for (const [categoryId, category] of Object.entries(categories)) {
    const cause = category.data.find(item => item.id === causeId);
    if (cause) {
      return {
        ...cause,
        categoryId,
        categoryName: category.name,
        categoryColor: category.color,
        categoryIcon: category.icon
      };
    }
  }
  return null;
}

export default {
  getCategories,
  getCategory,
  getAllCauses,
  findCauseById
};