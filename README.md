# Address Antidote

## Functionality
This extension validates Ethereum and Solana cryptocurrency addresses when they are copied by the user. Despite requiring broad host permissions, the extension's actual operation is highly targeted:

1. It only activates when a user copies text from a webpage.
2. It processes the copied text exclusively through specific filters that identify Ethereum (0x...) and Solana (base58, 32-44 characters) address formats.
3. Validation is performed only if the copied text matches these specific cryptocurrency address patterns.
4. No other page content is ever processed or stored.

## Permissions
The extension requires "<all_urls>" permission to function across all websites, ensuring user protection regardless of the site they're on. However, its interaction with page content is minimal and strictly limited to its core security function of validating cryptocurrency addresses.

## Security
The extension is designed with security in mind:

1. It does not access or store any data from pages other than the text being copied.
2. It does not track user behavior or data.
3. It does not modify any page content or behavior.
4. It does not send any user data to external servers.