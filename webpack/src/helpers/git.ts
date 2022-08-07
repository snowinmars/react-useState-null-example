// eslint-disable-next-line camelcase
import child_process from 'child_process';

export const git = (command: string): string | null => {
  try {
    // eslint-disable-next-line camelcase
    return child_process.execSync(`git ${command}`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};

