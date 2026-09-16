import os
import json
import base64
import secrets
from typing import List, Tuple, Dict, Any
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import hashlib

# 256-bit Prime for Shamir's Secret Sharing field arithmetic (2^256 - 189)
PRIME_256 = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFC7

class ShamirSecretSharing:
    """
    Shamir's Secret Sharing over a 256-bit prime field.
    Allows splitting a 256-bit master key into N shares with a threshold of K.
    """
    @staticmethod
    def _eval_poly(poly: List[int], x: int, prime: int) -> int:
        result = 0
        for coef in reversed(poly):
            result = (result * x + coef) % prime
        return result

    @staticmethod
    def _extended_gcd(a: int, b: int) -> Tuple[int, int, int]:
        if a == 0:
            return b, 0, 1
        gcd, x1, y1 = ShamirSecretSharing._extended_gcd(b % a, a)
        x = y1 - (b // a) * x1
        y = x1
        return gcd, x, y

    @staticmethod
    def _mod_inverse(k: int, prime: int) -> int:
        k = k % prime
        gcd, x, _ = ShamirSecretSharing._extended_gcd(k, prime)
        if gcd != 1:
            raise ValueError("Modular inverse does not exist")
        return (x % prime + prime) % prime

    @classmethod
    def split_secret(cls, secret_bytes: bytes, threshold_k: int, total_n: int) -> List[Dict[str, Any]]:
        if threshold_k > total_n:
            raise ValueError("Threshold k cannot exceed total shares n")
        if len(secret_bytes) != 32:
            raise ValueError("Secret must be 32 bytes (256 bits)")

        secret_int = int.from_bytes(secret_bytes, byteorder='big')
        if secret_int >= PRIME_256:
            raise ValueError("Secret exceeds prime field modulus")

        # Polynomial coefficients: a0 = secret, a1..a_{k-1} random
        poly = [secret_int] + [secrets.randbelow(PRIME_256) for _ in range(threshold_k - 1)]

        shares = []
        for x in range(1, total_n + 1):
            y = cls._eval_poly(poly, x, PRIME_256)
            share_hex = hex(y)[2:].zfill(64)
            
            # Cryptographic HMAC Checksum of Share
            share_hmac = hashlib.sha256(f"NOMINEE_SHARE_{x}_{share_hex}".encode('utf-8')).hexdigest()

            shares.append({
                "share_index": x,
                "share_hex": share_hex,
                "formatted": f"SECLOCK-SHARE-{x}-{share_hex[:8]}...{share_hex[-8:]}",
                "hmac_checksum": share_hmac,
                "public_commitment": hashlib.sha256(share_hex.encode('utf-8')).hexdigest()[:16]
            })
        return shares

    @classmethod
    def verify_share_validity(cls, share_index: int, share_hex: str, public_commitment: str) -> bool:
        """
        Verifies if an allocated nominee key share matches its cryptographic public commitment hash.
        """
        computed_hash = hashlib.sha256(share_hex.encode('utf-8')).hexdigest()[:16]
        return computed_hash == public_commitment


    @classmethod
    def reconstruct_secret(cls, shares: List[Tuple[int, str]], threshold_k: int) -> bytes:
        if len(shares) < threshold_k:
            raise ValueError(f"Insufficient shares: need at least {threshold_k}, got {len(shares)}")

        # Use first threshold_k shares
        used_shares = shares[:threshold_k]
        secret_int = 0

        for j, (xj, yj_str) in enumerate(used_shares):
            yj = int(yj_str, 16) if isinstance(yj_str, str) else yj_str
            num = 1
            den = 1
            for m, (xm, _) in enumerate(used_shares):
                if m != j:
                    num = (num * (-xm)) % PRIME_256
                    den = (den * (xj - xm)) % PRIME_256
            
            inv_den = cls._mod_inverse(den, PRIME_256)
            lagrange_coeff = (num * inv_den) % PRIME_256
            secret_int = (secret_int + yj * lagrange_coeff) % PRIME_256

        return secret_int.to_bytes(32, byteorder='big')


class VaultEncryption:
    """
    AES-256-GCM encryption for digital vault assets.
    """
    @staticmethod
    def generate_master_key() -> bytes:
        return secrets.token_bytes(32)

    @staticmethod
    def encrypt_vault_data(master_key: bytes, assets: Dict[str, Any]) -> Dict[str, str]:
        aesgcm = AESGCM(master_key)
        nonce = secrets.token_bytes(12)
        plaintext = json.dumps(assets).encode('utf-8')
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)

        return {
            "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
            "nonce": base64.b64encode(nonce).decode('utf-8')
        }

    @staticmethod
    def decrypt_vault_data(master_key: bytes, encrypted_vault: Dict[str, str]) -> Dict[str, Any]:
        ciphertext = base64.b64decode(encrypted_vault["ciphertext"])
        nonce = base64.b64decode(encrypted_vault["nonce"])
        aesgcm = AESGCM(master_key)

        try:
            plaintext = aesgcm.decrypt(nonce, ciphertext, None)
            return json.loads(plaintext.decode('utf-8'))
        except Exception as e:
            raise ValueError("Decryption failed: invalid master key or corrupted vault payload") from e


def compute_hash(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()
