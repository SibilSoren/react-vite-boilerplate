const { validateProjectName, validateTargetDirectory, RESERVED_NAMES } = require('../lib/validators');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('validateProjectName', () => {
  test('should accept valid project names', () => {
    const validNames = [
      'my-project',
      'myproject',
      'my_project',
      'project123',
      'a',
      'project-with-long-name',
      'project.name'
    ];

    validNames.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  test('should reject invalid project names', () => {
    const invalidNames = [
      '',           // empty
      '   ',        // whitespace only
      '.project',   // starts with dot
      '_project',   // starts with underscore
      'project!',   // invalid character
      'project(',   // invalid character
      'project)',   // invalid character
      'project*',   // invalid character
      'project~',   // invalid character
      'project\'',  // invalid character
      'project with spaces' // spaces
    ];

    invalidNames.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  test('should reject reserved names', () => {
    RESERVED_NAMES.forEach(name => {
      const result = validateProjectName(name);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('reserved name');
    });
  });

  test('should reject names that are too long', () => {
    const longName = 'a'.repeat(215);
    const result = validateProjectName(longName);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('less than 214 characters');
  });

  test('should validate scoped package names', () => {
    const validScoped = '@scope/package-name';
    const result = validateProjectName(validScoped);
    expect(result.valid).toBe(true);

    const invalidScoped = '@/invalid';
    const result2 = validateProjectName(invalidScoped);
    expect(result2.valid).toBe(false);
  });
});

describe('validateTargetDirectory', () => {
  let tempDir;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scaffold-test-'));
  });

  afterEach(async () => {
    if (tempDir && await fs.pathExists(tempDir)) {
      await fs.remove(tempDir);
    }
  });

  test('should accept valid target directories', () => {
    const targetPath = path.join(tempDir, 'new-project');
    const result = validateTargetDirectory(targetPath);
    expect(result.valid).toBe(true);
  });

  test('should warn about non-empty directories', async () => {
    const targetPath = path.join(tempDir, 'existing-project');
    await fs.ensureDir(targetPath);
    await fs.writeFile(path.join(targetPath, 'test.txt'), 'test');

    const result = validateTargetDirectory(targetPath);
    expect(result.valid).toBe(true);
    expect(result.warnings).toEqual(expect.arrayContaining([expect.stringContaining('not empty')]));
  });

  test('should reject system directories', () => {
    const systemPaths = ['/', '/usr', '/etc', '/var'];
    
    systemPaths.forEach(systemPath => {
      if (fs.existsSync(systemPath)) {
        const result = validateTargetDirectory(systemPath);
        expect(result.valid).toBe(false);
        expect(result.error).toContain('system directory');
      }
    });
  });
});