const { 
  isPackageManagerAvailable, 
  detectAvailablePackageManagers, 
  getPreferredPackageManager,
  PACKAGE_MANAGERS
} = require('../lib/package-managers');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('Package Manager Detection', () => {
  test('should detect npm availability', async () => {
    const isAvailable = await isPackageManagerAvailable('npm');
    expect(typeof isAvailable).toBe('boolean');
  }, 10000);

  test('should return false for non-existent package manager', async () => {
    const isAvailable = await isPackageManagerAvailable('non-existent-pm');
    expect(isAvailable).toBe(false);
  });

  test('should detect available package managers', async () => {
    const available = await detectAvailablePackageManagers();
    expect(Array.isArray(available)).toBe(true);
    expect(available.length).toBeGreaterThan(0);
    expect(available).toContain('npm'); // npm should always be available in test environment
  }, 15000);

  test('should have valid package manager configurations', () => {
    Object.values(PACKAGE_MANAGERS).forEach(config => {
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('installCommand');
      expect(config).toHaveProperty('lockFile');
      expect(config).toHaveProperty('checkCommand');
      expect(Array.isArray(config.installCommand)).toBe(true);
      expect(Array.isArray(config.checkCommand)).toBe(true);
    });
  });
});

describe('getPreferredPackageManager', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'pm-test-'));
  });

  afterEach(async () => {
    if (tempDir && await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
  });

  test('should prefer package manager based on lockfile', () => {
    const available = ['npm', 'yarn', 'pnpm'];
    
    // Test with no lockfile - should return first available in priority order
    const preferred = getPreferredPackageManager(tempDir, available);
    expect(available).toContain(preferred);
  });

  test('should detect yarn from yarn.lock', async () => {
    await fs.writeFile(path.join(tempDir, 'yarn.lock'), '');
    const available = ['npm', 'yarn'];
    
    const preferred = getPreferredPackageManager(tempDir, available);
    expect(preferred).toBe('yarn');
  });

  test('should detect pnpm from pnpm-lock.yaml', async () => {
    await fs.writeFile(path.join(tempDir, 'pnpm-lock.yaml'), '');
    const available = ['npm', 'pnpm'];
    
    const preferred = getPreferredPackageManager(tempDir, available);
    expect(preferred).toBe('pnpm');
  });

  test('should return first available if no lockfile found', () => {
    const available = ['yarn', 'npm'];
    const preferred = getPreferredPackageManager(tempDir, available);
    expect(preferred).toBe('yarn'); // First in the list
  });

  test('should fallback to npm if empty available list', () => {
    const available = [];
    const preferred = getPreferredPackageManager(tempDir, available);
    expect(preferred).toBe('npm');
  });
});