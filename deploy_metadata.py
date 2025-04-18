import subprocess
import os

# Path to the export folder
export_path = os.path.join(os.getcwd(), "exported_metadata")

# Run deploy command
subprocess.run([
    "C:\\Program Files\\sf\\bin\\sf.cmd",
    "project", "deploy", "start",
    "--manifest", "../manifest/package.xml",
    "--target-org", "mysourceorg"
], cwd=export_path)
