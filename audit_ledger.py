import time
import json
import hashlib
from datetime import datetime
from typing import List, Dict, Any, Optional

class AuditBlock:
    def __init__(self, index: int, timestamp: str, event_type: str, details: Dict[str, Any], prev_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.event_type = event_type
        self.details = details
        self.prev_hash = prev_hash
        self.block_hash = self.calculate_hash()

    def calculate_hash(self) -> str:
        payload = f"{self.index}|{self.timestamp}|{self.event_type}|{json.dumps(self.details, sort_keys=True)}|{self.prev_hash}"
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "event_type": self.event_type,
            "details": self.details,
            "prev_hash": self.prev_hash,
            "block_hash": self.block_hash
        }


class TamperEvidentLedger:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        self._create_genesis_block()

    def _create_genesis_block(self):
        genesis = AuditBlock(
            index=0,
            timestamp=datetime.now().isoformat(),
            event_type="GENESIS_VAULT_INITIALIZED",
            details={
                "system": "Seclock Legally-Aware Vault v1.0",
                "law_compliance": "Indian Succession Act & Information Technology Act 2000",
                "status": "SECURE"
            },
            prev_hash="0" * 64
        )
        self.chain.append(genesis)

    def append_event(self, event_type: str, details: Dict[str, Any]) -> AuditBlock:
        prev_block = self.chain[-1]
        new_block = AuditBlock(
            index=len(self.chain),
            timestamp=datetime.now().isoformat(),
            event_type=event_type,
            details=details,
            prev_hash=prev_block.block_hash
        )
        self.chain.append(new_block)
        return new_block

    def verify_integrity(self) -> Dict[str, Any]:
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]

            # 1. Recalculate hash of current block
            if current.block_hash != current.calculate_hash():
                return {
                    "is_valid": False,
                    "total_blocks": len(self.chain),
                    "tampered_block_index": current.index,
                    "reason": f"Hash mismatch at block #{current.index}. Stored payload has been tampered with."
                }

            # 2. Check previous hash linkage
            if current.prev_hash != previous.block_hash:
                return {
                    "is_valid": False,
                    "total_blocks": len(self.chain),
                    "tampered_block_index": current.index,
                    "reason": f"Chain linkage broken at block #{current.index}. Previous hash does not match block #{previous.index}."
                }

        return {
            "is_valid": True,
            "total_blocks": len(self.chain),
            "merkle_root": self.chain[-1].block_hash,
            "tampered_block_index": None,
            "reason": "All block hashes and cryptographic chain links verified intact."
        }

    def simulate_tamper(self, block_index: int) -> bool:
        if 0 <= block_index < len(self.chain):
            self.chain[block_index].details["FORGED_FLAG"] = "UNAUTHORIZED_MODIFICATION"
            return True
        return False

    def export_compliance_report(self, owner_name: str) -> Dict[str, Any]:
        verification = self.verify_integrity()
        return {
            "title": "SECLOCK LEGAL AUDIT & PROBATE COMPLIANCE REPORT",
            "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
            "account_owner": owner_name,
            "chain_status": "CRYPTOGRAPHICALLY VERIFIED" if verification["is_valid"] else "TAMPERED - INVALID",
            "total_audit_events": len(self.chain),
            "latest_merkle_hash": self.chain[-1].block_hash,
            "audit_trail": [b.to_dict() for b in self.chain]
        }
