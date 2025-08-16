const { 
  BoilerplateError, 
  ERROR_TYPES, 
  RollbackManager, 
  formatErrorMessage 
} = require('../lib/error-handler');

describe('BoilerplateError', () => {
  test('should create error with type and context', () => {
    const error = new BoilerplateError(
      'Test error',
      ERROR_TYPES.VALIDATION,
      { field: 'projectName' }
    );

    expect(error.message).toBe('Test error');
    expect(error.type).toBe(ERROR_TYPES.VALIDATION);
    expect(error.context).toEqual({ field: 'projectName' });
    expect(error.name).toBe('BoilerplateError');
    expect(error.timestamp).toBeDefined();
  });

  test('should default to UNKNOWN type', () => {
    const error = new BoilerplateError('Test error');
    expect(error.type).toBe(ERROR_TYPES.UNKNOWN);
  });
});

describe('RollbackManager', () => {
  test('should execute rollback actions in reverse order', async () => {
    const rollback = new RollbackManager();
    const executionOrder = [];

    rollback.addAction(
      async () => { executionOrder.push('action1'); },
      'Action 1'
    );
    rollback.addAction(
      async () => { executionOrder.push('action2'); },
      'Action 2'
    );

    await rollback.execute();

    expect(executionOrder).toEqual(['action2', 'action1']);
  });

  test('should not execute if marked as completed', async () => {
    const rollback = new RollbackManager();
    let executed = false;

    rollback.addAction(
      async () => { executed = true; },
      'Test action'
    );

    rollback.markCompleted();
    await rollback.execute();

    expect(executed).toBe(false);
  });

  test('should handle errors in rollback actions gracefully', async () => {
    const rollback = new RollbackManager();
    const executionOrder = [];

    rollback.addAction(
      async () => { executionOrder.push('action1'); },
      'Action 1'
    );
    rollback.addAction(
      async () => { throw new Error('Rollback failed'); },
      'Failing action'
    );
    rollback.addAction(
      async () => { executionOrder.push('action3'); },
      'Action 3'
    );

    // Should not throw even if one action fails
    await expect(rollback.execute()).resolves.toBeUndefined();
    expect(executionOrder).toEqual(['action3', 'action1']);
  });

  test('should only execute once', async () => {
    const rollback = new RollbackManager();
    let executions = 0;

    rollback.addAction(
      async () => { executions++; },
      'Test action'
    );

    await rollback.execute();
    await rollback.execute(); // Second call should not execute

    expect(executions).toBe(1);
  });
});

describe('formatErrorMessage', () => {
  test('should format basic error message', () => {
    const error = new Error('Basic error');
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('✗ Error: Basic error');
    expect(formatted).toContain('For more help, visit:');
  });

  test('should include suggestions for network errors', () => {
    const error = new BoilerplateError(
      'Network connection failed',
      ERROR_TYPES.NETWORK
    );
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('Check your internet connection');
    expect(formatted).toContain('Try using a different network');
  });

  test('should include suggestions for package manager errors', () => {
    const error = new BoilerplateError(
      'Package installation failed',
      ERROR_TYPES.PACKAGE_MANAGER,
      { manager: 'npm' }
    );
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('Try using a different package manager');
    expect(formatted).toContain('npm cache clean --force');
  });

  test('should include suggestions for validation errors', () => {
    const error = new BoilerplateError(
      'Invalid project name',
      ERROR_TYPES.VALIDATION
    );
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('Use only letters, numbers, hyphens');
    expect(formatted).toContain('Start with a letter or number');
  });

  test('should include suggestions for filesystem errors', () => {
    const error = new BoilerplateError(
      'Permission denied',
      ERROR_TYPES.FILESYSTEM
    );
    const formatted = formatErrorMessage(error);
    
    expect(formatted).toContain('Check file permissions');
    expect(formatted).toContain('write access to the directory');
  });
});