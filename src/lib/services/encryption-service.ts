const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY as string;

export async function encryptDataWithAES<T>(data: T): Promise<string> {
    if (!secretKey || secretKey === "") throw new Error("La clé ne doit pas être vide");
    const key = await deriveKey(secretKey);
    const encodedData = new TextEncoder().encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const cipherText = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encodedData
    );
    return `${Buffer.from(iv).toString('base64')}:${Buffer.from(cipherText).toString('base64')}`;
}

export async function decryptDataWithAES<T>(encryptedData: string): Promise<T | null> {
    try {
        const [ivBase64, cipherTextBase64] = encryptedData.split(':');
        const iv = Buffer.from(ivBase64, 'base64');
        const cipherText = Buffer.from(cipherTextBase64, 'base64');
        const key = await deriveKey(secretKey);
        const decryptedData = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv },
            key,
            cipherText
        );
        return JSON.parse(new TextDecoder().decode(decryptedData)) as T;
    } catch (err) {
        console.error(err);
        throw new Error("Decryption failed");
    }
}

async function deriveKey(password: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new Uint8Array(16),
            iterations: 100000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
}