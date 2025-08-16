const fs = require('fs-extra');
const path = require('path');

// Reserved words that cannot be used as project names
const RESERVED_NAMES = [
  'node_modules', 'package', 'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
  'react', 'vite', 'typescript', 'javascript', 'test', 'src', 'public', 'build', 'dist',
  'con', 'prn', 'aux', 'nul', 'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
  'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
];

/**
 * Validates a project name
 * @param {string} name - The project name to validate
 * @returns {Object} - { valid: boolean, error?: string }
 */
function validateProjectName(name) {
  // Check if name is provided
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Project name is required' };
  }

  // Check for empty or whitespace-only names
  if (name.trim().length === 0) {
    return { valid: false, error: 'Project name cannot be empty' };
  }

  // Check length constraints
  if (name.length > 214) {
    return { valid: false, error: 'Project name must be less than 214 characters' };
  }

  // Check if name starts with . or _
  if (name.startsWith('.') || name.startsWith('_')) {
    return { valid: false, error: 'Project name cannot start with . or _' };
  }

  // Check for invalid characters
  const invalidChars = /[~)('!*]/;
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Project name contains invalid characters: ~)(\'!*' };
  }

  // Check for npm scope format (starts with @)
  if (name.startsWith('@')) {
    const scopePattern = /^@[a-z0-9-~][a-z0-9-._~]*\/[a-z0-9-~][a-z0-9-._~]*$/;
    if (!scopePattern.test(name)) {
      return { valid: false, error: 'Invalid scoped package name format' };
    }
  } else {
    // Check for spaces and special characters
    const validPattern = /^[a-z0-9][a-z0-9\-_.]*$/i;
    if (!validPattern.test(name)) {
      return { 
        valid: false, 
        error: 'Project name can only contain letters, numbers, hyphens, underscores, and dots. Must start with a letter or number.' 
      };
    }
  }

  // Check for reserved names (but not for scoped packages)
  if (!name.startsWith('@') && RESERVED_NAMES.includes(name.toLowerCase())) {
    return { valid: false, error: `"${name}" is a reserved name and cannot be used` };
  }

  return { valid: true };
}

/**
 * Checks if a directory is safe to remove
 * @param {string} dirPath - The directory path to check
 * @returns {boolean} - True if safe to remove
 */
function isSafeToRemove(dirPath) {
  // Don't allow removing system directories or parent directories
  const resolvedPath = path.resolve(dirPath);
  const systemPaths = [
    path.resolve('/'),
    path.resolve(process.env.HOME || process.env.USERPROFILE || '/'),
    path.resolve(process.cwd()),
    path.resolve('/usr'),
    path.resolve('/etc'),
    path.resolve('/var'),
    path.resolve('/System'),
    path.resolve('/Windows'),
    path.resolve('/Program Files'),
    path.resolve('/Program Files (x86)')
  ];

  // Check if trying to remove a system path
  for (const systemPath of systemPaths) {
    if (resolvedPath === systemPath || resolvedPath.startsWith(systemPath + path.sep)) {
      if (resolvedPath === systemPath) return false;
    }
  }

  // Check if path contains suspicious patterns
  if (resolvedPath.includes('..') || resolvedPath.includes('~')) {
    return false;
  }

  return true;
}

/**
 * Validates a target directory path
 * @param {string} targetPath - The target directory path
 * @returns {Object} - { valid: boolean, error?: string, warnings?: string[] }
 */
function validateTargetDirectory(targetPath) {
  const result = { valid: true, warnings: [] };

  // Check if path is absolute and safe
  const resolvedPath = path.resolve(targetPath);
  
  if (!isSafeToRemove(resolvedPath)) {
    return { valid: false, error: 'Cannot create project in system directory or unsafe location' };
  }

  // Check if we have write permissions to parent directory
  const parentDir = path.dirname(resolvedPath);
  try {
    fs.accessSync(parentDir, fs.constants.W_OK);
  } catch (error) {
    return { valid: false, error: `No write permission to directory: ${parentDir}` };
  }

  // Check if directory exists and has contents
  if (fs.existsSync(resolvedPath)) {
    try {
      const files = fs.readdirSync(resolvedPath);
      if (files.length > 0) {
        result.warnings.push(`Directory ${path.basename(resolvedPath)} is not empty`);
      }
    } catch (error) {
      return { valid: false, error: `Cannot read directory: ${resolvedPath}` };
    }
  }

  return result;
}

module.exports = {
  validateProjectName,
  validateTargetDirectory,
  isSafeToRemove,
  RESERVED_NAMES
};