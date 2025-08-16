const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Error types for better error handling
 */
const ERROR_TYPES = {
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  FILESYSTEM: 'FILESYSTEM',
  PACKAGE_MANAGER: 'PACKAGE_MANAGER',
  TEMPLATE: 'TEMPLATE',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Custom error class with type and context
 */
class BoilerplateError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, context = {}) {
    super(message);
    this.name = 'BoilerplateError';
    this.type = type;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Rollback manager to handle cleanup on failures
 */
class RollbackManager {
  constructor() {
    this.actions = [];
    this.completed = false;
  }

  /**
   * Adds a rollback action
   * @param {Function} action - Function to execute for rollback
   * @param {string} description - Description of the action
   */
  addAction(action, description) {
    this.actions.push({ action, description });
  }

  /**
   * Executes all rollback actions in reverse order
   */
  async execute() {
    if (this.completed) return;
    this.completed = true;

    console.log(chalk.yellow('\\n🔄 Rolling back changes...'));
    
    for (let i = this.actions.length - 1; i >= 0; i--) {
      const { action, description } = this.actions[i];
      try {
        console.log(chalk.gray(`  • ${description}`));
        await action();
      } catch (error) {
        console.log(chalk.red(`  ✗ Failed to rollback: ${description}`));
        console.log(chalk.red(`    ${error.message}`));
      }
    }
    
    console.log(chalk.yellow('Rollback completed.\\n'));
  }

  /**
   * Marks rollback as completed (prevents execution)
   */
  markCompleted() {
    this.completed = true;
  }
}

/**
 * Creates a project rollback manager
 * @param {string} projectPath - Path to the project directory
 * @returns {RollbackManager}
 */
function createProjectRollback(projectPath) {
  const rollback = new RollbackManager();
  
  // Add directory cleanup
  rollback.addAction(
    async () => {
      if (fs.existsSync(projectPath)) {
        await fs.remove(projectPath);
      }
    },
    `Remove project directory: ${path.basename(projectPath)}`
  );

  return rollback;
}

/**
 * Formats error messages with helpful suggestions
 * @param {Error} error - The error to format
 * @returns {string}
 */
function formatErrorMessage(error) {
  let message = chalk.red('✗ Error: ') + error.message;
  
  // Add specific suggestions based on error type
  if (error instanceof BoilerplateError) {
    switch (error.type) {
      case ERROR_TYPES.NETWORK:
        message += '\\n\\n' + chalk.yellow('💡 Suggestions:');
        message += '\\n  • Check your internet connection';
        message += '\\n  • Try using a different network';
        message += '\\n  • Use --offline flag if available';
        break;
        
      case ERROR_TYPES.PACKAGE_MANAGER:
        message += '\\n\\n' + chalk.yellow('💡 Suggestions:');
        message += '\\n  • Try using a different package manager with --pm flag';
        message += '\\n  • Clear package manager cache';
        message += '\\n  • Check if package manager is properly installed';
        if (error.context.manager) {
          message += `\\n  • Try: ${error.context.manager} cache clean --force`;
        }
        break;
        
      case ERROR_TYPES.FILESYSTEM:
        message += '\\n\\n' + chalk.yellow('💡 Suggestions:');
        message += '\\n  • Check file permissions';
        message += '\\n  • Ensure you have write access to the directory';
        message += '\\n  • Try running with elevated permissions';
        break;
        
      case ERROR_TYPES.VALIDATION:
        message += '\\n\\n' + chalk.yellow('💡 Suggestions:');
        message += '\\n  • Use only letters, numbers, hyphens, and underscores';
        message += '\\n  • Start with a letter or number';
        message += '\\n  • Avoid reserved words';
        break;
    }
  }
  
  // Add general troubleshooting
  message += '\\n\\n' + chalk.gray('For more help, visit: https://github.com/yourusername/react-vite-boilerplate/issues');
  
  return message;
}

/**
 * Handles errors gracefully with rollback and logging
 * @param {Error} error - The error to handle
 * @param {RollbackManager} rollback - Rollback manager instance
 * @param {Object} options - Options for error handling
 */
async function handleError(error, rollback = null, options = {}) {
  const { verbose = false, exitProcess = true } = options;

  // Execute rollback if provided
  if (rollback) {
    await rollback.execute();
  }

  // Format and display error
  const formattedMessage = formatErrorMessage(error);
  console.log('\\n' + formattedMessage);

  // Log detailed error in verbose mode
  if (verbose && error.stack) {
    console.log('\\n' + chalk.gray('Stack trace:'));
    console.log(chalk.gray(error.stack));
  }

  // Log context if available
  if (error.context && Object.keys(error.context).length > 0) {
    console.log('\\n' + chalk.gray('Error context:'));
    console.log(chalk.gray(JSON.stringify(error.context, null, 2)));
  }

  if (exitProcess) {
    process.exit(1);
  }
}

/**
 * Wraps async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {RollbackManager} rollback - Rollback manager
 * @param {Object} options - Options for error handling
 * @returns {Function}
 */
function withErrorHandling(fn, rollback = null, options = {}) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      await handleError(error, rollback, options);
    }
  };
}

module.exports = {
  ERROR_TYPES,
  BoilerplateError,
  RollbackManager,
  createProjectRollback,
  formatErrorMessage,
  handleError,
  withErrorHandling
};