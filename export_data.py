import urllib.request
import json
import os
import datetime

SUPABASE_URL = "https://ncyrjjzajgynpasmygwn.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jeXJqanphamd5bnBhc215Z3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MzU3ODksImV4cCI6MjA4ODMxMTc4OX0.6dD62Ydkf9du2O1B8IoYM-pscWdOjX96IqzOZKFcKd4"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY
}

os.makedirs("backup", exist_ok=True)

# 1. Fetch all data
all_data = {}
for table in ["fac_records", "fac_managers", "fac_restrict"]:
    req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/{table}?select=*", headers=headers)
    with urllib.request.urlopen(req) as resp:
        content = resp.read()
        data = json.loads(content.decode("utf-8"))
        all_data[table] = data
        with open(f"backup/{table}.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"[Backup] {table}: {len(data)} records saved to backup/{table}.json")

# 2. Generate seed_data.sql
sql_lines = [
    "-- Cloudflare D1 Migration Seed Data",
    "-- Generated at: " + datetime.datetime.now().isoformat(),
    ""
]

def sql_escape(val):
    if val is None:
        return "NULL"
    val_str = str(val).replace("'", "''")
    return f"'{val_str}'"

# Managers
sql_lines.append("-- 1. Managers")
for m in all_data["fac_managers"]:
    id_val = sql_escape(m.get("id"))
    name_val = sql_escape(m.get("name"))
    created_at = sql_escape(m.get("created_at") or datetime.datetime.now().isoformat())
    sql_lines.append(f"INSERT OR REPLACE INTO fac_managers (id, name, created_at) VALUES ({id_val}, {name_val}, {created_at});")

# Records
sql_lines.append("\n-- 2. Records")
for r in all_data["fac_records"]:
    id_val = sql_escape(r.get("id"))
    plate_val = sql_escape(r.get("plate"))
    date_val = sql_escape(r.get("date"))
    staff_val = sql_escape(r.get("staff"))
    note_val = sql_escape(r.get("note") or "")
    created_at = sql_escape(r.get("created_at") or datetime.datetime.now().isoformat())
    sql_lines.append(f"INSERT OR REPLACE INTO fac_records (id, plate, date, staff, note, created_at) VALUES ({id_val}, {plate_val}, {date_val}, {staff_val}, {note_val}, {created_at});")

# Restrict
sql_lines.append("\n-- 3. Restrict")
for res in all_data["fac_restrict"]:
    plate_val = sql_escape(res.get("plate"))
    status_val = sql_escape(res.get("status"))
    updated_at = sql_escape(res.get("updated_at") or datetime.datetime.now().isoformat())
    sql_lines.append(f"INSERT OR REPLACE INTO fac_restrict (plate, status, updated_at) VALUES ({plate_val}, {status_val}, {updated_at});")

with open("seed_data.sql", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines) + "\n")

print(f"[Seed SQL] Generated seed_data.sql with {len(sql_lines)} lines")
