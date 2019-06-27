import { css } from 'docz-plugin-css';

export default {
  title: 'LinkedPipes Applications',
  description: 'LinkedPipes Applications frontend documentation',
  repository: 'https://github.com/linkedpipes/applications',
  ordering: 'ascending',
  wrapper: 'src/wrapper',
  menu: ['Getting Started', 'Containers', 'Components'],
  themeConfig: {
    mode: 'dark',
    colors: {
      primary: '#fba333',
      secondary: '#00695c',
      gray: 'lightslategray'
    },
    logo: {
      src: 'https://i.ibb.co/0hfBm6J/lpapps-documentation-logo.png',
      width: 220
    },
    repository: 'https://github.com/linkedpipes/applications'
  },
  dest: 'docs',
  hashRouter: true,
  plugins: [css()]
};
