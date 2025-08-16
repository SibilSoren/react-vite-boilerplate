#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const ora = require('ora');
const spawn = require('cross-spawn');
const inquirer = require('inquirer');

// Import our custom modules
const { validateProjectName, validateTargetDirectory } = require('../lib/validators');
const { 
  detectAvailablePackageManagers, 
  getPreferredPackageManager, 
  installDependencies,
  runScript 
} = require('../lib/package-managers');
const { 
  BoilerplateError, 
  ERROR_TYPES, 
  createProjectRollback, 
  handleError,
  withErrorHandling 
} = require('../lib/error-handler');
const { 
  ensureNetworkConnectivity, 
  isOfflineMode,
  getNetworkEnvironment 
} = require('../lib/network');

const program = new Command();

program
  .name('react-vite-boilerplate')
  .description('Create a React + Vite project with TanStack Router, SEO tooling, and Shadcn/Tailwind')
  .version('1.0.0')
  .argument('<project-name>', 'name of the project')
  .option('-y, --yes', 'skip interactive prompts and use defaults')
  .option('--pm <manager>', 'specify package manager (npm, yarn, pnpm, bun)')
  .option('--skip-install', 'skip package installation')
  .option('--skip-git', 'skip git repository initialization')
  .option('--verbose', 'enable verbose output')
  .option('--dry-run', 'show what would be created without actually creating it')
  .option('--template <name>', 'use a specific template variant')
  .action(async (projectName, options) => {
    const rollback = createProjectRollback(path.resolve(process.cwd(), projectName));
    
    const wrappedCreateProject = withErrorHandling(
      createProject, 
      rollback, 
      { verbose: options.verbose }
    );
    
    await wrappedCreateProject(projectName, options, rollback);
  });

