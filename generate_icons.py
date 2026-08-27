import os

os_path = 'frontend/src/components/ui'
os.makedirs(os_path, exist_ok=True)

with open(f'{os_path}/MassiveIcons.tsx', 'w') as f:
    f.write('import React from "react";\n\n')
    for i in range(50000):
        f.write(f'export const Icon{i} = () => <svg width="{i}" height="{i}"><circle cx="50" cy="50" r="40" /></svg>;\n')
