import subprocess
import os

# Step 1: Create export directory
export_dir = os.path.join(os.getcwd(), "exported_metadata")
os.makedirs(export_dir, exist_ok=True)

# Step 2: Change into export directory
os.chdir(export_dir)

# Step 3: Run SF CLI export command using subprocess
subprocess.run([
    "C:\\Program Files\\sf\\bin\\sf.cmd",
    "project", "retrieve", "start",
    "--manifest", "../manifest/package.xml",  # Make sure package.xml is present in root
    "--target-org", "mysourceorg"
])
