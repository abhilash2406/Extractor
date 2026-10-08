import disposableDomainsList from 'disposable-email-domains' with { type: 'json' };

// Convert array to Set for fast O(1) lookup
const disposableDomainsSet = new Set(
  disposableDomainsList.map((d) => d.toLowerCase().trim())
);

// Additional manual fallback list of popular throwaway domains
const extraDisposableDomains = [
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'yopmail.com',
  'trashmail.com',
  'sharklasers.com',
  'dispostable.com',
  'getnada.com',
  'throwawaymail.com',
  'temp-mail.org',
  'mytemp.email',
  'fakemailgenerator.com',
  'mohmal.com',
  'crazymailing.com',
];

extraDisposableDomains.forEach((domain) => disposableDomainsSet.add(domain));

/**
 * Checks if an email address belongs to a disposable or temporary email provider.
 * @param {string} email - The email address to check.
 * @returns {boolean} True if the email domain is disposable, false otherwise.
 */
export const isDisposableEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const domain = parts[1].toLowerCase().trim();
  if (!domain) return false;

  // Direct domain match
  if (disposableDomainsSet.has(domain)) {
    return true;
  }

  // Subdomain check (e.g., test.mailinator.com -> mailinator.com)
  const domainParts = domain.split('.');
  while (domainParts.length > 2) {
    domainParts.shift();
    const parentDomain = domainParts.join('.');
    if (disposableDomainsSet.has(parentDomain)) {
      return true;
    }
  }

  return false;
};

export default isDisposableEmail;
