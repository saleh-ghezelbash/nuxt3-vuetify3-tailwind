<template>
    <svg
      version="1.1"
      role="presentation"
      width="16"
      height="16"
      :fill="fill"
      viewBox="0 0 512 512"
    >
      <path
        d="M256 8C119 8 8 119 8 256S119 504 256 504 504 393 504 256 393 8 256 8zM313.1 358.1L224.9 294C221.8 291.7 220
        288.1 220 284.3V116C220 109.4 225.4 104 232 104H280C286.6 104 292 109.4 292 116V253.7L355.5 299.9C360.9 303.8
        362 311.3 358.1 316.7L329.9 355.5C326 360.8 318.5 362 313.1 358.1z"
      />
    </svg>
  </template>
  
  <script>
  export default {
    props: {
      fill: { type: String, default: '#f9f9f9' }
    }
  }
  </script>