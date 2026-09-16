import os
import json
import hashlib
import secrets as py_secrets
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pydantic import BaseModel, Field

from crypto_engine import ShamirSecretSharing, VaultEncryption
from ocr_engine import LegalDocumentOCREngine
from audit_ledger import TamperEvidentLedger

app = FastAPI(
    title="Seclock — Legally-Aware Digital Inheritance & Emergency Access Vault",
    description="Backend API for KTU Final Year Project Proposal",
    version="1.0.0"
)

# Mount static assets
static_dir = os.path.join(os.path.dirname(__file__), "static")
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

sample_certs_dir = os.path.join(os.path.dirname(__file__), "sample_certificates")
os.makedirs(sample_certs_dir, exist_ok=True)
app.mount("/sample_certificates", StaticFiles(directory=sample_certs_dir), name="sample_certificates")



# Global In-Memory Vault State (Single User / Session Prototype)
class SystemState:
    def __init__(self):
        self.ledger = TamperEvidentLedger()
        self.is_vault_setup = True  # Auto-setup with default demo profile for seamless UI testing
        self.owner_info = {
            "name": "K. V. Ramachandran Nair",
            "phone": "+91 98470 12345",
            "email": "ramachandran.kv@gmail.com",
            "preferred_channels": ["App", "SMS", "IVR"]
        }
        self.nominees = [
            {"name": "Priya Ramachandran", "phone": "+91 98471 99881", "relation": "Daughter"},
            {"name": "Anil Nair", "phone": "+91 94472 44332", "relation": "Son"},
            {"name": "Dr. Radhika Nair", "phone": "+91 98950 11223", "relation": "Sister"},
            {"name": "Adv. Suresh Kumar", "phone": "+91 98460 77889", "relation": "Legal Counsel"},
            {"name": "Vijayalakshmi Amma", "phone": "+91 94461 55667", "relation": "Spouse"}
        ]
        self.threshold_k = 3
        self.total_n = 5
        self.check_in_interval_days = 30
        self.last_check_in_time = datetime.now()
        self.liveness_status = "ACTIVE"  # ACTIVE, WARNING, EXPIRED
        self.master_key_shares = []
        self.encrypted_vault = {}
        self.raw_assets = {
            "tier1_financial": [{"type": "Bank", "name": "State Bank of India", "acc": "30489102934", "balance": "INR 6,50,000"}],
            "tier2_credentials": [{"type": "Email", "provider": "Gmail", "user": "ramachandran.kv@gmail.com"}],
            "tier3_memory_vault": [{"type": "Notes", "content": "Family land details"}]
        }
        
        # Pre-generate cryptographic keys for demo state
        mk = VaultEncryption.generate_master_key()
        self.encrypted_vault = VaultEncryption.encrypt_vault_data(mk, self.raw_assets)
        self.master_key_shares = ShamirSecretSharing.split_secret(mk, 3, 5)
        for i, nom in enumerate(self.nominees):
            nom["assigned_share_index"] = self.master_key_shares[i]["share_index"]
            nom["assigned_share_hex"] = self.master_key_shares[i]["share_hex"]
            nom["formatted_share"] = self.master_key_shares[i]["formatted"]
            nom["public_commitment"] = self.master_key_shares[i]["public_commitment"]
            nom["hmac_checksum"] = self.master_key_shares[i]["hmac_checksum"]

        # Owner vault access passphrase (hashed with bcrypt-like SHA-256 + salt)
        self.owner_salt = py_secrets.token_hex(16)
        self.owner_passphrase_hash = hashlib.sha256(
            ("SECLOCK_OWNER_DEFAULT_PASS" + self.owner_salt).encode()
        ).hexdigest()
        self.owner_verified_sessions = []  # List of active session tokens

        self.legal_doc_status = "NOT_SUBMITTED" # NOT_SUBMITTED, VERIFIED, FLAGGED, REJECTED
        self.legal_doc_metadata = {}
        self.submitted_nominee_shares = {}
        self.reconstructed_master_key = None
        self.unlocked_tiers = []
        self.anomalies = []
        self.veto_triggered = False

    def reset(self):
        self.is_vault_setup = False
        self.owner_info = {}
        self.nominees = []
        self.master_key_shares = []
        self.encrypted_vault = {}
        self.raw_assets = {}
        self.legal_doc_status = "NOT_SUBMITTED"
        self.legal_doc_metadata = {}
        self.submitted_nominee_shares = {}
        self.reconstructed_master_key = None
        self.unlocked_tiers = []
        self.anomalies = []
        self.veto_triggered = False
        self.owner_salt = ""
        self.owner_passphrase_hash = ""
        self.owner_verified_sessions = []


