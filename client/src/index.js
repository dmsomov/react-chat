import React from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'emoji-mart/css/emoji-mart.css'

import { App } from './App'

const GlodalStyles = createGlobalStyle`
.card-header {
  padding: 0.25em 0.25em
}
.card-body {
  padding: 0.25em 0.5em
}
.card-text {
  margin: 0;
}
`

const root = document.getElementById('root');
render(
  <>
    <GlodalStyles />
    <App />
  </>,
  root
)
