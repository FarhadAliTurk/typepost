export interface PostConfig {
  avatar: string | null;
  name: string;
  username: string;
  text: string;
}

export interface ExportConfig {
  format: 'png' | 'jpeg';
  scale: number;
  mode: 'auto' | 'square'; // Auto height vs 1080x1080 square
  background: 'transparent' | 'color';
}