import sys
from fastapi.testclient import TestClient
from main import app, state

client = TestClient(app)

def run_e2e_tests():
    print("==========================================================================")
    print(" Running End-to-End Automated Integration Tests for Seclock ")
    print("==========================================================================")

    state.reset()
    res = client.get("/api/state")
    assert res.status_code == 200
    assert res.json()["is_vault_setup"] == False
    print("✓ Initial system state test PASSED")


    # 2. Test Vault Setup & Shamir 3-of-5 Key Splitting
    setup_payload = {
        "owner_name": "K. V. Ramachandran Nair",
        "owner_phone": "+91 98470 12345",
        "owner_email": "ramachandran.kv@gmail.com",
        "preferred_channels": ["App", "SMS", "IVR"],
        "check_in_interval_days": 30,
        "nominees": [
            {"name": "Priya Ramachandran", "phone": "+91 98471 99881", "relation": "Daughter"},
            {"name": "Anil Nair", "phone": "+91 94472 44332", "relation": "Son"},
            {"name": "Dr. Radhika Nair", "phone": "+91 98950 11223", "relation": "Sister"},
            {"name": "Adv. Suresh Kumar", "phone": "+91 98460 77889", "relation": "Legal Counsel"},
            {"name": "Vijayalakshmi Amma", "phone": "+91 94461 55667", "relation": "Spouse"}
        ],
        "tier1_assets": [{"bank": "State Bank of India", "acc": "30489102934", "balance": "INR 6,50,000"}],
        "tier2_assets": [{"credentials": "ramachandran.kv@gmail.com"}],
        "tier3_assets": [{"note": "Family ancestral land details"}]
    }

    res = client.post("/api/vault/setup", json=setup_payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "SUCCESS"
    assert len(data["shares"]) == 5
    shares = data["shares"]
    print(f"✓ Vault Setup PASSED (Generated 5 shares with threshold {state.threshold_k})")

    # 3. Test Multi-Channel Liveness Check-ins
    res = client.post("/api/liveness/check-in", json={"channel": "App", "response_code": "APP_BIOMETRIC"})
    assert res.status_code == 200
    assert res.json()["liveness_status"] == "ACTIVE"

    res = client.post("/api/liveness/check-in", json={"channel": "SMS", "response_code": "YES 4829"})
    assert res.status_code == 200

    res = client.post("/api/liveness/check-in", json={"channel": "IVR", "response_code": "DTMF_KEY_1"})
    assert res.status_code == 200
    print("✓ Multi-Channel Check-in (App, SMS, IVR) test PASSED")

    # 4. Test Liveness Miss Simulation
    res = client.post("/api/liveness/simulate-miss")
    assert res.status_code == 200
    assert res.json()["status"] == "EXPIRED"
    print("✓ Liveness Escalation & Expiry simulation PASSED")

    # 4b. Test Life Certificate (Jeevan Pramaan) Upload & Liveness Restoration
    life_cert_text = """
    GOVERNMENT OF INDIA
    JEEVAN PRAMAAN — DIGITAL LIFE CERTIFICATE
    Pramaan ID: JP-98471029348
    Account Owner / Pensioner: K. V. RAMACHANDRAN NAIR
    Aadhaar Biometric Verification: AADHAAR_IRIS_FINGERPRINT_VERIFIED
    Issuing Authority: JEEVAN PRAMAAN ONLINE PORTAL / UIDAI
    Status: ACTIVE — PERSON CONFIRMED ALIVE
    """
    res = client.post("/api/liveness/upload-life-certificate", json={"document_text": life_cert_text})
    assert res.status_code == 200
    life_res = res.json()
    assert life_res["status"] == "VERIFIED_ALIVE"
    assert client.get("/api/state").json()["liveness_status"] == "ACTIVE"
    print("✓ Life Certificate (Jeevan Pramaan) Upload & Liveness Restoration PASSED")

    # Re-expire for claim testing step below
    client.post("/api/liveness/simulate-miss")


    # 5. Test Legal Document OCR Verification
    doc_text = """
    GOVERNMENT OF KERALA - DEPARTMENT OF ECONOMICS AND STATISTICS
    FORM NO. 6 — DEATH CERTIFICATE
    Registration Number: KL-D-2025-098412
    Date of Death: 14/05/2025
    Name of Deceased: K. V. RAMACHANDRAN NAIR
    Nominee / Informant Name: PRIYA RAMACHANDRAN
    Issuing Authority: SUB-REGISTRAR / TAHSILDAR OFFICE
    """
    res = client.post("/api/ocr/verify-document", json={"document_text": doc_text})
    assert res.status_code == 200
    ocr_res = res.json()
    assert ocr_res["status"] == "VERIFIED"
    assert ocr_res["confidence_score"] >= 70
    print(f"✓ Indian Legal Document OCR Verification PASSED (Confidence: {ocr_res['confidence_score']}%)")

    # 6. Test Submitting Nominee Shares (2 shares -> Pending; 3 shares -> Reconstructed)
    # Submit Share 1
    s1 = shares[0]
    res = client.post("/api/claim/submit-share", json={
        "nominee_name": "Priya Ramachandran",
        "share_index": s1["share_index"],
        "share_hex": s1["share_hex"]
    })
    assert res.json()["is_reconstructed"] == False

    # Submit Share 2
    s2 = shares[1]
    res = client.post("/api/claim/submit-share", json={
        "nominee_name": "Anil Nair",
        "share_index": s2["share_index"],
        "share_hex": s2["share_hex"]
    })
    assert res.json()["is_reconstructed"] == False
    print("✓ Partial nominee shares (2/5) correctly held pending threshold")

    # Submit Share 3 (Meets 3-of-5 Threshold!)
    s3 = shares[2]
    res = client.post("/api/claim/submit-share", json={
        "nominee_name": "Dr. Radhika Nair",
        "share_index": s3["share_index"],
        "share_hex": s3["share_hex"]
    })
    claim_res = res.json()
    assert claim_res["is_reconstructed"] == True
    assert claim_res["decrypted_vault"] is not None
    assert claim_res["decrypted_vault"]["tier1_financial"][0]["bank"] == "State Bank of India"
    print("✓ Threshold Master Key Reconstruction & Decryption PASSED (3-of-5 shares)")

    # 7. Test Audit Ledger Integrity
    res = client.get("/api/audit/ledger")
    assert res.status_code == 200
    ledger_res = res.json()
    assert ledger_res["integrity"]["is_valid"] == True
    print(f"✓ Tamper-Evident SHA-256 Audit Ledger PASSED ({ledger_res['compliance_report']['total_audit_events']} blocks verified)")

    # 8. Test Tamper Detection
    res = client.post("/api/audit/simulate-tamper?block_index=1")
    assert res.status_code == 200
    assert res.json()["new_integrity"]["is_valid"] == False
    print("✓ Cryptographic Tampering Detection PASSED")

    # 9. Test Emergency Owner Veto
    res = client.post("/api/owner/veto")
    assert res.status_code == 200
    assert res.json()["status"] == "VETO_EXECUTED"
    print("✓ Emergency Account Owner Veto PASSED")

    print("==========================================================================")
    print(" ALL 9 SECLOCK E2E VERIFICATION TESTS PASSED SUCCESSFULLY! ")
    print("==========================================================================")

if __name__ == "__main__":
    run_e2e_tests()
