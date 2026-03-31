import { describe, it, expect } from 'vitest';
import { defineConfig } from 'vite';
import * as fc from 'fast-check';
import { createServer } from 'vite';
import { readFileSync } from 'fs';

/**
 * Bug Condition Exploration Test for External Network Access
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 * 
 * CRITICAL: This test MUST FAIL on unfixed code - failure confirms the bug exists
 * 
 * This test verifies that the Vite server configuration allows external network access.
 * On UNFIXED code (missing host: '0.0.0.0' config), this test will FAIL, which is EXPECTED
 * and confirms the bug exists.
 * 
 * The test checks:
 * 1. Server configuration includes host binding to all interfaces (0.0.0.0)
 * 2. Server is not restricted to localhost only (127.0.0.1)
 * 
 * Expected behavior after fix:
 * - Server should bind to 0.0.0.0 (all network interfaces)
 * - External network connections should be accepted
 * - Application should be accessible from mobile data, remote WiFi, etc.
 */

describe('Bug Condition: External Network Access', () => {
  /**
   * Property 1: Bug Condition - External Network Access Fails on Unfixed Configuration
   * 
   * This property-based test verifies that the server configuration allows
   * external network access by checking the host binding configuration.
   * 
   * On unfixed code: This test will FAIL because host is not configured
   * After fix: This test will PASS because host is set to '0.0.0.0'
   */
  it('should bind server to all network interfaces (0.0.0.0) for external access', async () => {
    // Load the actual vite.config.js file
    const configModule = await import('./vite.config.js');
    const config = configModule.default;
    
    // Check if server configuration exists and has correct host binding
    expect(config.server, 
      'Server configuration must exist in vite.config.js to enable external network access'
    ).toBeDefined();
    
    expect(config.server?.host, 
      'Server host must be set to "0.0.0.0" to bind to all network interfaces and allow external access. ' +
      'Current configuration only allows localhost (127.0.0.1) access, blocking external networks.'
    ).toBe('0.0.0.0');
  });

  /**
   * Property-Based Test: Server Configuration Accepts External Network Scenarios
   * 
   * This test generates various network access scenarios and verifies that
   * the server configuration would allow external access.
   * 
   * Test strategy:
   * - Generate different network source types (local, mobile, remote WiFi)
   * - Verify that the configuration supports access from all sources
   * - Confirm that the host binding is not restricted to localhost
   */
  it('property: server configuration allows access from any network source', async () => {
    const configModule = await import('./vite.config.js');
    const config = configModule.default;
    
    // Define network source types that should be able to access the server
    const networkSourceArbitrary = fc.constantFrom(
      'local-network',
      'mobile-data',
      'remote-wifi',
      'external-network',
      'vpn-connection'
    );
    
    await fc.assert(
      fc.asyncProperty(networkSourceArbitrary, async (networkSource) => {
        // For ANY network source, the server configuration should allow access
        // This is only possible if host is set to '0.0.0.0'
        
        const hasServerConfig = config.server !== undefined;
        const hostBinding = config.server?.host;
        
        // The server must be configured to accept connections from all interfaces
        // If host is undefined or '127.0.0.1', external access will fail
        const allowsExternalAccess = hostBinding === '0.0.0.0';
        
        // ASSERTION: For any network source, external access should be allowed
        // This will FAIL on unfixed code (no host config or localhost only)
        // This will PASS after fix (host set to '0.0.0.0')
        expect(allowsExternalAccess,
          `Server must allow access from ${networkSource}. ` +
          `Current host binding: ${hostBinding || 'undefined (defaults to 127.0.0.1)'}`
        ).toBe(true);
      }),
      { numRuns: 50 } // Test with 50 different network scenarios
    );
  });

  /**
   * Verification Test: Server Configuration Structure
   * 
   * This test verifies that the server configuration has the correct structure
   * and includes the necessary properties for external network access.
   */
  it('should have valid server configuration structure', async () => {
    const configModule = await import('./vite.config.js');
    const config = configModule.default;
    
    // Verify server config exists
    expect(config.server).toBeDefined();
    
    // Verify host is configured (not undefined)
    expect(config.server?.host).toBeDefined();
    
    // Verify host is a string
    expect(typeof config.server?.host).toBe('string');
    
    // Verify host is not localhost/127.0.0.1 (which blocks external access)
    expect(config.server?.host).not.toBe('127.0.0.1');
    expect(config.server?.host).not.toBe('localhost');
    
    // Verify host is set to allow all interfaces
    expect(config.server?.host).toBe('0.0.0.0');
  });
});
