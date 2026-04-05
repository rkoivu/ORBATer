(function(){
  // ORBAT Discrepancy Checker
  // Checks for common issues in the ORBAT structure

  function checkOrbatDiscrepancies() {
    const issues = [];
    const echelonHierarchy = {
      'theater': 0,
      'army': 1,
      'corps': 2,
      'division': 3,
      'brigade': 4,
      'battalion': 5,
      'regiment': 5,
      'company': 6,
      'platoon': 7,
      'squad': 8,
      'section': 9,
      'team': 10
    };

    // Helper to get valid typeIds
    const validTypeIds = new Set([...UT.map(u => u.id), ...customTypes.map(u => u.id)]);

    Object.values(nodes).forEach(node => {
      const nodeId = node.id || 'unknown';

      // 1. Check for invalid typeId
      if (!validTypeIds.has(node.typeId)) {
        issues.push(`Invalid unit type: "${node.typeId}" for node "${node.name || nodeId}"`);
      }

      // 2. Check for missing required fields
      if (!node.name || node.name.trim() === '') {
        issues.push(`Missing name for node "${nodeId}"`);
      }

      // 3. Check parent-child relationships
      if (node.parentId) {
        if (!nodes[node.parentId]) {
          issues.push(`Orphaned node: "${node.name || nodeId}" references non-existent parent "${node.parentId}"`);
        } else {
          // 4. Check echelon hierarchy
          const nodeLevel = echelonHierarchy[node.echelon];
          const parentLevel = echelonHierarchy[nodes[node.parentId].echelon];
          if (nodeLevel !== undefined && parentLevel !== undefined && nodeLevel >= parentLevel) {
            issues.push(`Echelon hierarchy violation: "${node.echelon}" (${node.name || nodeId}) cannot be at same or higher level than parent "${nodes[node.parentId].echelon}" (${nodes[node.parentId].name || node.parentId})`);
          }
        }
      }

      // 5. Check for duplicate designations in same parent
      if (node.designation && node.parentId) {
        const siblings = Object.values(nodes).filter(n => n.parentId === node.parentId && n.id !== node.id);
        const duplicate = siblings.find(n => n.designation === node.designation);
        if (duplicate) {
          issues.push(`Duplicate designation: "${node.designation}" used by "${node.name || nodeId}" and "${duplicate.name || duplicate.id}" under same parent`);
        }
      }

      // 6. Check equipment consistency (basic check)
      if (node.equipmentItems && Array.isArray(node.equipmentItems)) {
        // Could add more sophisticated checks based on unit type
        const emptyItems = node.equipmentItems.filter(item => !item || item.trim() === '');
        if (emptyItems.length > 0) {
          issues.push(`Empty equipment items in "${node.name || nodeId}"`);
        }
      }

      // 7. Check affiliation validity
      const validAffils = ['friendly', 'hostile', 'neutral', 'unknown'];
      if (node.affil && !validAffils.includes(node.affil)) {
        issues.push(`Invalid affiliation: "${node.affil}" for node "${node.name || nodeId}"`);
      }

      // 8. Check relationship type validity
      const validRelTypes = ['organic', 'attached', 'support', 'reinforced'];
      if (node.reltype && !validRelTypes.includes(node.reltype)) {
        issues.push(`Invalid relationship type: "${node.reltype}" for node "${node.name || nodeId}"`);
      }
    });

    // 9. Check for circular references (basic detection)
    const visited = new Set();
    const recursionStack = new Set();

    function hasCycle(nodeId) {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const node = nodes[nodeId];
      if (node && node.parentId) {
        if (hasCycle(node.parentId)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    }

    Object.keys(nodes).forEach(nodeId => {
      if (!visited.has(nodeId) && hasCycle(nodeId)) {
        issues.push(`Circular reference detected involving node "${nodes[nodeId].name || nodeId}"`);
      }
    });

    return issues;
  }

  // Expose the function globally
  window.checkOrbatDiscrepancies = checkOrbatDiscrepancies;

  // Optional: Add to UI if there's a menu or toolbar
  // For now, can be called from console: checkOrbatDiscrepancies()
})();