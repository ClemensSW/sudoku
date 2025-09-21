import os
import sys
import argparse
import uuid

def should_convert(name: str, include_jpeg: bool) -> bool:
    if name.endswith(".JPG"):
        return True
    if include_jpeg and name.endswith(".JPEG"):
        return True
    return False

def target_name(filename: str) -> str:
    # nur die Endung kleinschreiben; Rest des Namens bleibt gleich
    base, ext = os.path.splitext(filename)
    return base + ext.lower()

def two_step_rename(old_path: str, new_path: str, dry_run: bool):
    """
    Führt unter Windows/NTFS einen 2-Step-Rename durch, falls Quelle/Ziel
    sich nur in der Groß-/Kleinschreibung unterscheiden.
    """
    # Temporärer Dateiname im gleichen Ordner
    dirpath = os.path.dirname(old_path)
    temp_path = os.path.join(dirpath, f".__tmp_rename__{uuid.uuid4().hex}")

    if dry_run:
        print(f"➡️  (Dry-Run) {old_path} -> {new_path}")
        return True

    # Schritt 1: alter Name -> temporärer Name
    os.rename(old_path, temp_path)
    # Schritt 2: temporärer Name -> neuer Name
    os.rename(temp_path, new_path)
    return True

def main():
    parser = argparse.ArgumentParser(
        description="Bennt .JPG (und optional .JPEG) rekursiv zu Kleinbuchstaben-Endungen um."
    )
    parser.add_argument("--include-jpeg", action="store_true",
                        help="Auch .JPEG -> .jpeg umbenennen.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Nur anzeigen, was passieren würde.")
    parser.add_argument("--replace", action="store_true",
                        help="Falls eine .jpg/.jpeg-Datei bereits existiert, sie überschreiben.")
    args = parser.parse_args()

    root_dir = os.path.dirname(os.path.abspath(__file__))

    total = 0
    renamed = 0
    skipped_existing = 0
    skipped_other = 0
    errors = 0

    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if not should_convert(filename, args.include_jpeg):
                continue

            total += 1
            old_path = os.path.join(dirpath, filename)
            new_filename = target_name(filename)
            new_path = os.path.join(dirpath, new_filename)

            # Fall A: Nur Groß-/Kleinschreibung ändert sich (selbe Datei)
            if os.path.normcase(old_path) == os.path.normcase(new_path):
                try:
                    two_step_rename(old_path, new_path, args.dry_run)
                    renamed += 1
                    if not args.dry_run:
                        print(f"✅ Umbenannt (Case-Fix): {old_path} -> {new_path}")
                    else:
                        print(f"➡️  (Dry-Run) {old_path} -> {new_path}")
                except Exception as e:
                    errors += 1
                    print(f"❌ Fehler bei {old_path}: {e}")
                continue

            # Fall B: Ziel existiert bereits (andere Datei mit gleicher .jpg-Endung)
            if os.path.exists(new_path):
                if args.replace:
                    try:
                        if not args.dry_run:
                            # vorhandene Zieldatei entfernen und umbenennen
                            os.remove(new_path)
                            os.rename(old_path, new_path)
                        renamed += 1
                        print(f"♻️  Ersetzt: {old_path} -> {new_path}")
                    except Exception as e:
                        errors += 1
                        print(f"❌ Fehler (Ersetzen) bei {old_path}: {e}")
                else:
                    skipped_existing += 1
                    print(f"⚠️ Übersprungen: {new_path} existiert bereits. (Nutze --replace zum Ersetzen)")
                continue

            # Fall C: Normales Umbenennen (unterschiedliche Pfade, Ziel nicht vorhanden)
            try:
                if not args.dry_run:
                    os.rename(old_path, new_path)
                renamed += 1
                if args.dry_run:
                    print(f"➡️  (Dry-Run) {old_path} -> {new_path}")
                else:
                    print(f"✅ Umbenannt: {old_path} -> {new_path}")
            except Exception as e:
                errors += 1
                print(f"❌ Fehler bei {old_path}: {e}")

    print("\n--- Zusammenfassung ---")
    print(f"Gefundene Kandidaten : {total}")
    print(f"Umbenannt            : {renamed}")
    print(f"Übersprungen (exist.) : {skipped_existing}")
    print(f"Übersprungen (sonst)  : {skipped_other}")
    print(f"Fehler               : {errors}")
    if args.dry_run:
        print("(Dry-Run: Es wurden keine Dateien geändert.)")

if __name__ == "__main__":
    main()