state = SystemState()

# Pydantic Schemas
class SetupVaultRequest(BaseModel):
    owner_name: str = Field(..., example="K. V. Ramachandran Nair")
    owner_phone: str = Field(..., example="+91 98470 12345")
    owner_email: str = Field(..., example="ramachandran.kv@gmail.com")
    preferred_channels: List[str] = Field(default=["App", "SMS", "IVR"])
    check_in_interval_days: int = Field(default=30)
    nominees: List[Dict[str, str]] = Field(...)
    tier1_assets: List[Dict[str, str]] = Field(...)
    tier2_assets: List[Dict[str, str]] = Field(...)
    tier3_assets: List[Dict[str, str]] = Field(...)

class CheckInRequest(BaseModel):
    channel: str = Field(..., example="App") # App, SMS, IVR
    response_code: Optional[str] = None

class OCRVerifyRequest(BaseModel):
    document_text: str

class SubmitShareRequest(BaseModel):
    nominee_name: str
    share_index: int
    share_hex: str

class VerifyOwnerRequest(BaseModel):
    passphrase: str

class VerifyNomineeRequest(BaseModel):
    nominee_name: str
    share_hex: str


@app.get("/", response_class=HTMLResponse)
async def get_index():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h1>Seclock API Running</h1><p>Static index.html not yet generated.</p>")


@app.get("/api/state")
async def get_system_state():
    now = datetime.now()
    days_since_checkin = (now - state.last_check_in_time).days
    
    # Auto degrade status for demo
    liveness = state.liveness_status
    if state.is_vault_setup and liveness == "ACTIVE" and days_since_checkin > state.check_in_interval_days:
        liveness = "WARNING"
        state.liveness_status = liveness

    return {
        "is_vault_setup": state.is_vault_setup,
        "owner_info": state.owner_info,
        "nominees": state.nominees,
        "threshold_k": state.threshold_k,
        "total_n": state.total_n,
        "liveness_status": liveness,
        "days_since_checkin": days_since_checkin,
        "check_in_interval_days": state.check_in_interval_days,
        "legal_doc_status": state.legal_doc_status,
        "legal_doc_metadata": state.legal_doc_metadata,
        "submitted_shares_count": len(state.submitted_nominee_shares),
        "unlocked_tiers": state.unlocked_tiers,
        "veto_triggered": state.veto_triggered,
        "anomalies": state.anomalies,
        "audit_blocks_count": len(state.ledger.chain)
    }


@app.get("/api/verify/owner-key")
async def get_owner_key_info():
    """Returns owner verification metadata (public info only — no private keys)."""
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not configured.")
    return {
        "owner_name": state.owner_info.get("name"),
        "phone": state.owner_info.get("phone"),
        "default_passphrase_hint": "SECLOCK_OWNER_DEFAULT_PASS (shown only in demo mode)",
        "passphrase_hash_preview": state.owner_passphrase_hash[:12] + "...",
        "salt_preview": state.owner_salt[:8] + "..."
    }


