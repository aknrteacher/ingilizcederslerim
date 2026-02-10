#!/usr/bin/env python3
"""
Script to remove backgrounds from PNG images in the 3.6 directory.
Uses rembg library for AI-powered background removal.
"""

import os
from pathlib import Path
from rembg import remove
from PIL import Image
import io

def remove_background_from_image(input_path, output_path):
    """Remove background from a single image."""
    try:
        # Read the input image
        with open(input_path, 'rb') as input_file:
            input_data = input_file.read()
        
        # Remove background
        output_data = remove(input_data)
        
        # Save the output image
        with open(output_path, 'wb') as output_file:
            output_file.write(output_data)
        
        print(f"[OK] Processed: {os.path.basename(input_path)}")
        return True
    except Exception as e:
        print(f"[ERROR] Error processing {os.path.basename(input_path)}: {str(e)}")
        return False

def main():
    # Get the directory path
    script_dir = Path(__file__).parent
    images_dir = script_dir / "client" / "public" / "images" / "primary" / "3.6"
    
    if not images_dir.exists():
        print(f"Error: Directory not found: {images_dir}")
        return
    
    # Get all PNG files
    png_files = list(images_dir.glob("*.png"))
    
    if not png_files:
        print("No PNG files found in the directory.")
        return
    
    print(f"Found {len(png_files)} PNG files to process...")
    print("-" * 50)
    
    # Process each image
    success_count = 0
    for png_file in png_files:
        # Create backup first
        backup_path = png_file.with_suffix('.png.backup')
        if not backup_path.exists():
            import shutil
            shutil.copy2(png_file, backup_path)
        
        # Process the image
        if remove_background_from_image(png_file, png_file):
            success_count += 1
    
    print("-" * 50)
    print(f"Processing complete: {success_count}/{len(png_files)} images processed successfully.")
    print(f"Backups saved with .backup extension")

if __name__ == "__main__":
    main()
