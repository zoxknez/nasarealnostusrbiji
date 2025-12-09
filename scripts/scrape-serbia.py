# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "pandas",
#   "requests",
#   "lxml",
#   "html5lib",
# ]
# ///

"""
Scraper za podatke o Srbiji:
- Prosečne plate (paragraf.rs)
- Kurs dinara (NBS)
- Cene goriva (opciono)
"""

import pandas as pd
import json
from datetime import datetime

def get_serbia_salaries():
    """Povlači prosečne plate iz paragraf.rs"""
    url = "https://www.paragraf.rs/statistika/prosecna_mesecna_zarada_po_zaposlenom_u_republici_srbiji.html"
    
    try:
        tables = pd.read_html(url, decimal=",", thousands=".")
        df = tables[0]
        
        # Izvlači godinu iz kolone Mesec
        df["year"] = df["Mesec"].str.extract(r"(\d{4})").astype(int)
        
        # Prosečna godišnja plata (neto)
        annual = (
            df.groupby("year")["Iznos (bez poreza i doprinosa)"]
              .mean()
              .round(0)
              .astype(int)
              .reset_index()
              .rename(columns={"Iznos (bez poreza i doprinosa)": "avg_net_rsd"})
        )
        
        return annual
    except Exception as e:
        print(f"❌ Greška pri povlačenju plata: {e}")
        return None

def get_exchange_rate():
    """Prosečan kurs EUR/RSD za 2025 (aproksimacija)"""
    # U realnom scenariju, ovo bi bilo sa NBS API-ja
    return 117.0

def generate_serbia_data():
    """Generiše JSON podatke za Srbiju"""
    
    print("🇷🇸 Povlačim podatke za Srbiju...")
    
    salaries = get_serbia_salaries()
    
    if salaries is None:
        print("⚠️  Koristim statičke podatke zbog greške")
        latest_salary_rsd = 99631
    else:
        # Uzmi najnoviju godinu
        latest = salaries[salaries["year"] == salaries["year"].max()]
        latest_salary_rsd = int(latest["avg_net_rsd"].values[0])
    
    eur_rate = get_exchange_rate()
    latest_salary_eur = round(latest_salary_rsd / eur_rate, 2)
    
    data = {
        "country": "Serbia",
        "code": "RS",
        "salary_net_rsd": latest_salary_rsd,
        "salary_net_eur": latest_salary_eur,
        "pension_avg_rsd": 46800,
        "pension_avg_eur": 400,
        "eur_exchange_rate": eur_rate,
        "updated_at": datetime.now().isoformat()
    }
    
    print("✅ Podaci za Srbiju:")
    print(json.dumps(data, indent=2, ensure_ascii=False))
    
    return data

if __name__ == "__main__":
    generate_serbia_data()
