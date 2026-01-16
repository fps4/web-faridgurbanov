import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// NOTE: title is mapped to the i18n keys set in navbar.json
export const navData = (lang = 'en') => [
  { title: 'overview', path: paths(lang).home, icon: <Iconify width={22} icon="solar:home-2-linear" /> },
  { title: 'expertise', path: paths(lang).expertise, icon: <Iconify width={22} icon="solar:document-text-outline" /> },  
  { title: 'contact', path: paths(lang).contact, icon: <Iconify width={22} icon="solar:document-text-outline" /> },
  // { title: 'projects', path: paths(lang).projects, icon: <Iconify width={22} icon="solar:document-text-outline" /> },
  // { title: 'repositories', path: paths(lang).repositories, icon: <Iconify width={22} icon="solar:document-text-outline" /> },
  // { title: 'bookshelf', path: paths(lang).bookshelf, icon: <Iconify width={22} icon="solar:document-text-outline" /> },
];
