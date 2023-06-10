import { capitalCase } from 'change-case';

/**
 * Format actor resources for display on the sheet
 * @param {string} resourceName name of the resource to be formatted
 * @param {GameSystemProperties} system object on the actor for the system
 * @returns Maybe<FormattedResource>
 */
export function formatResourceForSheet(resourceName, system) {
  const fetched = system[resourceName];

  return {
    className: `${resourceName}-resource resource-container resource flex-group-center`,
    value: fetched?.value !== undefined ? fetched.value : fetched,
    max: fetched?.max ?? undefined,
    label: capitalCase(resourceName),
    valuePath: `system.${resourceName}${fetched?.value !== undefined ? '.value' : ''}`,
    maxPath: `system.${resourceName}.max`,
    type: resourceName === 'Mulligan' ? "Text" : "Number"
  }
}