@app.post("/api/verify/owner")
async def verify_owner_identity(req: VerifyOwnerRequest):
    """Verifies the vault owner's identity using their secret passphrase."""
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not configured.")

    computed = hashlib.sha256((req.passphrase + state.owner_salt).encode()).hexdigest()
    if computed != state.owner_passphrase_hash:
        state.ledger.append_event("OWNER_VERIFICATION_FAILED", {
            "reason": "Invalid passphrase",
            "timestamp": datetime.now().isoformat()
        })
        raise HTTPException(status_code=401, detail="Identity verification failed: Invalid passphrase.")

    session_token = hashlib.sha256(
        (req.passphrase + datetime.now().isoformat() + py_secrets.token_hex(8)).encode()
    ).hexdigest()
    state.owner_verified_sessions.append(session_token)

    state.ledger.append_event("OWNER_IDENTITY_VERIFIED", {
        "owner": state.owner_info.get("name"),
        "method": "SHA-256 Passphrase Hash",
        "session_token_preview": session_token[:12] + "...",
        "timestamp": datetime.now().isoformat()
    })

    return {
        "status": "VERIFIED",
        "owner_name": state.owner_info.get("name"),
        "session_token": session_token,
        "access_level": "FULL_VAULT_OWNER",
        "key_info": {
            "encryption": "AES-256-GCM",
            "key_split": f"{state.threshold_k}-of-{state.total_n} Shamir Threshold",
            "your_role": "VAULT_OWNER (holds master passphrase)",
            "audit_log_access": True,
            "veto_power": True
        }
    }


@app.post("/api/verify/nominee")
async def verify_nominee_identity(req: VerifyNomineeRequest):
    """Verifies a nominee's identity using their allocated Shamir key share."""
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not configured.")

    # Normalize input
    name_input = req.nominee_name.strip().lower()
    matched_nominee = None
    for nom in state.nominees:
        if nom["name"].strip().lower() == name_input:
            matched_nominee = nom
            break

    if not matched_nominee:
        raise HTTPException(status_code=404, detail=f"No registered nominee found with name: '{req.nominee_name}'")

    # Cryptographic share verification against stored public commitment
    is_valid = ShamirSecretSharing.verify_share_validity(
        share_index=matched_nominee["assigned_share_index"],
        share_hex=req.share_hex.strip(),
        public_commitment=matched_nominee["public_commitment"]
    )

    if not is_valid:
        state.ledger.append_event("NOMINEE_VERIFICATION_FAILED", {
            "nominee_name": req.nominee_name,
            "reason": "Key share does not match stored public commitment",
            "timestamp": datetime.now().isoformat()
        })
        raise HTTPException(status_code=401, detail="Nominee key share is invalid or does not match your registered share.")

    state.ledger.append_event("NOMINEE_IDENTITY_VERIFIED", {
        "nominee_name": matched_nominee["name"],
        "share_index": matched_nominee["assigned_share_index"],
        "method": "Shamir Share Public Commitment Hash",
        "timestamp": datetime.now().isoformat()
    })

    return {
        "status": "VERIFIED",
        "nominee_name": matched_nominee["name"],
        "relation": matched_nominee.get("relation", "Nominee"),
        "access_level": "NOMINEE_PARTIAL_KEY_HOLDER",
        "key_info": {
            "share_index": matched_nominee["assigned_share_index"],
            "share_preview": matched_nominee["formatted_share"],
            "public_commitment": matched_nominee["public_commitment"],
            "hmac_checksum": matched_nominee["hmac_checksum"][:16] + "...",
            "threshold_required": f"{state.threshold_k}-of-{state.total_n}",
            "your_role": f"NOMINEE (Share #{matched_nominee['assigned_share_index']} of {state.total_n})",
            "can_trigger_claim": True
        }
    }


