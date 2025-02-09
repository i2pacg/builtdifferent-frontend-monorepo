import { Plugin } from 'vite';
import path from 'path';
import fs from 'fs';

function multiAliasPlugin(alias: string, directories: string[]): Plugin {
  return {
    name: 'vite-plugin-multi-alias',
    resolveId(source, importer) {
      // Debugging: Log each source handled by the plugin
      console.log('Resolving source:', source,alias);

      if (!source.startsWith(alias) || source.startsWith('plugin-')) {
        console.log('Skipping source:', source);
        return null;
      }

      const relativePath = source.slice(alias.length);

      for (const dir of directories) {
        console.log('Checking in:', dir);
        const fullPath = path.resolve(dir, relativePath);
        console.log('Checking:', fullPath);
        if (fs.existsSync(fullPath)) {
          console.log('Resolved to:', fullPath);
          return fullPath;
        }
      }

      console.log('No match found for:', source);
      return null;
    },
  };
}

export default multiAliasPlugin;
