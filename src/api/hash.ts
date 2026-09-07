export async function hashPassword(password: string, salt?: Uint8Array): Promise<{ hash: string, salt: string }> {
    const encoder = new TextEncoder();

    // 1. If no salt is provided (Registration), create a new random 16-byte salt
    // If salt is provided (Login), we use the one from the database
    const userSalt = salt || crypto.getRandomValues(new Uint8Array(16));

    // For password key import
    const passwordBytes = encoder.encode(password);
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes.buffer as ArrayBuffer, // Accessing the underlying buffer is standard practice
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );

    // For salt derivation
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: userSalt.buffer as ArrayBuffer, // This is the 'purest' way to pass the data
            iterations: 100000,
            hash: "SHA-256",
        },
        passwordKey,
        256
    );

    // 4. Convert to Hex strings for easy storage in SQLite
    const hashHex = Array.from(new Uint8Array(derivedBits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const saltHex = Array.from(userSalt)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return { hash: hashHex, salt: saltHex };
}

export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  
  // 1. Convert the stored Hex salt back into a Uint8Array
  // This is crucial because Web Crypto needs raw bytes, not a string
  const saltBytes = new Uint8Array(
    storedSalt.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
  );

  // 2. Import the raw password as a key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // 3. Derive the hash using the SAME parameters as your registration
  const derivedBytes = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000, // Must match your registration iterations
      hash: 'SHA-256',
    },
    baseKey,
    256
  );

  // 4. Convert the derived bytes to a Hex string to compare with the DB
  const derivedHash = Array.from(new Uint8Array(derivedBytes))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // 5. Compare the new hash with the one from the database
  return derivedHash === storedHash;
}