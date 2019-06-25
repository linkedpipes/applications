import { css } from 'docz-plugin-css';

export default {
  title: 'LinkedPipes Applications',
  description: 'LinkedPipes Applications frontend documentation',
  wrapper: 'src/wrapper',
  themeConfig: {
    mode: 'dark'
  },
  dest: 'docs',
  plugins: [css()]
};