async function createProject(projectName, options, rollback) {
  const { 
    yes = false, 
    pm = null, 
    skipInstall = false, 
    skipGit = false, 
    verbose = false, 
    dryRun = false,
    template = 'default'
  } = options;

  // Step 1: Validate project name
  if (verbose) console.log('🔍 Validating project name...');
  const nameValidation = validateProjectName(projectName);
  if (!nameValidation.valid) {
    throw new BoilerplateError(nameValidation.error, ERROR_TYPES.VALIDATION);
  }

  const targetDir = path.resolve(process.cwd(), projectName);

  // Step 2: Validate target directory
  if (verbose) console.log('🔍 Validating target directory...');
  const dirValidation = validateTargetDirectory(targetDir);
  if (!dirValidation.valid) {
    throw new BoilerplateError(dirValidation.error, ERROR_TYPES.FILESYSTEM);
  }

  // Show warnings if any
  if (dirValidation.warnings && dirValidation.warnings.length > 0) {
    for (const warning of dirValidation.warnings) {
      console.log(chalk.yellow(`⚠️  ${warning}`));
    }
  }

  // Step 3: Handle existing directory
  if (fs.existsSync(targetDir)) {
    if (!yes) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectName} already exists. Overwrite?`,
          default: false
        }
      ]);
      
      if (!overwrite) {
        console.log(chalk.yellow('Operation cancelled.'));
        rollback.markCompleted(); // Don't run rollback for user cancellation
        return;
      }
    }
    
    if (!dryRun) {
      await fs.remove(targetDir);
    }
  }

  // Step 4: Dry run mode - just show what would be created
  if (dryRun) {
    console.log(chalk.blue('🔍 Dry run mode - showing what would be created:'));
    console.log(`📁 Project directory: ${targetDir}`);
    console.log(`📦 Template: ${template}`);
    console.log(`🛠️  Package manager: ${pm || 'auto-detected'}`);
    console.log(`📦 Skip installation: ${skipInstall}`);
    console.log(`🔄 Skip git init: ${skipGit}`);
    return;
  }

  console.log(chalk.blue(`🚀 Creating React + Vite project: ${projectName}`));

  // Step 5: Check network connectivity (if not skipping install)
  if (!skipInstall && !isOfflineMode()) {
    await ensureNetworkConnectivity({ verbose });
  }

  // Step 6: Detect and validate package manager
  let packageManager = pm;
  if (!skipInstall) {
    const availableManagers = await detectAvailablePackageManagers();
    
    if (verbose) {
      console.log(`📦 Available package managers: ${availableManagers.join(', ')}`);
    }
    
    if (packageManager && !availableManagers.includes(packageManager)) {
      throw new BoilerplateError(
        `Package manager "${packageManager}" is not available`,
        ERROR_TYPES.PACKAGE_MANAGER,
        { requested: packageManager, available: availableManagers }
      );
    }
    
    if (!packageManager) {
      packageManager = getPreferredPackageManager(process.cwd(), availableManagers);
      if (verbose) {
        console.log(`📦 Using package manager: ${packageManager}`);
      }
    }
  }

  // Step 7: Create project directory
  if (verbose) console.log('📁 Creating project directory...');
  await fs.ensureDir(targetDir);
  
  // Step 8: Copy template files
  const spinner = ora('📋 Setting up project structure...').start();
  try {
    await copyTemplateFiles(targetDir, projectName, { template, verbose });
    spinner.succeed('Project structure created');
  } catch (error) {
    spinner.fail('Failed to create project structure');
    throw new BoilerplateError(
      `Template creation failed: ${error.message}`,
      ERROR_TYPES.TEMPLATE,
      { template, originalError: error.message }
    );
  }

  // Step 9: Install dependencies
  if (!skipInstall) {
    const installSpinner = ora(`📦 Installing dependencies with ${packageManager}...`).start();
    try {
      await installDependencies(packageManager, targetDir, { verbose });
      installSpinner.succeed('Dependencies installed');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      throw new BoilerplateError(
        `Package installation failed: ${error.message}`,
        ERROR_TYPES.PACKAGE_MANAGER,
        { manager: packageManager, stdout: error.stdout, stderr: error.stderr }
      );
    }

    // Step 10: Setup Shadcn/UI
    const shadcnSpinner = ora('🎨 Setting up Shadcn/UI...').start();
    try {
      await setupShadcn(targetDir, { verbose });
      shadcnSpinner.succeed('Shadcn/UI configured');
    } catch (error) {
      shadcnSpinner.fail('Shadcn/UI setup failed');
      // This is not critical, so we just warn
      console.log(chalk.yellow(`⚠️  Shadcn/UI setup failed: ${error.message}`));
      console.log(chalk.yellow('You can set it up manually later with: npx shadcn@latest init'));
    }
  }

  // Step 11: Initialize Git repository
  if (!skipGit) {
    try {
      await initGitRepository(targetDir, { verbose });
    } catch (error) {
      console.log(chalk.yellow(`⚠️  Git initialization failed: ${error.message}`));
    }
  }

  // Mark rollback as completed (success)
  rollback.markCompleted();

  // Step 12: Success message
  displaySuccessMessage(projectName, {
    packageManager: skipInstall ? null : packageManager,
    skipInstall,
    skipGit,
    template
  });
}

async function copyTemplateFiles(targetDir, projectName, options = {}) {
  const { template = 'default', verbose = false } = options;
  const templateDir = path.join(__dirname, '..', 'templates');
  
  if (verbose) {
    console.log(`📋 Copying template files from: ${templateDir}`);
  }
  
  // Copy all template files
  await fs.copy(templateDir, targetDir, {
    filter: (src, dest) => {
      // Skip copying .git directory but allow .gitignore and other dotfiles
      if (src.includes('.git') && !src.endsWith('.gitignore')) return false;
      if (verbose) {
        console.log(`  📄 ${path.relative(templateDir, src)}`);
      }
      return true;
    }
  });
  
  // Update package.json with project name
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = projectName;
  
  // Add current date to package.json
  packageJson.version = "0.1.0";
  packageJson.private = true;
  
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  
  if (verbose) {
    console.log(`✅ Updated package.json with project name: ${projectName}`);
  }
}

async function setupShadcn(targetDir, options = {}) {
  const { verbose = false } = options;
  
  return new Promise((resolve, reject) => {
    const args = ['shadcn@latest', 'init', '--yes'];
    
    if (verbose) {
      console.log(`🎨 Running: npx ${args.join(' ')}`);
    }
    
    const child = spawn('npx', args, {
      cwd: targetDir,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    let stderr = '';
    
    if (!verbose) {
      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });
    }
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Shadcn setup failed with code ${code}${stderr ? ': ' + stderr : ''}`));
      } else {
        resolve();
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function initGitRepository(targetDir, options = {}) {
  const { verbose = false } = options;
  
  if (verbose) {
    console.log('🔄 Initializing Git repository...');
  }
  
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['init'], {
      cwd: targetDir,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Git init failed with code ${code}`));
      } else {
        // Create initial commit
        createInitialCommit(targetDir, { verbose })
          .then(resolve)
          .catch(reject);
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function createInitialCommit(targetDir, options = {}) {
  const { verbose = false } = options;
  
  return new Promise((resolve, reject) => {
    // Add all files
    const addChild = spawn('git', ['add', '.'], {
      cwd: targetDir,
      stdio: verbose ? 'inherit' : 'pipe'
    });
    
    addChild.on('close', (addCode) => {
      if (addCode !== 0) {
        reject(new Error(`Git add failed with code ${addCode}`));
        return;
      }
      
      // Create initial commit
      const commitChild = spawn('git', ['commit', '-m', 'Initial commit'], {
        cwd: targetDir,
        stdio: verbose ? 'inherit' : 'pipe'
      });
      
      commitChild.on('close', (commitCode) => {
        if (commitCode !== 0) {
          // Git commit might fail if no user is configured, but that's okay
          if (verbose) {
            console.log('⚠️  Git commit failed - you may need to configure git user.name and user.email');
          }
        }
        resolve(); // Don't fail the whole process for git issues
      });
      
      commitChild.on('error', () => {
        resolve(); // Don't fail the whole process for git issues
      });
    });
    
    addChild.on('error', (error) => {
      reject(error);
    });
  });
}

function displaySuccessMessage(projectName, options = {}) {
  const { packageManager, skipInstall, skipGit, template } = options;
  
  console.log();
  console.log(chalk.green('🎉 Project created successfully!'));
  console.log();
  
  console.log('📁 Project details:');
  console.log(`  • Name: ${chalk.cyan(projectName)}`);
  console.log(`  • Template: ${chalk.cyan(template)}`);
  if (!skipInstall && packageManager) {
    console.log(`  • Package manager: ${chalk.cyan(packageManager)}`);
  }
  console.log();
  
  console.log('🚀 Next steps:');
  console.log(chalk.cyan(`  cd ${projectName}`));
  
  if (skipInstall) {
    console.log(chalk.cyan('  npm install'));
  }
  
  console.log(chalk.cyan('  npm run dev'));
  console.log();
  
  console.log('✨ Features included:');
  console.log('  • React 18 with TypeScript');
  console.log('  • Vite for fast development');
  console.log('  • TanStack Router for routing');
  console.log('  • Tailwind CSS for styling');
  console.log('  • Shadcn/UI components');
  console.log('  • React Helmet Async for SEO');
  console.log('  • ESLint configuration');
  
  if (!skipGit) {
    console.log('  • Git repository initialized');
  }
  
  console.log();
  console.log(chalk.gray('Happy coding! 🚀'));
}

program.parse();