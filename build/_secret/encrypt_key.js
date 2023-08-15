import crypto from 'crypto';
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});
const message = "AIzaSyD-yq_b0lBHV2GkBczqinFV63A2gwzg1Fc";
console.log('Original Message:\n', message);
const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));
console.log('Encrypted Message:\n', encryptedMessage.toString('base64'));
console.log(privateKey);
const decryptedMessage = crypto.privateDecrypt(privateKey, encryptedMessage);
console.log('Decrypted Message:\n', decryptedMessage.toString());
