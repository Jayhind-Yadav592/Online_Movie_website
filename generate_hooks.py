import os

os.makedirs('frontend/src/hooks', exist_ok=True)

with open('frontend/src/hooks/useMovieFeatures.tsx', 'w', encoding='utf-8') as f:
    f.write('import { useState, useEffect } from "react";\n\n')
    
    for i in range(8000):
        hook = f"""export const useMovieFeature{i} = (initialId: number) => {{
  const [state, setState] = useState(initialId + {i});
  useEffect(() => {{
    if (state < {i + 100}) {{
      setState(prev => prev + 1);
    }}
  }}, [state]);
  return state;
}};
"""
        f.write(hook)
