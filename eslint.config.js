import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/*.tsx'],
    extends: [jsxA11y.flatConfigs.strict],
    settings: {
      'jsx-a11y': {
        polymorphicPropName: 'as',
        components: {
          Button: 'button',
          IconButton: 'button',
          ShapedImage: 'img',
          TextLink: 'a',
          NavLink: 'a',
          Input: 'input',
          Select: 'select',
          Textarea: 'textarea',
          Label: 'label',
        },
      },
    },
    // Excepciones acordadas sobre strict. Ninguna regla se apaga: solo se amplían sus opciones, y ambas
    // ampliaciones ya existen en el preset recommended del propio plugin. No agregues otras sin preguntar.
    rules: {
      // body/iframe/img: valores por defecto de strict, se repiten porque pasar opciones las reemplaza.
      // dialog: Lightbox y MobileMenu son <dialog> modales (showModal) y necesitan escuchar en el propio
      // diálogo:
      //   - onKeyDown/onKeyUp: el focus trap de useModalDialog (ciclo de Tab dentro del modal, exigido
      //     por CLAUDE.md §6) y las flechas ← → que cambian de foto en el Lightbox.
      //   - onClick: cerrar MobileMenu al hacer clic en el backdrop. Es un atajo solo para ratón; el
      //     cierre accesible ya lo cubren Escape (nativo) y el botón "Cerrar menú".
      'jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        {
          body: ['onError', 'onLoad'],
          iframe: ['onError', 'onLoad'],
          img: ['onError', 'onLoad'],
          dialog: ['onKeyDown', 'onKeyUp', 'onClick'],
        },
      ],
      // tabpanel: SpacesShowcase sigue el patrón tabs de APG, que pide tabIndex={0} en el tabpanel
      // cuando su primer contenido no es enfocable (aquí abre con una imagen). Sin él, quien navega con
      // teclado salta de la pestaña al botón sin pasar por la descripción del espacio.
      'jsx-a11y/no-noninteractive-tabindex': ['error', { tags: [], roles: ['tabpanel'] }],
    },
  },
])