@app.post("/api/vault/setup")
async def setup_vault(req: SetupVaultRequest):
    if len(req.nominees) < 3:
        raise HTTPException(status_code=400, detail="Minimum 3 nominees required for Shamir Secret Sharing")

    state.reset()
    state.owner_info = {
        "name": req.owner_name,
        "phone": req.owner_phone,
        "email": req.owner_email,
        "preferred_channels": req.preferred_channels
    }
    state.nominees = req.nominees
    state.total_n = len(req.nominees)
    state.threshold_k = min(3, state.total_n)
    state.check_in_interval_days = req.check_in_interval_days

    # 1. Store raw assets
    state.raw_assets = {
        "tier1_financial": req.tier1_assets,
        "tier2_credentials": req.tier2_assets,
        "tier3_memory_vault": req.tier3_assets
    }

    # 2. Generate Master Cryptographic Key & Encrypt Vault
    master_key = VaultEncryption.generate_master_key()
    state.encrypted_vault = VaultEncryption.encrypt_vault_data(master_key, state.raw_assets)

    # 3. Split Master Key into Shamir Shares (k-of-n)
    shares = ShamirSecretSharing.split_secret(master_key, state.threshold_k, state.total_n)
    state.master_key_shares = shares

    # Assign shares to nominees
    for i, nominee in enumerate(state.nominees):
        nominee["assigned_share_index"] = shares[i]["share_index"]
        nominee["assigned_share_hex"] = shares[i]["share_hex"]
        nominee["formatted_share"] = shares[i]["formatted"]
        nominee["public_commitment"] = shares[i]["public_commitment"]
        nominee["hmac_checksum"] = shares[i]["hmac_checksum"]

    # Generate owner passphrase hash
    state.owner_salt = py_secrets.token_hex(16)
    state.owner_passphrase_hash = hashlib.sha256(
        ("SECLOCK_OWNER_DEFAULT_PASS" + state.owner_salt).encode()
    ).hexdigest()
    state.owner_verified_sessions = []

    state.is_vault_setup = True
    state.last_check_in_time = datetime.now()
    state.liveness_status = "ACTIVE"

    # Append Genesis Setup event to Audit Ledger
    state.ledger.append_event("VAULT_CREATED", {
        "owner": req.owner_name,
        "nominee_count": state.total_n,
        "threshold": f"{state.threshold_k}-of-{state.total_n}",
        "check_in_frequency": f"Every {req.check_in_interval_days} days",
        "encryption": "AES-256-GCM + Shamir Secret Sharing"
    })

    return {
        "status": "SUCCESS",
        "message": "Vault encrypted and master key split into threshold nominee shares.",
        "shares": shares,
        "nominees": state.nominees
    }


@app.post("/api/liveness/check-in")
async def process_check_in(req: CheckInRequest):
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    state.last_check_in_time = datetime.now()
    state.liveness_status = "ACTIVE"

    state.ledger.append_event("LIVENESS_CHECKIN", {
        "channel": req.channel,
        "response_code": req.response_code or "OK_CONFIRMED",
        "timestamp": datetime.now().isoformat(),
        "status": "USER_ACTIVE"
    })

    return {
        "status": "SUCCESS",
        "message": f"Check-in received via {req.channel}. Liveness timer reset.",
        "liveness_status": "ACTIVE"
    }


@app.post("/api/liveness/upload-life-certificate")
async def upload_life_certificate(req: OCRVerifyRequest):
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    owner_name = state.owner_info.get("name", "Account Owner")
    res = LegalDocumentOCREngine.verify_life_certificate(req.document_text, owner_name)

    if res["status"] == "VERIFIED_ALIVE":
        state.last_check_in_time = datetime.now()
        state.liveness_status = "ACTIVE"

        state.ledger.append_event("LIFE_CERTIFICATE_VERIFIED", {
            "pramaan_id": res["extracted_data"]["pramaan_id"],
            "owner_name": owner_name,
            "issuing_authority": res["extracted_data"]["issuing_authority"],
            "confidence_score": f"{res['confidence_score']}%",
            "action": "LIVENESS_RESTORED_ACTIVE"
        })

    return res


@app.post("/api/liveness/simulate-miss")
async def simulate_liveness_miss():
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    state.last_check_in_time = datetime.now() - timedelta(days=state.check_in_interval_days + 45)
    state.liveness_status = "EXPIRED"

    state.ledger.append_event("LIVENESS_MISSED_CYCLE", {
        "days_elapsed": 75,
        "grace_period_status": "EXPIRED",
        "escalation_triggered": "SMS & IVR call attempts unanswered"
    })

    return {
        "status": "EXPIRED",
        "message": "Liveness check-in period expired. Escalation grace period passed."
    }


@app.post("/api/ocr/verify-document")
async def verify_legal_document(req: OCRVerifyRequest):
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    nominee_names = [n["name"] for n in state.nominees]
    res = LegalDocumentOCREngine.verify_document(
        document_text=req.document_text,
        expected_deceased_name=state.owner_info.get("name", ""),
        expected_nominee_names=nominee_names
    )

    state.legal_doc_status = res["status"]
    state.legal_doc_metadata = res["extracted_data"]

    state.ledger.append_event("LEGAL_DOC_SUBMITTED", {
        "ocr_status": res["status"],
        "confidence_score": f"{res['confidence_score']}%",
        "certificate_number": res["extracted_data"]["certificate_number"],
        "anomalies_detected": res["anomalies"]
    })

    if res["anomalies"]:
        state.anomalies.extend(res["anomalies"])

    return res


