#!/usr/bin/env python3
"""
Script to restore backup images by renaming .png.backup files to .png
and moving them back to the parent directory.
"""

import os
import shutil
from pathlib import Path

def main():
    # Get the backup directory path
    script_dir = Path(__file__).parent
    backup_dir = script_dir / "client" / "public" / "images" / "primary" / "3.6" / "backup"
    target_dir = script_dir / "client" / "public" / "images" / "primary" / "3.6"
    
    if not backup_dir.exists():
        print(f"Error: Backup directory not found: {backup_dir}")
        return
    
    # Get all .backup files
    backup_files = list(backup_dir.glob("*.backup"))
    
    if not backup_files:
        print("No backup files found in the directory.")
        return
    
    print(f"Found {len(backup_files)} backup files to restore...")
    print("-" * 50)
    
    # Restore each file
    success_count = 0
    for backup_file in backup_files:
        try:
            # Get the original filename (remove .backup extension)
            original_name = backup_file.stem  # This removes .backup, leaving .png
            target_path = target_dir / original_name
            
            # Copy the backup file to the target location with .png extension
            shutil.copy2(backup_file, target_path)
            
            print(f"[OK] Restored: {original_name}")
            success_count += 1
        except Exception as e:
            print(f"[ERROR] Error restoring {backup_file.name}: {str(e)}")
    
    print("-" * 50)
    print(f"Restoration complete: {success_count}/{len(backup_files)} files restored successfully.")

if __name__ == "__main__":
    main()
