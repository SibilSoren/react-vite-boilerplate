const spawn = require('cross-spawn');
const chalk = require('chalk');

/**
 * Package manager configurations
 */
const PACKAGE_MANAGERS = {
  npm: {
    name: 'npm',
    installCommand: ['install'],
    lockFile: 'package-lock.json',
    checkCommand: ['--version']
  },
  yarn: {
    name: 'yarn',
    installCommand: ['install'],
    lockFile: 'yarn.lock',
    checkCommand: ['--version']
  },
  pnpm: {
    name: 'pnpm',
    installCommand: ['install'],
    lockFile: 'pnpm-lock.yaml',
    checkCommand: ['--version']
  },
  bun: {
    name: 'bun',
    installCommand: ['install'],
    lockFile: 'bun.lockb',
    checkCommand: ['--version']
  }
};

/**
 * Checks if a package manager is available
 * @param {string} manager - Package manager name
 * @returns {Promise<boolean>}
 */
async function isPackageManagerAvailable(manager) {
  const config = PACKAGE_MANAGERS[manager];
  if (!config) return false;

  return new Promise((resolve) => {
    const child = spawn(manager, config.checkCommand, { stdio: 'pipe' });
    
    child.on('close', (code) => {
      resolve(code === 0);
    });
    
    child.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Detects available package managers
 * @returns {Promise<string[]>}
 */
async function detectAvailablePackageManagers() {
  const managers = Object.keys(PACKAGE_MANAGERS);
  const available = [];

  for (const manager of managers) {
    if (await isPackageManagerAvailable(manager)) {
      available.push(manager);
    }
  }

  return available;
}

/**
 * Gets the preferred package manager based on lockfiles or user preference
 * @param {string} projectDir - Project directory to check for lockfiles
 * @param {string[]} available - Available package managers
 * @returns {string}
 */
function getPreferredPackageManager(projectDir, available) {
  const fs = require('fs-extra');
  const path = require('path');

  // Check for existing lockfiles in the project directory
  for (const [manager, config] of Object.entries(PACKAGE_MANAGERS)) {
    const lockFilePath = path.join(projectDir, config.lockFile);
    if (fs.existsSync(lockFilePath) && available.includes(manager)) {
      return manager;
    }
  }

  // Check for lockfiles in parent directory (in case of workspace)
  const parentDir = path.dirname(projectDir);
  for (const [manager, config] of Object.entries(PACKAGE_MANAGERS)) {
    const lockFilePath = path.join(parentDir, config.lockFile);
    if (fs.existsSync(lockFilePath) && available.includes(manager)) {
      return manager;
    }
  }

  // Default priority order
  const priority = ['pnpm', 'yarn', 'bun', 'npm'];
  for (const manager of priority) {
    if (available.includes(manager)) {
      return manager;
    }
  }

  return available[0] || 'npm';
}

/**
 * Installs dependencies using the specified package manager
 * @param {string} manager - Package manager to use
 * @param {string} targetDir - Target directory
 * @param {Object} options - Installation options
 * @returns {Promise<void>}
 */
async function installDependencies(manager, targetDir, options = {}) {
  const config = PACKAGE_MANAGERS[manager];
  if (!config) {
    throw new Error(`Unknown package manager: ${manager}`);
  }

  return new Promise((resolve, reject) => {
    console.log(chalk.gray(`Using ${manager} for package installation...`));
    
    const args = [...config.installCommand];
    if (options.silent) {
      args.push('--silent');
    }

    const child = spawn(manager, args, {
      cwd: targetDir,
      stdio: options.verbose ? 'inherit' : 'pipe'
    });

    let stdout = '';
    let stderr = '';

    if (!options.verbose) {
      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }

    child.on('close', (code) => {
      if (code !== 0) {
        const error = new Error(`${manager} install failed with code ${code}`);
        error.stdout = stdout;
        error.stderr = stderr;
        error.manager = manager;
        reject(error);
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      error.manager = manager;
      reject(error);
    });
  });
}

/**
 * Runs a script using the specified package manager
 * @param {string} manager - Package manager to use
 * @param {string} script - Script name to run
 * @param {string} targetDir - Target directory
 * @param {Object} options - Run options
 * @returns {Promise<void>}
 */
async function runScript(manager, script, targetDir, options = {}) {
  return new Promise((resolve, reject) => {
    const runCommand = manager === 'npm' ? ['run', script] : [script];
    
    const child = spawn(manager, runCommand, {
      cwd: targetDir,
      stdio: options.verbose ? 'inherit' : 'pipe'
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${manager} run ${script} failed with code ${code}`));
      } else {
        resolve();
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = {
  PACKAGE_MANAGERS,
  isPackageManagerAvailable,
  detectAvailablePackageManagers,
  getPreferredPackageManager,
  installDependencies,
  runScript
};