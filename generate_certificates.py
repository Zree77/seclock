import os
from PIL import Image, ImageDraw, ImageFont

def generate_sample_death_certificate():
    dir_path = os.path.join(os.path.dirname(__file__), "sample_certificates")
    os.makedirs(dir_path, exist_ok=True)
    img_path = os.path.join(dir_path, "sample_death_certificate.png")

    # Create document canvas
    width, height = 800, 1000
    image = Image.new("RGB", (width, height), color=(252, 252, 250))
    draw = ImageDraw.Draw(image)

    # Decorative Border
    draw.rectangle([20, 20, width - 20, height - 20], outline=(40, 80, 140), width=4)
    draw.rectangle([28, 28, width - 28, height - 28], outline=(180, 150, 80), width=2)

    # Header
    draw.text((260, 50), "GOVERNMENT OF KERALA", fill=(10, 40, 90))
    draw.text((230, 75), "DEPARTMENT OF ECONOMICS AND STATISTICS", fill=(40, 40, 40))
    draw.text((275, 100), "FORM NO. 6 — DEATH CERTIFICATE", fill=(160, 20, 20))
    draw.text((120, 125), "(Issued under Section 12/17 of the Registration of Births and Deaths Act, 1969)", fill=(80, 80, 80))

    # Divider Line
    draw.line([50, 155, width - 50, 155], fill=(40, 80, 140), width=2)

    # Certificate Metadata Fields
    fields = [
        ("Registration Number:", "KL-D-2025-098412"),
        ("Date of Registration:", "18/05/2025"),
        ("Name of Deceased:", "K. V. RAMACHANDRAN NAIR"),
        ("Sex / Age:", "MALE / 74 YEARS"),
        ("Date of Death:", "14/05/2025"),
        ("Place of Death:", "KOZHIKODE MEDICAL CENTER, KERALA"),
        ("Father's / Husband's Name:", "LATE UNNIKRISHNAN NAIR"),
        ("Permanent Address:", "HOUSE NO. 42/108, CHEVAYUR, KOZHIKODE - 673017"),
        ("Nominee / Informant Name:", "PRIYA RAMACHANDRAN (DAUGHTER)"),
        ("Relationship:", "DAUGHTER & REGISTERED LEGAL HEIR"),
        ("Issuing Authority:", "SUB-REGISTRAR / TAHSILDAR OFFICE, KOZHIKODE"),
    ]

    y = 190
    for label, val in fields:
        draw.text((70, y), label, fill=(30, 30, 30))
        draw.text((320, y), val, fill=(10, 20, 50))
        y += 42
        draw.line([70, y - 10, width - 70, y - 10], fill=(230, 230, 230), width=1)

    # Simulated Government Seal & QR Code
    draw.ellipse([100, y + 30, 220, y + 150], outline=(0, 100, 60), width=3)
    draw.text((115, y + 80), "GOVT OF KERALA\n  * SEAL *", fill=(0, 100, 60))

    # QR Code placeholder
    draw.rectangle([width - 220, y + 30, width - 100, y + 150], fill=(240, 240, 240), outline=(0, 0, 0), width=2)
    draw.text((width - 200, y + 75), "[ QR CODE ]\nHMAC-SHA256", fill=(40, 40, 40))

    # Footer Signature
    draw.text((width - 320, y + 170), "Digitally Signed by Registrar", fill=(10, 30, 80))
    draw.text((width - 320, y + 195), "Date: 18/05/2025 11:24:05 IST", fill=(100, 100, 100))

    image.save(img_path)
    print(f"Generated sample death certificate at {img_path}")


def generate_sample_life_certificate():
    dir_path = os.path.join(os.path.dirname(__file__), "sample_certificates")
    os.makedirs(dir_path, exist_ok=True)
    img_path = os.path.join(dir_path, "sample_life_certificate.png")

    width, height = 800, 950
    image = Image.new("RGB", (width, height), color=(248, 250, 252))
    draw = ImageDraw.Draw(image)

    # Outer Border
    draw.rectangle([20, 20, width - 20, height - 20], outline=(16, 185, 129), width=4)
    draw.rectangle([28, 28, width - 28, height - 28], outline=(56, 189, 248), width=2)

    # Header
    draw.text((250, 50), "GOVERNMENT OF INDIA", fill=(10, 40, 90))
    draw.text((180, 75), "JEEVAN PRAMAAN — DIGITAL LIFE CERTIFICATE", fill=(16, 185, 129))
    draw.text((230, 100), "(Biometric Pensioner Life Verification)", fill=(80, 80, 80))

    draw.line([50, 135, width - 50, 135], fill=(16, 185, 129), width=2)

    fields = [
        ("Pramaan ID (Certificate No):", "JP-98471029348"),
        ("Date of Issue:", "10/08/2026"),
        ("Account Owner / Pensioner:", "K. V. RAMACHANDRAN NAIR"),
        ("Aadhaar Number (Masked):", "XXXX-XXXX-8912"),
        ("Biometric Status:", "AADHAAR IRIS & FINGERPRINT VERIFIED"),
        ("Verification Center / Portal:", "JEEVAN PRAMAAN ONLINE PORTAL / UIDAI"),
        ("Validity Period:", "VALID UNTIL AUGUST 2027"),
        ("Status:", "ACTIVE — PERSON CONFIRMED ALIVE")
    ]

    y = 170
    for label, val in fields:
        draw.text((70, y), label, fill=(30, 30, 30))
        draw.text((340, y), val, fill=(10, 80, 50))
        y += 44
        draw.line([70, y - 10, width - 70, y - 10], fill=(230, 230, 230), width=1)

    # Seal & QR
    draw.ellipse([100, y + 30, 220, y + 150], outline=(16, 185, 129), width=3)
    draw.text((115, y + 80), "GOVT OF INDIA\n* VERIFIED *", fill=(16, 185, 129))

    draw.rectangle([width - 220, y + 30, width - 100, y + 150], fill=(240, 240, 240), outline=(0, 0, 0), width=2)
    draw.text((width - 200, y + 75), "[ QR CODE ]\nUIDAI SIGNATURE", fill=(40, 40, 40))

    image.save(img_path)
    print(f"Generated sample life certificate at {img_path}")


if __name__ == "__main__":
    generate_sample_death_certificate()
    generate_sample_life_certificate()