@app.post("/api/claim/submit-share")
async def submit_nominee_share(req: SubmitShareRequest):
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    if state.veto_triggered:
        raise HTTPException(status_code=403, detail="Claim blocked: Account Owner activated emergency veto!")

    state.submitted_nominee_shares[req.share_index] = (req.share_index, req.share_hex)

    state.ledger.append_event("NOMINEE_SHARE_SUBMITTED", {
        "nominee_name": req.nominee_name,
        "share_index": req.share_index,
        "total_shares_collected": len(state.submitted_nominee_shares),
        "threshold_required": state.threshold_k
    })

    # Evaluate Dual-Gating Release Conditions:
    # 1. Threshold nominee shares reached (k >= 3)
    # 2. Legal Document Verified
    # 3. Liveness Expired
    shares_count = len(state.submitted_nominee_shares)
    doc_ok = (state.legal_doc_status == "VERIFIED")
    liveness_ok = (state.liveness_status == "EXPIRED")

    unlocked_data = {}
    is_fully_reconstructed = False

    if shares_count >= state.threshold_k and doc_ok and liveness_ok:
        # Reconstruct master key
        share_tuples = list(state.submitted_nominee_shares.values())
        try:
            master_key = ShamirSecretSharing.reconstruct_secret(share_tuples, state.threshold_k)
            state.reconstructed_master_key = master_key
            decrypted = VaultEncryption.decrypt_vault_data(master_key, state.encrypted_vault)
            
            state.unlocked_tiers = ["Tier 1: Financial & Insurance", "Tier 2: Digital Credentials", "Tier 3: Memory Vault"]
            unlocked_data = decrypted
            is_fully_reconstructed = True

            state.ledger.append_event("THRESHOLD_KEY_RECONSTRUCTED", {
                "shares_used": shares_count,
                "staged_disclosure": "ALL_TIERS_RELEASED",
                "status": "SUCCESS"
            })
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Key reconstruction failed: {str(e)}")

    return {
        "status": "SUCCESS" if is_fully_reconstructed else "PENDING_REQUIREMENTS",
        "submitted_shares_count": shares_count,
        "threshold_required": state.threshold_k,
        "legal_doc_verified": doc_ok,
        "liveness_expired": liveness_ok,
        "is_reconstructed": is_fully_reconstructed,
        "unlocked_tiers": state.unlocked_tiers,
        "decrypted_vault": unlocked_data if is_fully_reconstructed else None
    }


@app.post("/api/owner/veto")
async def owner_emergency_veto():
    if not state.is_vault_setup:
        raise HTTPException(status_code=400, detail="Vault not yet configured.")

    state.veto_triggered = True
    state.submitted_nominee_shares.clear()
    state.legal_doc_status = "REJECTED"
    state.liveness_status = "ACTIVE"
    state.last_check_in_time = datetime.now()

    state.ledger.append_event("OWNER_VETO_TRIGGERED", {
        "action": "EMERGENCY_HALT",
        "reason": "Account owner alive & responded to alert. Claim attempt purged.",
        "timestamp": datetime.now().isoformat()
    })

    return {
        "status": "VETO_EXECUTED",
        "message": "Emergency abort triggered! All claim attempts canceled, liveness restored to ACTIVE."
    }


@app.get("/api/audit/ledger")
async def get_audit_ledger():
    return {
        "integrity": state.ledger.verify_integrity(),
        "compliance_report": state.ledger.export_compliance_report(state.owner_info.get("name", "Account Owner"))
    }


@app.post("/api/audit/simulate-tamper")
async def simulate_ledger_tamper(block_index: int = 1):
    ok = state.ledger.simulate_tamper(block_index)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid block index")
    return {
        "status": "TAMPER_SIMULATED",
        "tampered_block": block_index,
        "new_integrity": state.ledger.verify_integrity()
    }
