const { spawn } = require('cross-spawn');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

describe('CLI Integration Tests', () => {
  let testDir;
  let cliPath;

  beforeAll(() => {
    cliPath = path.join(__dirname, '..', 'bin', 'cli.js');
    expect(fs.existsSync(cliPath)).toBe(true);
  });

  beforeEach(async () => {
    testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'cli-integration-test-'));
  });

  afterEach(async () => {
    if (testDir && await fs.pathExists(testDir)) {
      await fs.remove(testDir);
    }
  });

  test('should show help when --help flag is used', (done) => {
    const child = spawn('node', [cliPath, '--help'], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.log('Help test - stdout:', stdout);
        console.log('Help test - stderr:', stderr);
      }
      expect(code).toBe(0);
      expect(stdout).toContain('Create a React + Vite project');
      expect(stdout).toContain('--pm');
      expect(stdout).toContain('--skip-install');
      expect(stdout).toContain('--verbose');
      done();
    });
    
    child.on('error', (error) => {
      done(error);
    });
  }, 10000);

  test('should show version when --version flag is used', (done) => {
    const child = spawn('node', [cliPath, '--version'], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.on('close', (code) => {
      expect(code).toBe(0);
      expect(stdout).toContain('1.0.0');
      done();
    });
  }, 10000);

  test('should perform dry run without creating files', (done) => {
    const projectName = 'test-project';
    const child = spawn('node', [cliPath, projectName, '--dry-run'], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.on('close', (code) => {
      expect(code).toBe(0);
      expect(stdout).toContain('Dry run mode');
      expect(stdout).toContain(projectName);
      
      // Verify no project directory was created
      const projectPath = path.join(testDir, projectName);
      expect(fs.existsSync(projectPath)).toBe(false);
      done();
    });
  }, 10000);

  test('should reject invalid project names', (done) => {
    const invalidName = 'invalid!name';
    const child = spawn('node', [cliPath, invalidName], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      expect(code).toBe(1);
      // Error could be in either stdout or stderr
      const output = stdout + stderr;
      expect(output).toContain('invalid characters');
      done();
    });
    
    child.on('error', (error) => {
      done(error);
    });
  }, 10000);

  test('should create project structure with --skip-install', (done) => {
    const projectName = 'test-project-skip-install';
    const child = spawn('node', [cliPath, projectName, '--skip-install', '--skip-git'], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', async (code) => {
      try {
        if (code !== 0) {
          console.log('Create project test failed - stdout:', stdout);
          console.log('Create project test failed - stderr:', stderr);
        }
        expect(code).toBe(0);
        
        const projectPath = path.join(testDir, projectName);
        expect(fs.existsSync(projectPath)).toBe(true);
        
        // Check for key files
        const keyFiles = [
          'package.json',
          'vite.config.ts',
          'tsconfig.json',
          'tailwind.config.js',
          'src/main.tsx',
          'src/routes/__root.tsx',
          'src/routes/index.tsx',
          '.env.example',
          '.gitignore'
        ];
        
        for (const file of keyFiles) {
          const filePath = path.join(projectPath, file);
          expect(fs.existsSync(filePath)).toBe(true);
        }
        
        // Check package.json has correct name
        const packageJson = await fs.readJson(path.join(projectPath, 'package.json'));
        expect(packageJson.name).toBe(projectName);
        
        // Verify node_modules was not created (since we skipped install)
        expect(fs.existsSync(path.join(projectPath, 'node_modules'))).toBe(false);
        
        done();
      } catch (error) {
        console.log('Test error:', error);
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
        done(error);
      }
    });
    
    child.on('error', (error) => {
      done(error);
    });
  }, 30000);

  test('should handle existing directory with confirmation', (done) => {
    const projectName = 'existing-project';
    const projectPath = path.join(testDir, projectName);
    
    // Create existing directory
    fs.ensureDirSync(projectPath);
    fs.writeFileSync(path.join(projectPath, 'existing-file.txt'), 'test');
    
    const child = spawn('node', [cliPath, projectName, '--yes', '--skip-install', '--skip-git'], { 
      stdio: 'pipe',
      cwd: testDir 
    });

    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        console.log('Existing directory test failed - stdout:', stdout);
        console.log('Existing directory test failed - stderr:', stderr);
      }
      expect(code).toBe(0);
      
      // Verify the existing file was removed and project was created
      expect(fs.existsSync(projectPath)).toBe(true);
      expect(fs.existsSync(path.join(projectPath, 'existing-file.txt'))).toBe(false);
      expect(fs.existsSync(path.join(projectPath, 'package.json'))).toBe(true);
      
      done();
    });
    
    child.on('error', (error) => {
      done(error);
    });
  }, 30000);
});