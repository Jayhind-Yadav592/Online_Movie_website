import os

os.makedirs('frontend/src/features', exist_ok=True)

for file_idx in range(25):
    with open(f'frontend/src/features/MovieFeature{file_idx}.tsx', 'w', encoding='utf-8') as f:
        f.write('import { useState, useEffect, useCallback } from "react";\n\n')
        
        for i in range(400):
            func_id = file_idx * 1000 + i
            hook = f"""export const useAdvancedFeature{func_id} = (initialValue: number) => {{
  const [data, setData] = useState(initialValue + {func_id});
  
  const processData = useCallback(() => {{
    setData(prev => prev * 2 + {i});
  }}, []);

  useEffect(() => {{
    if (data < {func_id + 5000}) {{
      processData();
    }}
  }}, [data, processData]);

  return data;
}};
"""
            f.write(hook)
