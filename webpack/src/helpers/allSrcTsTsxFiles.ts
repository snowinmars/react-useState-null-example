import glob from 'glob';

export const allSrcTsTsxFiles = (): Record<string, string> => glob.sync('./src/**/*[!.d].{ts,tsx}').reduce<Record<string, string>>((acc, file) => {
  acc[file
    .replace(/^\.\/src\//, '')
    .replace(/\.tsx$/, '')
    .replace(/\.ts$/, '')] = file;
  return acc;
}, {});
