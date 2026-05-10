import os
import re

def check_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()

    # Very simple function detection for TS/TSX
    # Matches: export const name = (...) => { or const name = (...) => {
    func_pattern = re.compile(r'(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\(.*?\)\s*(?::\s*.*?)?\s*=>\s*{')

    for i, line in enumerate(lines):
        match = func_pattern.search(line)
        if match:
            name = match.group(1)
            start = i
            # Find the closing brace (simplistic)
            brace_count = 1
            end = start
            for j in range(start + 1, len(lines)):
                brace_count += lines[j].count('{')
                brace_count -= lines[j].count('}')
                if brace_count == 0:
                    end = j
                    break

            length = end - start + 1
            if length > 30:
                print(f"{filepath}:{start+1} - Function '{name}' is {length} lines long")

for root, dirs, files in os.walk('src'):
    if 'node_modules' in dirs:
        dirs.remove('node_modules')
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            check_file(os.path.join(root, file))
