const { spawn } = require('cross-spawn');
const { BoilerplateError, ERROR_TYPES } = require('./error-handler');

/**
 * Checks network connectivity by pinging a reliable host
 * @param {Object} options - Options for connectivity check
 * @returns {Promise<boolean>}
 */
async function checkNetworkConnectivity(options = {}) {
  const { timeout = 5000, host = 'registry.npmjs.org' } = options;

  return new Promise((resolve) => {
    const isWindows = process.platform === 'win32';
    const pingCommand = isWindows ? 'ping' : 'ping';
    const pingArgs = isWindows 
      ? ['-n', '1', '-w', timeout.toString(), host]
      : ['-c', '1', '-W', (timeout / 1000).toString(), host];

    const child = spawn(pingCommand, pingArgs, { stdio: 'pipe' });
    
    const timer = setTimeout(() => {
      child.kill();
      resolve(false);
    }, timeout);

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(code === 0);
    });

    child.on('error', () => {
      clearTimeout(timer);
      resolve(false);
    });
  });
}

/**
 * Checks if npm registry is accessible
 * @param {Object} options - Options for registry check
 * @returns {Promise<boolean>}
 */
async function checkNpmRegistry(options = {}) {
  const { timeout = 10000, registry = 'https://registry.npmjs.org' } = options;

  return new Promise((resolve) => {
    const child = spawn('npm', ['ping', '--registry', registry], { 
      stdio: 'pipe',
      timeout 
    });

    child.on('close', (code) => {
      resolve(code === 0);
    });

    child.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Comprehensive network check for package installation
 * @param {Object} options - Options for network checks
 * @returns {Promise<Object>}
 */
async function performNetworkChecks(options = {}) {
  const { verbose = false } = options;
  
  if (verbose) {
    console.log('🔍 Checking network connectivity...');
  }

  const results = {
    internet: false,
    npmRegistry: false,
    canInstallPackages: false
  };

  try {
    // Check basic internet connectivity
    results.internet = await checkNetworkConnectivity();
    
    if (results.internet) {
      // Check npm registry specifically
      results.npmRegistry = await checkNpmRegistry();
    }

    results.canInstallPackages = results.internet && results.npmRegistry;

    if (verbose) {
      console.log(`  • Internet connectivity: ${results.internet ? '✓' : '✗'}`);
      console.log(`  • NPM registry access: ${results.npmRegistry ? '✓' : '✗'}`);
    }

    return results;
  } catch (error) {
    if (verbose) {
      console.log('  • Network check failed:', error.message);
    }
    return results;
  }
}

/**
 * Ensures network connectivity before proceeding with installation
 * @param {Object} options - Options for network verification
 * @throws {BoilerplateError} If network is not available
 */
async function ensureNetworkConnectivity(options = {}) {
  const { skipCheck = false, verbose = false } = options;
  
  if (skipCheck) {
    if (verbose) {
      console.log('⚠️  Skipping network connectivity check');
    }
    return;
  }

  const networkStatus = await performNetworkChecks({ verbose });

  if (!networkStatus.canInstallPackages) {
    const errorMessage = !networkStatus.internet 
      ? 'No internet connection detected'
      : 'Cannot access npm registry';
      
    throw new BoilerplateError(
      `${errorMessage}. Package installation will fail.`,
      ERROR_TYPES.NETWORK,
      { networkStatus }
    );
  }

  if (verbose) {
    console.log('✅ Network connectivity verified');
  }
}

/**
 * Checks if running in offline mode
 * @returns {boolean}
 */
function isOfflineMode() {
  return process.env.npm_config_offline === 'true' || 
         process.env.YARN_OFFLINE === 'true' ||
         process.argv.includes('--offline');
}

/**
 * Gets network-related environment information
 * @returns {Object}
 */
function getNetworkEnvironment() {
  return {
    offline: isOfflineMode(),
    proxy: process.env.HTTP_PROXY || process.env.http_proxy,
    httpsProxy: process.env.HTTPS_PROXY || process.env.https_proxy,
    noProxy: process.env.NO_PROXY || process.env.no_proxy,
    npmRegistry: process.env.npm_config_registry,
    userAgent: process.env.npm_config_user_agent
  };
}

module.exports = {
  checkNetworkConnectivity,
  checkNpmRegistry,
  performNetworkChecks,
  ensureNetworkConnectivity,
  isOfflineMode,
  getNetworkEnvironment
};